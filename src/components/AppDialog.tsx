import React from 'react';
import { Dialog, Portal } from 'react-native-paper';

type Props = {
  onDismiss?: () => void;
  dismissable?: boolean;
  visible: boolean;
};

const AppDialog: React.FC<Props> = ({
  onDismiss,
  dismissable,
  visible,
  children,
  ...rest
}) => {
  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={onDismiss}
        dismissable={dismissable}
        {...rest}
      >
        {children}
      </Dialog>
    </Portal>
  );
};

export default AppDialog;
