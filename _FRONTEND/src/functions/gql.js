import gql from "graphql-tag";


export const GET_LIST = gql`
  query listQuery($id: Int, $name: String, $search:String,$first:Int, $skip:Int){
    lists(id:$id, name:$name, search:$search, first:$first, skip:$skip) {
      id,
      name,
      slug,
      year,
      poster,
      isBookmarked,
      viewerRating
      },
      length(id:$id, name:$name, search:$search)
    }
`;

export const GET_FOLLOWINGS = gql`
    query viewer($username:String){
      viewer(username:$username){
      followLists{
        id,name, image, slug
      },
      followPersons{
        id, name, slug, images{info, url}
      },
      followTopics{
        id,name,poster, summary
      }
    }
  }
`


export const GET_LIST_OF_LISTS = gql`
    query listOfLists($first:Int, $skip:Int ){
      listOfLists(first:$first, skip:$skip){
        id,
        slug,
        name,
        image,
        isFollowed,
        owner{
          id,username
        },
        numMovies
      },
      length(name:"all_lists")
    }
`
export const LIST_OF_MOVIES = gql`
    query listOfMovies($id:Int, $name: String, $search:String, $first:Int, $skip:Int){
      listOfMovies(id:$id, name:$name, search:$search, first:$first, skip:$skip ){
        id,
        slug
        name,
        year,
        poster,
        viewerRating,
        viewerPoints,
        isBookmarked,
        isFaved
      },
      length(id:$id,  name:$name, search:$search),
      viewer{
        lists{
          id,name,
          slug
        }
      }
    }
`

export const GET_DIRECTOR_LIST = gql`
    query listOfDirectors($first:Int, $skip:Int){
        listOfDirectors(first:$first, skip:$skip){
        id,
        slug
        name,
        poster,
        squarePoster,
        isFollowed,
        lenMovies,
        born, died,
      },
      length(name:"list_of_directors"),
    }
`;

export const GET_PERSON = gql`
    query getPerson($id:String!){
      person(id:$id){
        id,
        name,
        bio,
        poster,
        slug,
        movies{
          name,
          slug,
          id,
          poster,
          year
        },
        videos{
          id,
          title,
          summary,
          link,
          duration,
          tags,
          isFaved
        },
        isFollowed
      }
    }
`

export const GET_TOPIC_LIST = gql`
    query{
      listOfTopics{
        id, name, isFollowed, poster
      },
      length(name:"list_of_topics")
    }
`;

export const GET_DIARY_LIST = gql`
    query{
      listOfDiary{
        id, name, viewerRating,viewerNotes, viewerRatingDate, poster
      },
      length(name:"list_of_diary")
    }
`;


export const GET_TOPIC = gql`
query topic($id:Int!){
  topic(id:$id){
    id,
    name,
    summary,
    content,
    poster,
    isFollowed,
    viewerPoints,
    movies{
      name,
      id,
      poster,
      slug
    },
    videos{
      id,
      title,
      summary,
      link,
      duration,
      tags
    },
    lists{
      id,name, image, isFollowed, slug
    },
  }
      listOfTopics{
        id, name, isFollowed
      }
}
`
export const GET_MOVIE = gql`
    query getMovie($id:Int!){
      movie(id:$id){
        id,
        name,
        year,
        poster,
        summary,slug
        data,
        director{
          id,
          name,
          slug
        },
        videos{
          id,
          title,
          summary,
          link,
          duration,
          tags,
          isFaved
        },
        isBookmarked,
        isFaved,
        viewerRating,
        viewerNotes,
        imdbRating,
        viewerPoints
      },
      listOfCrew(movieId:$id){
        job, character,
        person{
          id, name, slug
        }
      }
    }
`
export const PREDICTION = gql`
    query prediction($id:Int!){
      prediction(id:$id)
    }
`



export const PROFILE_QUERY = gql`
  query client($username: String!){
      viewer(username:$username){
          username,
          email
    }
  }
`
export const PROFILE = gql`
  query profile($username: String!){
      profile(username:$username){
        id,
        username,
        name,
        points,
        bio,
        avatar,
        isFollowed,
        bookmarks{
          id,name,poster,slug
        },
        latestRatings{
          movie{id,name,poster,slug},
          rating, updatedAt
        }
        lists{
          id, name,public, owner{
            username, id
          },slug
        },
        followers{
          id, username
        },
          favouriteMovies{
            id, name, year, poster, viewerRating, isFaved, slug
          },
          favouriteVideos{
            id, title, summary, link, isFaved
          },
          followingLists{
            id, name, image, slug
          },
          followingPersons{
            id, name, poster, slug
          },
          followingTopics{
            id, name, poster
          },
          followingProfiles{
            id, username
          },
        }
        viewer{
          lists{
            id,name, numMovies,slug
          }
        }
  }
`

export const PROFILE_LIGHT= gql`
  query profile($username: String!){
      profile(username:$username){
        id,
        username,
        points,
        bio,
        isFollowed,
        lists{
          id, name,public, slug, owner{
            username, id
          }
        },
        followingLists{
          id, name, image, slug
        }
        }
  }
`