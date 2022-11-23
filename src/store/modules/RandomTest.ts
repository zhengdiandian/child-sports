import { getState } from "../store";

const defaultState = {
  viewResults: {},
  randomtestId: 0,
  randomtest: {}

};
type State = typeof defaultState
let state;
try {
  state = getState("RandomTest");
} catch (e) {
  console.error(e);
  state = defaultState;
}

const mutations = {
  setViewResults(state: State, viewResults: object) {
    state.viewResults = viewResults;
  },
  randomtestId(state: State, randomtestId: number) {
    state.randomtestId = randomtestId;
  },
  randomtest(state: State, randomtest: object) {
    state.randomtest = randomtest;
  }
};

const actions = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
