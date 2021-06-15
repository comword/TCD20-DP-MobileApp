import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import * as FileSystem from 'expo-file-system';
import {
  Button,
  ProgressBar,
  Dialog,
  List,
  useTheme,
} from 'react-native-paper';
import tailwind from 'tailwind-rn';
import { compose, bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';

import AppDialog from './AppDialog';
import { rootMLSaga, selectPCSrv, PCSlice } from 'services/ml';
import { DownloadTask, downloadAction } from 'services/ml/download';
import { RootState } from 'store/types';
import { injectReducer, injectSaga } from 'redux-injectors';
import { select } from 'redux-saga/effects';
import { PCState, ProgressMap } from 'services/ml/types';

type ComponentProps = {};

type Props = ComponentProps &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const DownloadModal: React.FC<Props> = ({
  progress,
  modelPaths,
  downloadAction,
  setModelPaths,
  setDownloadProg,
}) => {
  const [showDiag, setShowDiag] = useState(false);
  const [finished, setFinished] = useState(false);

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
            path: uri,
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

  const checkAct = async () => {
    const check = await asyncSome(downloadTasks, async it => {
      const urlSplit = it.url.split('/');
      const info = await FileSystem.getInfoAsync(
        it.dir + urlSplit[urlSplit.length - 1]
      );
      return !info.exists;
    });
    console.log('Download?', check);
    if (check) {
      setShowDiag(true);
      startDownload();
    }
  };

  useEffect(() => {
    checkAct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (downloadTasks.every(t1 => modelPaths.find(t2 => t1.name === t2.name))) {
      console.log('Download finished');
      setFinished(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelPaths]);

  return (
    <AppDialog visible={showDiag}>
      <Dialog.Title>Download models</Dialog.Title>
      <Dialog.Content>
        <FlatList
          data={downloadTasks.map(t1 => ({
            ...t1,
            ...progress.find(t2 => t2.name === t1.name),
          }))}
          renderItem={it => <Item item={it.item} />}
          keyExtractor={it => it.name}
        />
      </Dialog.Content>
      {finished && (
        <Dialog.Actions>
          <Button onPress={() => setShowDiag(false)}>Done</Button>
        </Dialog.Actions>
      )}
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
      // right={props => (
      //   <Text {...props}>
      //     {item?.totalBytesWritten}/{item?.totalBytesExpectedToWrite}
      //   </Text>
      // )}
      style={styles.listItemContainer}
    />
  );
}

const mapStateToProps = (state: RootState) => {
  const PCSrv = selectPCSrv(state);
  return {
    progress: PCSrv.downloadProg,
    modelPaths: PCSrv.modelPaths,
  };
};

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(
    {
      ...PCSlice.actions,
      downloadAction,
    },
    dispatch
  );
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);
const withReducer = injectReducer({
  key: PCSlice.name,
  reducer: PCSlice.reducer,
});
const withSaga = injectSaga({ key: PCSlice.name, saga: rootMLSaga });

export default compose(
  withConnect,
  withReducer,
  withSaga
)(DownloadModal) as React.ComponentType<ComponentProps>;
