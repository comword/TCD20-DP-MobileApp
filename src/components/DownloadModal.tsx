import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, View, Text } from 'react-native';
import * as FileSystem from 'expo-file-system';
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
  modelInitAction,
} from 'services/ml';
import { DownloadTask } from 'services/ml/download';
import { PCState, ProgressMap } from 'services/ml/types';
import { RootState } from 'store/types';
import { injectReducer } from 'redux-injectors';
import { select } from 'redux-saga/effects';

type ComponentProps = {};

type Props = ComponentProps &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const DownloadModal: React.FC<Props> = ({
  progress,
  modelPaths,
  loadStatus,
  downloadAction,
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
    withFinishCb.forEach(it => downloadAction(it));
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
    console.log('Download?', check);
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
    if (loadStatus === 'UNLOAD') checkExisting();
    else if (loadStatus === 'LOAD') setShowDiag(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadStatus]);

  useEffect(() => {
    if (step === 0 && loadStatus === 'UNLOAD')
      if (
        downloadTasks.every(t1 => modelPaths.find(t2 => t1.name === t2.name))
      ) {
        console.log('Download finished');
        setStep(1);
        modelInitAction({
          haarCascade: modelPaths.find(it => it.name === 'Face detect')?.path,
          modelLBF: modelPaths.find(it => it.name === 'Face landmark')?.path,
        });
      }
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
  const PCSrv = selectPCSrv(state);
  return {
    progress: PCSrv.downloadProg,
    modelPaths: PCSrv.modelPaths,
    loadStatus: PCSrv.status,
  };
};

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(
    {
      ...PCSlice.actions,
      downloadAction,
      modelInitAction,
    },
    dispatch
  );
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);
const withReducer = injectReducer({
  key: PCSlice.name,
  reducer: PCSlice.reducer,
});
// const withSaga = injectSaga({ key: PCSlice.name, saga: rootMLSaga });

export default compose(
  withConnect,
  withReducer
  // withSaga
)(DownloadModal) as React.ComponentType<ComponentProps>;
