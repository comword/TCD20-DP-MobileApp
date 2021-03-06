import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, View, Text } from 'react-native';
import { Platform } from '@unimodules/react-native-adapter';
import * as FileSystem from 'expo-file-system';
import Constants from 'expo-constants';
import {
  ProgressBar,
  Dialog,
  List,
  useTheme,
  ActivityIndicator,
} from 'react-native-paper';
import tailwind from 'tailwind-rn';
import { compose, bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';

import AppDialog from './AppDialog';
import {
  selectPCSrv,
  PCSlice,
  downloadAction,
  loadAssetAction,
  modelInitAction,
} from 'services/ml';
import { DownloadTask } from 'services/ml/download';
import { PCState, ProgressMap } from 'services/ml/types';
import { RootState } from 'store/types';
import { select } from 'redux-saga/effects';

type ComponentProps = {
  onLoaded: () => void;
};

type Props = ComponentProps &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const DownloadModal: React.FC<Props> = ({
  onLoaded,
  progress,
  modelPaths,
  loadStatus,
  downloadAction,
  loadAssetAction,
  modelInitAction,
  setModelPaths,
  setDownloadProg,
}) => {
  const theme = useTheme();
  const [showDiag, setShowDiag] = useState(loadStatus === 'UNLOAD');
  const [step, setStep] = useState(0); //0 for download, 1 for loading

  const modelsDir = FileSystem.cacheDirectory + 'models/';
  const downloadTasks: Array<DownloadTask> = [
    {
      name: 'Face detect',
      url: 'https://raw.githubusercontent.com/opencv/opencv/master/data/haarcascades/haarcascade_frontalface_alt2.xml',
      dir: modelsDir,
    },
    {
      name: 'Face landmark',
      url: 'https://github.com/kurnianggoro/GSOC2017/raw/master/data/lbfmodel.yaml',
      dir: modelsDir,
    },
    {
      name: 'TFLite action recognition',
      url: 'asset:///pcs-vtn.tflite',
      dir: modelsDir,
    },
  ];

  const startDownload = () => {
    const withProgressCb = downloadTasks.map(t1 => ({
      ...t1,
      progressCb: (data: FileSystem.DownloadProgressData) => {
        setDownloadProg({
          name: t1.name,
          totalBytesWritten: data.totalBytesWritten,
          totalBytesExpectedToWrite: data.totalBytesExpectedToWrite,
          percent: data.totalBytesWritten / data.totalBytesExpectedToWrite,
        });
      },
    }));
    const withFinishCb = withProgressCb.map(t1 => ({
      ...t1,
      finishCb: function* (uri: string) {
        setModelPaths([
          ...((yield select(selectPCSrv)) as PCState).modelPaths,
          {
            name: t1.name,
            path: uri.replace(/(^\w+:|^)\/\//, ''),
            loaded: false,
          },
        ]);
      },
    }));
    withFinishCb.forEach(it => {
      if (it.url.startsWith('http')) downloadAction(it);
      else if (it.url.startsWith('asset')) loadAssetAction(it);
    });
  };

  const asyncSome = async (
    arr: Array<any>,
    predicate: (a: any) => Promise<boolean>
  ) => {
    for (let e of arr) {
      if (await predicate(e)) return true;
    }
    return false;
  };

  const getPathByTask = (task: DownloadTask) => {
    const urlSplit = task.url.split('/');
    return task.dir + urlSplit[urlSplit.length - 1];
  };

  const checkExisting = async () => {
    const check = await asyncSome(downloadTasks, async it => {
      const info = await FileSystem.getInfoAsync(getPathByTask(it));
      return !info.exists;
    });
    if (check) {
      startDownload();
    } else {
      setModelPaths(
        downloadTasks.map(it => ({
          name: it.name,
          path: getPathByTask(it).replace(/(^\w+:|^)\/\//, ''),
          loaded: false,
        }))
      );
    }
  };

  useEffect(() => {
    if (Constants.appOwnership === 'expo' || Platform.OS === 'web') {
      setShowDiag(false);
      onLoaded();
    }
  }, [onLoaded, setShowDiag]);

  useEffect(() => {
    if (loadStatus === 'LOAD' || Platform.OS === 'web') {
      setShowDiag(false);
      onLoaded();
    } else if (loadStatus === 'UNLOAD') checkExisting();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadStatus]);

  useEffect(() => {
    const modelInit = async () => {
      if (step === 0 && loadStatus === 'UNLOAD')
        if (
          downloadTasks.every(t1 => modelPaths.find(t2 => t1.name === t2.name))
        ) {
          setStep(1);
          modelInitAction({
            haarCascade: modelPaths.find(it => it.name === 'Face detect')?.path,
            modelLBF: modelPaths.find(it => it.name === 'Face landmark')?.path,
            posture: modelPaths.find(
              it => it.name === 'TFLite action recognition'
            )?.path,
          });
        }
    };
    modelInit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelPaths]);

  return (
    <AppDialog visible={showDiag} dismissable={false}>
      <Dialog.Title>
        {step === 0 && 'Downloading models'}
        {step === 1 && 'Loading models'}
      </Dialog.Title>
      <Dialog.Content>
        {step === 0 && (
          <FlatList
            data={downloadTasks.map(t1 => ({
              ...t1,
              ...progress.find(t2 => t2.name === t1.name),
            }))}
            renderItem={it => <Item item={it.item} />}
            keyExtractor={it => it.name}
          />
        )}
        {step === 1 && (
          <View
            style={tailwind(
              'flex flex-col overflow-hidden text-center justify-center items-center'
            )}
          >
            <ActivityIndicator
              size="large"
              animating
              color={theme.colors.primary}
            />
            <Text style={{ color: theme.colors.text }}>Loading...</Text>
          </View>
        )}
      </Dialog.Content>
    </AppDialog>
  );
};

function Item({ item }: { item: DownloadTask & ProgressMap }) {
  const theme = useTheme();
  const styles = StyleSheet.create({
    listItemContainer: {
      ...tailwind('w-full'),
    },
  });
  return (
    <List.Item
      title={item.name}
      description={props => (
        <ProgressBar
          {...props}
          progress={item.percent}
          color={theme.colors.primary}
        />
      )}
      style={styles.listItemContainer}
    />
  );
}

const mapStateToProps = (state: RootState) => {
  return {
    progress: selectPCSrv(state).downloadProg,
    modelPaths: selectPCSrv(state).modelPaths,
    loadStatus: selectPCSrv(state).status,
  };
};

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(
    {
      ...PCSlice.actions,
      downloadAction,
      loadAssetAction,
      modelInitAction,
    },
    dispatch
  );
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(
  DownloadModal
) as React.ComponentType<ComponentProps>;
