const makeObjectAbc = (objectArray) => {
  return objectArray.sort((a, b) => a.name.localeCompare(b.name));
};

export default makeObjectAbc;
