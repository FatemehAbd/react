const initialState = {
  userIsAuthenticated: false,
  userName: "",
};

const authSlice = (state = initialState, action) => {
  switch (action.type) {
    case "SET_AUTHENTICATED":
      state = {
        ...state,
        userIsAuthenticated: true,
        userName: action.username,
      };
      break;
    default:
      return state;
  }
  return state;
};
export default authSlice;
