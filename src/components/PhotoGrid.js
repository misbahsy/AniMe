/*This is an Example of Grid Image Gallery in React Native*/
import * as React from 'react';
import {StyleSheet, Text, View,} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import PhotoGrid from './GridView';
import {Icon, Overlay} from "react-native-elements";
import {SearchBar} from 'react-native-elements';
import axios from "axios";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {items: [], search: '', loading: false};
  }

  updateSearch = (search) => {
    this.setState({search});
    //this.searchImages(search)
  };
  searchImages = (search) => {
    this.setState({loading: true})
    const options = {
      method: 'GET',
      url: 'https://bing-image-search1.p.rapidapi.com/images/search',
      params: {q: this.state.search, count: 25},
      headers: {
        'x-rapidapi-key': '09db32faeemshf6ade820c9cc6d9p1e814ejsnca047afa3834',
        'x-rapidapi-host': 'bing-image-search1.p.rapidapi.com'
      }
    };

    axios.request(options).then((response) => {
      //console.log(response.data.value);
      const items = response.data.value.map((item, i) => {
        //Using demo placeholder images but you can add your images here
        return item.thumbnailUrl;
      });
      this.setState({items, loading: false})
    }).catch((error) => {
      this.setState({loading: true, items: []})
      console.error(error);
    });
  }

  render() {
    console.log('showCelbSearch ', this.props.visible)
    return (
      <View style={styles.containerStyle}>

        <SearchBar
          showLoading={this.state.loading}
          containerStyle={{marginTop: 0}}
          blurOnSubmit
          returnKeyType={'search'}
          platform={'ios'}
          placeholder="Type Here..."
          onChangeText={this.updateSearch}
          value={this.state.search}
          onBlur={() => {
            this.searchImages(this.state.search)
          }}
        />
        <PhotoGrid
          data={this.state.items}
          onItemSelect={(url) => {
            this.props.onItemSelect(url)
          }}
        />
      </View>
    );
  }
}

export default App;
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  containerStyle: {
    justifyContent: 'center',
    width: wp(90),
    height: hp(90),
    borderRadius: 50
  },
  fullImageStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '98%',
    resizeMode: 'contain',
  },
  modelStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  closeButtonStyle: {
    width: 25,
    height: 25,
    top: 9,
    right: 9,
    position: 'absolute',
  },
});
