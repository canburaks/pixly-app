import  { combineReducers } from "redux";
import AuthReducer from "./AuthReducer";
import ClientReducer from "./ClientReducer";
import ActiveMovieReducer from "./ActiveMovieReducer";


const reducer = combineReducers({
  auth: AuthReducer,
  client:ClientReducer,
  active:ActiveMovieReducer
})

export default reducer;
