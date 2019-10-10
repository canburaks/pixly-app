const initialState = {
  username: localStorage.getItem("USERNAME"),
  userId:localStorage.getItem("USER_ID") || null,
  isAuthenticated: localStorage.getItem("AUTH_TOKEN") ? true : false,
  token: localStorage.getItem("AUTH_TOKEN") || null,

}


export default function AuthReducer(state = initialState, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESSFUL':
      return {...state, isAuthenticated: true, token:action.token, username:localStorage.getItem("USERNAME") };

    case 'LOGOUT_SUCCESSFUL':
      localStorage.clear()
      
      return {...state, token: null,isAuthenticated: false, username:localStorage.getItem("USERNAME") };
    


    default:
      return state;
  }
}
