import { createLogger } from 'redux-logger';
import createReducer from './reducers';
import {
  configureStore,
  getDefaultMiddleware,
  Middleware,
} from '@reduxjs/toolkit';
import { createInjectorsEnhancer } from 'redux-injectors';
import createSagaMiddleware from 'redux-saga';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import { rootMLSaga } from 'services/ml';
import { rootAuthSaga } from 'services/auth';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: (
      obj: Record<string, any>
    ) => Function;
    __SAGA_MONITOR_EXTENSION__: (obj: Record<string, any>) => Function;
  }
}

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['theme', 'auth', 'pref'],
  version: 1,
};

const persistedReducer = persistReducer(persistConfig, createReducer());

const reduxSagaMonitorOptions = {};
const sagaMiddleware = createSagaMiddleware(reduxSagaMonitorOptions);
const { run: runSaga } = sagaMiddleware;

// Create the store with saga middleware
const middlewares = [] as Array<Middleware>;
middlewares.push(sagaMiddleware);

const enhancers = [
  createInjectorsEnhancer({
    createReducer,
    runSaga,
  }),
];

const logger = createLogger({
  level: 'info',
  collapsed: true,
});

// Skip redux logs in console during the tests
if (process.env.NODE_ENV !== 'test') {
  middlewares.push(logger);
}

const store = configureStore({
  reducer: persistedReducer,
  middleware: [
    ...getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
          'downloadAction',
          'modelInitAction',
        ],
      },
    }),
    ...middlewares,
  ],
  devTools:
    /* istanbul ignore next line */
    __DEV__,
  enhancers,
});

const persister = persistStore(store);
//@ts-ignore
store.persister = persister;

runSaga(rootMLSaga);
runSaga(rootAuthSaga);

export { store, persister };
