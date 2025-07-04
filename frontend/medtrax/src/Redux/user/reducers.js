import { Add_LOGIN_USER, LOGOUT, INITIALIZE_AUTH } from "./actions";

const initialState = {
  token: null,
  userInfo: {
    id: "",
    name: "",
    email: "",
    phone: "",
    isAdmin: false,
  },
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case Add_LOGIN_USER:
    case INITIALIZE_AUTH:
      localStorage.setItem("profile", JSON.stringify(action.payload));
      return { ...state, ...action.payload };
    case LOGOUT:
      localStorage.removeItem("profile");
      return {
        ...initialState,
        token: null,
      };
    default:
      return state;
  }
}
