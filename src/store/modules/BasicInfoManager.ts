
const state = {
  updateSchoolData: ''
}

const mutations = {
  setUpdateSchoolData (state, schoolData) {
    state.updateSchoolData = schoolData
  }
}

const actions = {

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
