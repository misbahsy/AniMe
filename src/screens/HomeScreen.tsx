import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  ImageBackground, Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {Button, Card, Icon, LinearProgress, Overlay} from "react-native-elements";
import * as ImagePicker from 'expo-image-picker';
import axios from "axios";
import {APP_STYLES} from "../Constants";
import {SafeAreaView} from "react-native-safe-area-context";
import Picker from "../components/Picker";
import PhotoGrid from "../components/PhotoGrid";
import Upgrade from "../components/Upgrade";
import {AdMobInterstitial, requestPermissionsAsync} from "expo-ads-admob";

const data = [
  {
    key: '1',
    title: '3D Cartoon',
    type: '',
    description: 'Transform your photos into animated movies 3D cartoon characters',
    image1: require('./../../assets/images/img_cartoon3d_1.png'),
    image2: require('./../../assets/images/img_cartoon3d_2.png'),
    image3: require('./../../assets/images/img_cartoon3d_3.png'),
    image4: require('./../../assets/images/img_cartoon3d_4.png'),
    image5: require('./../../assets/images/img_cartoon3d_5.png'),
  },
  {
    key: '2',
    title: 'Renaissance',
    type: 'toonifyplus',
    description: "Ever wonder how you'd look as 15th, 18th, 20th century painting?",
    image1: require('./../../assets/images/img_renaissance_1.png'),
    image2: require('./../../assets/images/img_renaissance_2.png'),
    image3: require('./../../assets/images/img_renaissance_3.png'),
    image4: require('./../../assets/images/img_renaissance_4.png'),
    image5: require('./../../assets/images/img_renaissance_5.png'),
  },
  {
    key: '3',
    title: '2D Cartoon',
    type: 'toonify',
    description: "Turn you photos into classic 2D cartoon characters",
    image1: require('./../../assets/images/img_cartoon2d_1.png'),
    image2: require('./../../assets/images/img_cartoon2d_2.png'),
    image3: require('./../../assets/images/img_cartoon2d_3.png'),
    image4: require('./../../assets/images/img_cartoon2d_4.png'),
    image5: require('./../../assets/images/img_cartoon2d_5.png'),
  },
  {
    key: '4',
    title: 'Caricature',
    type: 'caricature',
    description: "Put a smile in your face with these funny realistic caricature drawings of you",
    image1: require('./../../assets/images/img_caricature_1.png'),
    image2: require('./../../assets/images/img_caricature_2.png'),
    image3: require('./../../assets/images/img_caricature_3.png'),
    image4: require('./../../assets/images/img_caricature_4.png'),
    image5: require('./../../assets/images/img_caricature_5.png'),
  }
]
let interval = null;
export default function HomeScreen(props) {
  const [image, setImage] = useState(null);
  const [tonyImage, _setTonyImage] = useState(null);
  const [progress, _setProgress] = useState(0.1);
  const [showPicker, setShowPicker] = useState(false);
  const [type, setType] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [model, _setModal] = useState(false);
  const [showCelbSearch, setShowCelbSearch] = useState(false);
  const progressRef = React.useRef(progress);
  const modalRef = React.useRef(model);
  const tonyImageRef = React.useRef(tonyImage);
  useEffect(() => {
    // Display an interstitial
    initInterstitialAd()

  }, []);
  const initInterstitialAd = async () => {
    //await AdMobInterstitial.setAdUnitID('ca-app-pub-3940256099942544/1033173712'); // Test ID, Replace with your-admob-unit-id
    const permissions = await requestPermissionsAsync();
    console.log('permissions ',permissions)
    await AdMobInterstitial.setAdUnitID(Platform.OS === 'ios' ? 'ca-app-pub-6824988815714853/6379275477':'ca-app-pub-6824988815714853/1015268154');
    await AdMobInterstitial.requestAdAsync({servePersonalizedAds: false});
    await AdMobInterstitial.showAdAsync();
  }
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
  const pickImageFromGallery = async (type) => {
    const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    console.log(result);
    handleResults(result)
  };
  const pickImageFromCamera = async (type) => {
    const {status} = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    console.log(result);
    handleResults(result)
  };
  const handleResults = async (result) => {
    if (!result.cancelled) {
      await setShowPicker(false)
      await setImage(result.uri);
      await setModal(true)
      setTimeout(() => {
        interval = setInterval(() => {
          setProgress(progressRef.current + 0.1)
          //console.log('progress', progressRef.current, ' ... ', tonyImageRef.current != null)
          if (!modalRef.current) {
            clearInterval(interval)
            setProgress(0.0);
            setTonyImage(null);
          } else if (progressRef.current >= 1 && tonyImageRef.current != null) {
            clearInterval(interval);
            setProgress(0.0);
            setImage(null)
            setModal(false)
            props.navigation.navigate('Result', {image: tonyImageRef.current})
          }
        }, 1000)
      }, 1000)
      submitImage(type, result)
    }
  }
  const submitImage = async (type, image) => {
    try {
      setTonyImage(null);
      const form = new FormData();
      const localUri = image.uri;
      const filename = localUri.split('/').pop();
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
        alert('Error: No face or multiple faces detected. Please try another image.')
        console.error('error', error);
      });
    } catch (e) {
      console.log('e ', e)
    }
  }
  const renderRow = ({item}) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          if (item.type) {
            setType(item.type)
            setShowPicker(true)
          } else
            alert('Feature is not available')
        }}
      >
        <Card
          containerStyle={{
            width: wp(90),
            margin: 0,
            backgroundColor: APP_STYLES.cardBackground,
            borderColor: APP_STYLES.cardBorder,
            borderRadius: 10,
            marginBottom: 20
          }}>
          <View style={styles.images}>
            <View style={styles.imageContainer}>
              <Image
                resizeMode={'cover'}
                style={{width: '100%', height: '100%', borderRadius: 10}}
                source={item.image1}/>
            </View>
            <View style={styles.imageContainer}>
              <Image
                resizeMode={'cover'}
                style={styles.cartoonSmall}
                source={item.image2}/>
              <Image
                resizeMode={'cover'}
                style={[styles.cartoonSmall, styles.cartoonRight]}
                source={item.image3}/>
              <Image
                resizeMode={'cover'}
                style={[styles.cartoonSmall, styles.cartoonBottom]}
                source={item.image4}/>
              <Image
                resizeMode={'cover'}
                style={[styles.cartoonSmall, styles.cartoonBottom, styles.cartoonRight]}
                source={item.image5}/>
            </View>
          </View>
          <View style={styles.details}>
            <View style={{width: '75%'}}>
              <Text style={styles.cartoonTitle}>{item.title}</Text>
              <Text style={styles.cartoonDescr}>{item.description}</Text>
            </View>
            <ImageBackground
              resizeMode={'cover'}
              imageStyle={{borderRadius: 25}}
              style={[styles.cartoonPlayIcon]}
              source={require('./../../assets/images/background_ig.png')}>
              <Icon
                name='arrowright'
                type='antdesign'
                color='#fff'
              />
            </ImageBackground>
          </View>

        </Card>
      </TouchableWithoutFeedback>
    )
  }
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.headerContainer}>
          <Image
            resizeMode={'contain'} style={{width: 105, height: 40}}
            source={require('./../../assets/images/ic_main_logo.png')}/>
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
        <FlatList data={data} renderItem={renderRow} alwaysBounceHorizontal={true}
                  showsVerticalScrollIndicator={false}/>
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
        <Picker
          show={showPicker}
          openGallery={() => {
            pickImageFromGallery(type)
          }}
          openCamera={() => {
            pickImageFromCamera(type)
          }}
          openSearch={() => {
            setShowPicker(false)
            props.navigation.navigate('Search', {type: type})
          }}
          onClose={() => setShowPicker(false)}/>
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
