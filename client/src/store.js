import { createStore, combineReducers } from "redux";

const reducers = combineReducers({
  selectedRadioReducer: function (
    state = { radio: null, isPlaying: false },
    action
  ) {
    switch (action.type) {
      case "selectedRadio/set":
        return action.payload;
      default:
        return state;
    }
  },
});

export default function storeConfig() {
  return createStore(reducers);
}
