import { InferResult, MLActionTypes } from './types';

describe('MLEnumTypeConvert', () => {
  it('enum key map', async function () {
    const mockMLResult: Array<number> = [
      0.5, 0.3, 0.1, 0.05, 0.03, 0.005, 0.003, 0.001, 0.011,
    ];
    const expectRes: InferResult[] = [
      {
        type: MLActionTypes.LookScreen,
        prob: 0.5,
      },
      {
        type: MLActionTypes.Typing,
        prob: 0.3,
      },
      {
        type: MLActionTypes.Unknown,
        prob: 0.1,
      },
      {
        type: MLActionTypes.LookSide,
        prob: 0.05,
      },
      {
        type: MLActionTypes.LookBack,
        prob: 0.03,
      },
      {
        type: MLActionTypes.Leave,
        prob: 0.005,
      },
      {
        type: MLActionTypes.Speaking,
        prob: 0.003,
      },
      {
        type: MLActionTypes.MultiPersons,
        prob: 0.001,
      },
      {
        type: MLActionTypes.UsePhone,
        prob: 0.011,
      },
    ];
    expect(
      Object.keys(MLActionTypes).map((it, idx) => ({
        type: MLActionTypes[it as keyof typeof MLActionTypes],
        prob: mockMLResult[idx],
      }))
    ).toEqual(expectRes);
  });
});
