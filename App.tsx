import React, {useCallback, useEffect, useState} from "react";
import {Provider} from "react-redux";
import {persistor, store} from "./src/redux/store";
import {PersistGate} from 'redux-persist/integration/react';
import AppContainer from "./src/navigation/AppNavigation";
import {SafeAreaProvider} from "react-native-safe-area-context";
import * as SplashScreen from 'expo-splash-screen';
import {StatusBar} from "expo-status-bar";
import {View} from "react-native";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';

const App = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  useEffect(() => {
    async function prepare() {
      try {
        // Keep the splash screen visible while we fetch resources
        await SplashScreen.preventAutoHideAsync();
        // Pre-load fonts, make any API calls you need to do here
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        await new Promise(resolve => setTimeout(resolve, 10000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }


  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <StatusBar style={'dark'}/>
          <View
            style={{width: wp(100), height: hp(105)}}
            onLayout={onLayoutRootView}>
            <AppContainer/>
          </View>
        </SafeAreaProvider>
      </PersistGate>

    </Provider>
  );
};

export default App;
