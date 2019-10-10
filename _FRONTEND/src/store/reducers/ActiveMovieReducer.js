const initialState = {
    name: "",
    id: 0,
    isBookmarked:false,
    rating:0

}


export default function ActiveMovieReducer(state = initialState, action) {
  switch (action.type) {
    
    case "ACTIVE_MOVIE":
      return {...state, 
        name:action.movie.name, 
        id:action.movie.id, 
        isBookmarked:action.movie.isBookmarked,
        rating:action.movie.viewerRating
      }
    case "BOOKMARK":
      return { ...state, isBookmarked: action.isBookmarked}
    case "RATING":
      return { ...state, rating:action.rating }
    
    default:
      return state;
  }
}
