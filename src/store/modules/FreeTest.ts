import { getState } from "../store";

const defaultState = {
  freetestSchoolId: "",
  freetestStudentId: "",
  schoolType: ""

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
  freetestSchoolId(state: State, freetestSchoolId: string) {
    state.freetestSchoolId = freetestSchoolId;
  },
  freetestStudentId(state: State, freetestStudentId: string) {
    state.freetestSchoolId = freetestStudentId;
  },
  schoolType(state: State, schoolType: string) {
    state.schoolType = schoolType;
  }

};

const actions = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
