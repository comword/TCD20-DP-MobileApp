import React from 'react';
import { Banner } from 'react-native-paper';
import { useTheme } from 'styled-components/native';
import tailwind from 'tailwind-rn';
import { MaterialIcons } from '@expo/vector-icons';
import { ErrorMsg } from 'services/types';

export enum BannerLevel {
  Info = 1,
  Warn,
  Error,
  Success,
}

export const getInfoLevel = (code: number) => {
  if (code === 0) return BannerLevel.Success;
  else if (code < 0) return BannerLevel.Error;
  else return BannerLevel.Info;
};

type Props = {
  level: BannerLevel;
  msg: string;
  show: boolean;
  onDismiss: Function;
};

const InfoBanner: React.FC<Props> = ({ level, msg, show, onDismiss }) => {
  const theme = useTheme();

  const barColor = () => {
    switch (level) {
      case BannerLevel.Warn:
        return theme.colors.warning;
      case BannerLevel.Error:
        return theme.colors.error;
      case BannerLevel.Success:
        return theme.colors.success;
      case BannerLevel.Info:
      default:
        return theme.colors.info;
    }
  };

  return (
    <>
      <Banner
        visible={show}
        icon={({ size }) => (
          <MaterialIcons name="error" size={size * 0.5} color={barColor()} />
        )}
        actions={[
          {
            label: 'Dismiss',
            onPress: () => onDismiss(),
          },
        ]}
        contentStyle={tailwind('text-center')}
        theme={{ ...theme, colors: { text: barColor() } }}
      >
        {msg}
      </Banner>
    </>
  );
};

type WithInfoBannerProps = {
  top: boolean;
  error?: ErrorMsg;
  onDismiss?: (update: ErrorMsg) => void;
};

export const WithInfoBanner: React.FC<WithInfoBannerProps> = ({
  top,
  error,
  onDismiss,
  children,
}) => {
  const renderBanner = (
    <InfoBanner
      msg={error ? error.msg : ''}
      show={error ? error.show : false}
      level={error ? getInfoLevel(error.code) : 1}
      onDismiss={
        onDismiss && error
          ? () => onDismiss({ ...error, show: false })
          : () => {}
      }
    />
  );
  if (top)
    return (
      <React.Fragment>
        {renderBanner}
        {children}
      </React.Fragment>
    );
  else
    return (
      <React.Fragment>
        {children}
        {renderBanner}
      </React.Fragment>
    );
};

export default InfoBanner;
