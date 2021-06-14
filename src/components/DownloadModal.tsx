import React, { useState } from 'react';
import { View } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { ProgressBar, Dialog } from 'react-native-paper';
import { useTheme } from 'styled-components/native';
import tailwind from 'tailwind-rn';
import { compose, bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';

import AppDialog from './AppDialog';
import { rootMLSaga, selectPCSrv, PCSlice } from 'services/ml';
import { DownloadTask } from 'services/ml/download';
import { RootState } from 'store/types';
import { injectReducer, injectSaga } from 'redux-injectors';

type ComponentProps = {};

type Props = ComponentProps &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const DownloadModal: React.FC<Props> = ({ PCSrv }) => {
  const theme = useTheme();
  const [showDiag, setShowDiag] = useState(false);
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

  return (
    <AppDialog visible={showDiag}>
      <Dialog.Title>Download models</Dialog.Title>
      <Dialog.Content />
      <Dialog.Actions />
    </AppDialog>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    PCSrv: selectPCSrv(state),
  };
};

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators({}, dispatch);
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
