const initialState = {

  //username: localStorage.getItem("USERNAME"),

  points:0,
  search:"",

}


export default function ClientReducer(state = initialState, action) {
  switch (action.type) {
    case 'CLIENT_UPDATE':
      return {...state, lenBookmarks:action.lenBookmarks, points:action.points};

    case 'SEARCH_MOVIE':
      return {...state, search: action.search };

    case "POINT":
      return {...state, points:action.points}
    


    default:
      return state;
  }
}
