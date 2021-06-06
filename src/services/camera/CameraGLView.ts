import { requireNativeViewManager } from '@unimodules/core';
import React from 'react';

type Props = {
  pointerEvents?: any;
  style?: any;
  ref?: Function;
};

const CameraGLView: React.ComponentType<Props> =
  requireNativeViewManager('CameraGLView');

export default CameraGLView;
