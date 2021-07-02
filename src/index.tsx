import 'react-native-url-polyfill/auto';
import React from 'react';
import { Provider } from 'react-redux';
import { AppearanceProvider } from 'react-native-appearance';
import RootNavigator from 'navigators/Root';
import { store, persister } from 'store/configureStore';
import ThemeProvider from 'theme/ThemeProvider';
import { PersistGate } from 'redux-persist/integration/react';
import { Platform, NativeModulesProxy } from '@unimodules/core';
import Constants from 'expo-constants';
import { serverAddr } from 'services/rpc/rpcClient';
const { PostureClassify } = NativeModulesProxy;

export default function App() {
  const initNative = async () => {
    if (Platform.OS !== 'web' && Constants.appOwnership !== 'expo') {
      const init = (await PostureClassify.getReporterInitialised()) as boolean;
      if (!init) {
        if (await PostureClassify.initReporter(serverAddr()))
          console.log('Init native reporter success');
      }
    }
  };

  initNative();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persister}>
        <AppearanceProvider>
          <ThemeProvider>
            <RootNavigator />
          </ThemeProvider>
        </AppearanceProvider>
      </PersistGate>
    </Provider>
  );
}
