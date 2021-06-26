import React, { useState, useEffect } from 'react';
import { View, Animated } from 'react-native';
import tailwind from 'tailwind-rn';

const regexArr = [/[a-z]/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/];

export const MAX_LEN = 32,
  MIN_LEN = 8,
  PASS_LABELS = ['Too Short', 'Weak', 'Normal', 'Strong', 'Secure'];

interface Props {
  minLength?: number;
  showLabels?: boolean;
  maxLength?: number;
  labels: Array<string>;
  password: string;
}

const PassMeter: React.FC<Props> = ({
  minLength,
  showLabels,
  maxLength,
  labels,
  password,
}) => {
  const [passStat, setPassStat] = useState('Weak');
  const [animateVal] = useState(new Animated.Value(0));
  const [animateColor] = useState(new Animated.Value(0));
  const [barWidth, setBarWidth] = useState(1);

  useEffect(() => {
    Animated.spring(animateVal, {
      useNativeDriver: false,
      bounciness: 15,
      toValue: barWidth * (password.length / maxLength!),
    }).start();
    let passPoint = 0;

    if (password.length > 0 && password.length < minLength!)
      setPassStat(labels[0]);
    else {
      regexArr.forEach(rgx => (rgx.test(password) ? (passPoint += 1) : null));
      setPassStat(labels[passPoint]);
    }
    Animated.timing(animateColor, {
      useNativeDriver: false,
      toValue: passPoint,
      duration: 300,
    }).start();
  }, [
    animateColor,
    animateVal,
    barWidth,
    labels,
    maxLength,
    minLength,
    password,
  ]);

  const interpolateColor = animateColor.interpolate({
    inputRange: [0, 4],
    outputRange: ['rgb(255,0,0)', 'rgb(0, 255, 0)'],
  });

  return (
    <View style={tailwind('flex -m-2')}>
      <View
        style={styles.backBar}
        onLayout={event => {
          setBarWidth(event.nativeEvent.layout.width);
        }}
      />
      <Animated.View
        style={[
          styles.mainBar,
          { backgroundColor: interpolateColor, width: animateVal },
        ]}
      />
      {showLabels ? (
        password.length !== 0 ? (
          <Animated.Text style={[styles.text, { color: interpolateColor }]}>
            {passStat}
          </Animated.Text>
        ) : null
      ) : null}
    </View>
  );
};

const styles = {
  backBar: tailwind('bg-gray-300 h-2 rounded-2xl'),
  mainBar: tailwind('absolute bg-blue-300 h-2 rounded-2xl'),
  text: tailwind('m-px mt-px'),
};

PassMeter.defaultProps = {
  minLength: MIN_LEN,
  maxLength: MAX_LEN,
  showLabels: true,
};

export default PassMeter;
