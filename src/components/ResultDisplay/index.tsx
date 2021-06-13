import React from 'react';
import { View } from 'react-native';
import tailwind from 'tailwind-rn';
import { InferResult, MLActionTypes } from 'services/ml/types';

import { AntDesign } from '@expo/vector-icons';

type Props = {
  results: Array<InferResult>;
};

const ResultDisplay: React.FC<Props> = ({ results }) => {
  const topResult = results.reduce((prev, current) => {
    return prev.prob > current.prob ? prev : current;
  });

  return (
    <View style={tailwind('flex flex-row')}>
      <View>
        {topResult.type === MLActionTypes.Unknown && (
          <AntDesign name="questioncircleo" size={24} color="black" />
        )}
      </View>
      <View></View>
    </View>
  );
};

export default ResultDisplay;
