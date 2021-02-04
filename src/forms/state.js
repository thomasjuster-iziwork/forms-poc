// Declare actions and reducers

export const compose = (...reducers) => (state, action) =>
  reducers.filter(Boolean).reduceRight((acc, reducer) => {
    return reducer(acc, action);
  }, state);

export const actionTypes = {
  changeValue: "@forms/CHANGE_VALUE",
  changeListValue: "@forms/CHANGE_LIST_VALUE",
  initialize: "@forms/INITIALIZE"
};
const isAction = (action, key) => action.type === actionTypes[key];

export const formActions = {
  changeValue: (name, value) => ({
    type: actionTypes.changeValue,
    payload: { name, value }
  }),
  changeListValue: (name, index, value) => ({
    type: actionTypes.changeListValue,
    payload: { name, index, value }
  }),
  initialize: (values) => ({
    type: actionTypes.initialize,
    payload: { values }
  })
};

const reduceValueChange = (state, action) => {
  return !isAction(action, "changeValue")
    ? state
    : {
        ...state,
        [action.payload.name]: action.payload.value
      };
};
const reduceListValueChange = (state, action) => {
  if (!isAction(action, "changeListValue")) {
    return state;
  }
  const { name, index, value } = action.payload;
  const nextValues = { ...state };
  nextValues[name] = [...nextValues[name]];
  nextValues[name][index] = value;
  return { ...nextValues };
};
const reduceInitialize = (state, action) => {
  return !isAction(action, "initialize") ? state : action.payload.values;
};

export const formReducer = compose(
  reduceValueChange,
  reduceListValueChange,
  reduceInitialize
);

export const hasChanged = (name) => (action) => changed(name, action);
const changed = (name, action) =>
  isAction(action, "changeValue") && action.payload.name === name;
