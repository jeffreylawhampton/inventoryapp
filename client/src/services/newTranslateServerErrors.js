import _ from "lodash";

let newTranslateServerErrors = (serverErrors) => {
  let serializedErrors = {};

  Object.keys(serverErrors).forEach((key) => {
    serializedErrors = {
      ...serializedErrors,
      [key]: `${_.startCase(key)} already taken.`,
    };
  });
  return serializedErrors;
};

export default newTranslateServerErrors;
