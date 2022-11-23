export const getState = (state) => {
  const store = JSON.parse(sessionStorage.getItem('vuex'))
  return store[state]
}
