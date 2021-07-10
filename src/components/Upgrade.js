import {ImageBackground, StyleSheet, Text, View} from "react-native";
import {Button, CheckBox, Icon, Overlay} from "react-native-elements";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import React, {useState} from "react";

const Upgrade = (props) => {
  const {visible} = props;
  const [selectedPackage, setSelectedPackage] = useState(0);
  return (
    <Overlay isVisible={visible} style={{width: wp(100), height: hp(100)}}>
      <ImageBackground
        resizeMode={'cover'}
        style={{width: wp(100), height: hp(100), alignItems: 'center', backgroundColor: '#000'}}
        source={require('./../../assets/images/img_pro_background.jpg')}>
        <View style={{width: '100%', height: '100%', backgroundColor: '#00000088', paddingTop: hp(5)}}>
          <View style={{width: '90%', alignItems: 'flex-start'}}>
            <Icon
              style={{marginLeft: 20}}
              name='close'
              color={'#fff'}
              type='antdesign'
              size={30}
              onPress={() => {
                props.onClose()
              }}
            />
          </View>
          <View style={{width: '100%', alignItems: 'center', height: '90%', justifyContent: 'center'}}>
            <Text
              style={{
                fontSize: 30,
                color: '#fff',
                fontWeight: 'bold',
                marginBottom: hp(2),
                textAlign: 'center'
              }}>{'AniMe pro'}</Text>
            <Text
              style={{
                fontSize: 18,
                color: '#fff',
                fontWeight: 'bold',
                marginBottom: hp(2),
                textAlign: 'center'
              }}>{'All access with fast turbo processing, no watermark, No ads!'}</Text>
            <CheckBox
              center
              title='$10.00/WEEK'
              checkedIcon='dot-circle-o'
              uncheckedIcon='circle-o'
              checked={selectedPackage === 0}
              textStyle={{color: '#fff'}}
              containerStyle={styles.titleStyle}
              onPress={() => {
                setSelectedPackage(0)
              }}
            />
            <CheckBox
              center
              title='$25.00/MONTH'
              checkedIcon='dot-circle-o'
              uncheckedIcon='circle-o'
              checked={selectedPackage === 1}
              textStyle={{color: '#fff'}}
              containerStyle={styles.titleStyle}
              onPress={() => {
                setSelectedPackage(1)
              }}
            />
            <CheckBox
              center
              title='$60.00/YEAR'
              checkedIcon='dot-circle-o'
              uncheckedIcon='circle-o'
              checked={selectedPackage === 2}
              textStyle={{color: '#fff'}}
              containerStyle={styles.titleStyle}
              onPress={() => {
                setSelectedPackage(2)
              }}
            />
            <Button
              containerStyle={{width: wp(90), marginTop: hp(5)}}
              buttonStyle={{backgroundColor: '#E1701A', width: '100%', height: 60}}
              title={'CONTINUE'}/>
            <Text
              style={{
                fontSize: 18,
                color: '#fff',
                fontWeight: 'bold',
                marginBottom: hp(2),
                textAlign: 'center'
              }}>{''}</Text>

          </View>
        </View>
      </ImageBackground>

    </Overlay>
  )
}
const styles = StyleSheet.create({
  titleStyle: {
    width: wp(90), alignItems: 'flex-start',
    backgroundColor: '#00000099',
    borderWidth: 0,
    height: 60,
    justifyContent: 'center',
  }
})
export default Upgrade;
