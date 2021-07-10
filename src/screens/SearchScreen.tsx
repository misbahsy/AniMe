import React, {useState} from 'react';
import {Image, ImageBackground, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {Button, Card, Icon, LinearProgress, Overlay} from "react-native-elements";
import axios from "axios";
import {APP_STYLES} from "../Constants";
import {SafeAreaView} from "react-native-safe-area-context";
import PhotoGrid from "../components/PhotoGrid";
import Upgrade from "../components/Upgrade";

let interval = null;
export default function SearchScreen(props) {
  const [image, setImage] = useState(null);
  const [tonyImage, _setTonyImage] = useState(null);
  const [progress, _setProgress] = useState(0.1);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [model, _setModal] = useState(false);
  const progressRef = React.useRef(progress);
  const modalRef = React.useRef(model);
  const tonyImageRef = React.useRef(tonyImage);
  const setProgress = x => {
    progressRef.current = x; // keep updated
    _setProgress(x);
  };
  const setModal = x => {
    modalRef.current = x; // keep updated
    _setModal(x);
  };
  const setTonyImage = x => {
    tonyImageRef.current = x; // keep updated
    _setTonyImage(x);
  };
  const handleResults = async (result) => {
    if (!result.cancelled) {
      await setImage(result.uri);
      await setModal(true)
      setTimeout(() => {
        interval = setInterval(() => {
          setProgress(progressRef.current + 0.1)
          if (!modalRef.current) {
            clearInterval(interval)
            setProgress(0.0);
            setTonyImage(null);
          } else if (progressRef.current >= 1 && tonyImageRef.current != null) {
            clearInterval(interval);
            setProgress(0.0);
            setImage(null)
            setModal(false)
            props.navigation.replace('Result', {image: tonyImageRef.current})
          }
        }, 1000)
      }, 1000)
      submitImage(result)
    }
  }
  const submitImage = async (image) => {
    try {
      setTonyImage(null);
      const form = new FormData();
      const localUri = image.uri;
      const filename = localUri.split('/').pop();
      const type = props.route.params && props.route.params.type ? props.route.params.type : 'toonifyplus';
      form.append("image", {uri: localUri, name: filename, type: 'image/jpg'});

      axios({
        method: 'POST',
        url: `https://toonify.p.rapidapi.com/v0/${type}`,
        params: {proceed_without_face: 'false', return_aligned: 'false'},
        headers: {
          'content-type': 'multipart/form-data; boundary=---011000010111000001101001',
          'x-rapidapi-host': 'toonify.p.rapidapi.com',
          "x-rapidapi-key": "09db32faeemshf6ade820c9cc6d9p1e814ejsnca047afa3834",
        },
        data: form
      }).then((response) => {
        if (response.status === 200 && modalRef.current) {
          setTonyImage(response.data.b64_encoded_output)
        } else {
          setTonyImage(null);
        }
      }).catch((error) => {
        setTonyImage(null);
        setModal(false);
        setTimeout(()=>{
          alert('Error: No face or multiple faces detected. Please try another image.')
        },500)

        console.error('error', type);
      });
    } catch (e) {
      console.log('e ', e)
    }
  }
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.headerContainer}>
          <Icon
            name='arrowleft'
            type='antdesign'
            color={APP_STYLES.iconColor}
            size={30}
            onPress={() => {
              props.navigation.goBack();
            }}
          />
          <TouchableOpacity
            onPress={() => {
              setShowUpgrade(true)
            }}
            style={{height: '100%', alignItems: 'center', flexDirection: 'row'}}>
            <Image style={{width: 30, height: 30, marginRight: 20}}
                   source={require('./../../assets/images/ic_pro.png')}/>
            {/*<Image
              style={{width: 25, height: 25, tintColor: APP_STYLES.iconColor}}
              source={require('./../../assets/images/ic_settings.png')}/>*/}
          </TouchableOpacity>
        </View>
        <PhotoGrid
          onItemSelect={async (url) => {
            handleResults({canceled: false, uri: encodeURI(url)})
          }}
          visible={true}
        />
        <Overlay isVisible={model} style={{width: wp(100), height: hp(100)}}>
          <ImageBackground
            resizeMode={'cover'}
            blurRadius={50}
            style={{width: wp(100), height: hp(100), alignItems: 'center', backgroundColor: '#000'}}
            source={{uri: image}}>
            <View style={{width: '100%', height: '100%', backgroundColor: '#00000088', paddingTop: hp(5)}}>
              <View style={{width: '90%', alignItems: 'flex-start'}}>
                <Icon
                  style={{marginLeft: 20}}
                  name='close'
                  color={'#fff'}
                  type='antdesign'
                  size={30}
                  onPress={() => {
                    setImage(null);
                    setTonyImage(null)
                    setProgress(0.0)
                    setModal(false)
                  }}
                />
              </View>
              <View style={{width: '100%', alignItems: 'center', height: '90%', justifyContent: 'center'}}>
                <Text
                  style={{
                    fontSize: 18,
                    color: '#fff',
                    fontWeight: 'bold',
                    marginBottom: hp(2)
                  }}>{'Processing image with standard speed...'}</Text>
                <LinearProgress
                  style={{width: '80%', height: 6, borderRadius: 5}}
                  trackColor={'#A7BBC7'}
                  color={'#fff'}
                  value={progress}
                  variant={'determinate'}/>
                <Button
                  containerStyle={{marginTop: hp(6)}}
                  buttonStyle={{backgroundColor: '#E1701A', width: 160, height: 50}}
                  title={'SPEED UP!'}/>

              </View>
            </View>
          </ImageBackground>

        </Overlay>
        <Upgrade visible={showUpgrade} onClose={() => setShowUpgrade(false)}/>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: wp(90),
    height: 50,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  imageContainer: {
    flexDirection: 'row',
    width: '48.5%',
    height: 170,
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  images: {
    flexDirection: 'row',
    width: '100%',
    padding: 5,
    justifyContent: 'space-between'
  },
  details: {
    flexDirection: 'row',
    width: '100%',
    padding: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp(1),
    marginBottom: hp(0)
  },
  cartoonSmall: {
    width: '48%',
    height: '48%',
    borderRadius: 10
  },
  cartoonPlayIcon: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cartoonRight: {},
  cartoonBottom: {
    marginTop: 5
  },
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: APP_STYLES.backgroundColor,
    width: wp(100),
    height: hp(100)
  },
  cartoonTitle: {
    fontSize: 25,
    color: APP_STYLES.textColor,
    fontWeight: 'bold'
  },
  cartoonDescr: {
    marginTop: 5,
    fontSize: 15,
    color: 'rgb(104,104,105)',
  }

});
