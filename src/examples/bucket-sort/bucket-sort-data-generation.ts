export const generateNumberArray = (datasetSize: number, rangeStop: number) => {
  const result: number[] = [];
  for (let i = 0; i < datasetSize; i++) {
    result.push(Math.floor(Math.random() * rangeStop));
  }
  return result;
};
