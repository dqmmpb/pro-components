import { SearchTransformKeyFn } from '../typing';

const transformKeySubmitValue = <T = any>(
  values: T,
  dataFormatMap: {
    [key: string]: SearchTransformKeyFn;
  },
) => {
  let result = {} as T;
  Object.keys(values).forEach((key) => {
    const itemValue = values[key];
    const tempKey = dataFormatMap[key] ? dataFormatMap[key](itemValue, key, values) : key;
    // { [key:string]:any } 数组也能通过编译
    if (Array.isArray(tempKey)) {
      result[key] = itemValue;
      return;
    }
    if (typeof tempKey === 'object') {
      result = { ...result, ...tempKey };
    } else {
      result[tempKey] = itemValue;
    }
  });
  return result;
};

export default transformKeySubmitValue;
