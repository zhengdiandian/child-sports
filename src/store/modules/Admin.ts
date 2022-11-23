import { getState } from "../store";

const defaultState = {
  editData: {}

};
type State = typeof defaultState
let state;
try {
  state = getState("HomeWork");
} catch (e) {
  console.error(e);
  state = defaultState;
}

const mutations = {
  setEditData(state: State, editData: object) {
    console.log("edit", editData);
    state.editData = editData;
  }
};

const actions = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
