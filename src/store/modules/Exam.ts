import { getState } from "../store";

const defaultState = {
  examDetails: {}


};
type State = typeof defaultState
let state;
try {
  state = getState("Exam");
} catch (e) {
  console.error(e);
  state = defaultState;
}

const mutations = {
  setExamDetails(state: State, examDetails: object) {
    state.examDetails = examDetails;
  }
};

const actions = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
