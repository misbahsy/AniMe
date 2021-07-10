import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
  FlatList,
  Image,
  ScrollView,
  Platform,
  NativeModules,
} from 'react-native';

const GridImageView = ({
                         data,
                         headers = null,
                         renderGridImage = null,
                         onItemSelect,
                         heightOfGridImage = Dimensions.get('window').height / 5.5,
                       }) => {
  const [modal, setModal] = useState({visible: false, data: 0});
  const ref = useRef();
  var key = 0;

  const {StatusBarManager} = NativeModules;
  const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;
  const [height, setHeight] = useState(STATUSBAR_HEIGHT);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      StatusBarManager.getHeight((statusBarHeight) => {
        setHeight(statusBarHeight.height);
      });
    }
  }, []);

  return (
    <View style={styles.background}>
      <FlatList
        contentContainerStyle={{paddingBottom: 40}}
        data={data}
        renderItem={({index}) => {
          if (data.length <= index * 3) {
            return null;
          }
          return (
            <View style={styles.unit}>
              <View style={[styles.unit_item, {height: heightOfGridImage}]}>
                {data.length > index * 3 ? (
                  <TouchableOpacity
                    onPress={() => {
                      onItemSelect(data[index * 3])
                    }}
                    style={[styles.unit_item, {height: heightOfGridImage}]}>
                    {renderGridImage !== null ? (
                      renderGridImage(data[index * 3], styles.img)
                    ) : (
                      <Image
                        style={styles.img}
                        source={{
                          uri: data[index * 3],
                          ...(headers == null ||
                          headers == undefined ||
                          headers == {}
                            ? {}
                            : {method: 'POST', headers}),
                        }}
                      />
                    )}
                  </TouchableOpacity>
                ) : null}
              </View>
              <View style={[styles.unit_item, {height: heightOfGridImage}]}>
                {data.length > index * 3 + 1 ? (
                  <TouchableOpacity
                    onPress={() => {
                      onItemSelect(data[index * 3 + 1])
                    }}
                    style={[styles.unit_item, {height: heightOfGridImage}]}>
                    {renderGridImage !== null ? (
                      renderGridImage(data[index * 3 + 1], styles.img)
                    ) : (
                      <Image
                        style={styles.img}
                        source={{
                          uri: data[index * 3 + 1],
                          ...(headers == null ||
                          headers == undefined ||
                          headers == {}
                            ? {}
                            : {method: 'POST', headers}),
                        }}
                      />
                    )}
                  </TouchableOpacity>
                ) : null}
              </View>
              <View style={[styles.unit_item, {height: heightOfGridImage}]}>
                {data.length > index * 3 + 2 ? (
                  <TouchableOpacity
                    onPress={() => {
                      onItemSelect(data[index * 3 + 2])
                    }}
                    style={[styles.unit_item, {height: heightOfGridImage}]}>
                    {renderGridImage !== null ? (
                      renderGridImage(data[index * 3 + 2], styles.img)
                    ) : (
                      <Image
                        style={styles.img}
                        source={{
                          uri: data[index * 3 + 2],
                          ...(headers == null ||
                          headers == undefined ||
                          headers == {}
                            ? {}
                            : {method: 'POST', headers}),
                        }}
                      />
                    )}
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          );
        }}
        keyExtractor={(item) => {
          key++;
          return key.toString();
        }}
        style={styles.flatlist}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  flatlist: {
    flex: 1,
  },
  unit: {
    flexDirection: 'row',
  },
  unit_item: {
    margin: 1.5,
    flex: 1,
  },
  img: {
    flex: 1,
  },
  img_modal: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    resizeMode: 'contain',
  },
  cross: {
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    left: 0,
  },
  move_left_view: {
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    bottom: 0,
    left: 10,
  },
  move_right_view: {
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    bottom: 0,
    right: 10,
  },
});

export default GridImageView;
