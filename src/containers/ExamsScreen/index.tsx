import * as React from 'react';
import { lazyLoad } from 'utils/loadable';
import { FullscreenLoading } from 'components/LoadingIndicator';

const ExamsScreen = lazyLoad(
  () => import('./page'),
  module => module.default,
  {
    fallback: <FullscreenLoading />,
  }
);

export default ExamsScreen;
