export const getArrayItemName = (arrayFieldName: string, idx: number) => {
  return `${arrayFieldName}[${idx}]`;
};

export const getObjectItemFieldName = (fieldNamePath: string[]) => {
  return fieldNamePath.join(".");
};
