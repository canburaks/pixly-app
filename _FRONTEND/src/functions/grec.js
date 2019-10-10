import { GraphQLClient } from 'graphql-request'
import { print } from "./lib"
import gql from 'graphql-tag'
import { setupClient } from 'use-graphql-request'


const client = new GraphQLClient('https://playthough.com/graphql', {
  headers: {
      authorization: localStorage.getItem("AUTH_TOKEN") ? `JWT ${localStorage.getItem("AUTH_TOKEN")}` : `Bearer ${localStorage.getItem("AUTH_TOKEN")}`
  },
})

export const useGraphQL = setupClient(client)



export async function main(query, variables = null) {
    const endpoint = 'https://pixly.app/graphql';
    const token = localStorage.getItem("AUTH_TOKEN")
    var result;
    const client = new GraphQLClient(endpoint, {
        headers: {
            authorization: token ? `JWT ${token}` : `Bearer ${token}`
        },
    })
    try {
        const data= await client.request(query, variables);
        print("gql request main data", data)
        result = await data;
    } 
    catch(err) {
        // If the promise rejects, we enter this code block
        console.log(err);
        result = await err
      }

      finally {
          return result
      }
}

export function predictionQuery(id){
  const result = main(PREDICTION, {id:id})
  const { data } = result;
  return data;
}

export async function movieAutoComplete(input) {
  //console.log("input", input)
  const endpoint = 'https://pixly.app/graphql';
  var result;
  const client = new GraphQLClient(endpoint)
  try {
    const data = await client.request(AUTOCOMPLETE_MOVIE, {search:input, first:8, skip:0});
    //print("gql request main data", data.searchMovie)
    result = await data;
  }
  catch (err) {
    // If the promise rejects, we enter this code block
    console.log("error", err);
    result = await err
  }

  finally {
    return result.searchMovie
  }
}

export const AUTOCOMPLETE_MOVIE = `
query searchMovie($search:String!, $first:Int, $skip:Int){
    searchMovie(search:$search first:$first, skip:$skip ){
        id,
        slug,
        name,
        year,
        poster
    }
}`

export const SIGNUP_MUTATION = `
  mutation SignupMutation(
    $email: String!
    $password: String!
    $username: String!
  ) {
    createUser(email: $email, password: $password, username: $username) {
      user {
        profile {
          token,username, id
        }
      }
    }
  }
`;

export const LOGIN_MUTATION = `
  mutation LoginMutation($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      user {
        profile {
          id,
          token,
          username,
          points
        }
      }
    }
  }
`;
export const BOOKMARK_MUTATION = `
  mutation bookmark($id:Int!){
    bookmark(id:$id){
      user{
        profile{
          username
        }
      },
      movie{
        id,
        name,
        slug,
        year,
        poster,
        summary,
        isBookmarked,
        viewerRating
      }
    }
  }
`
export const FAV_MUTATION = `
  mutation fav($id:Int!){
    fav(id:$id){
      user{
        id, username
      },
      video{
        id,
        title,
        isFaved
      }
    }
  }
`

export const FOLLOW_MUTATION = `
  mutation follow($id:String!, $obj:String!){
    follow(id:$id, obj:$obj){
      person{
        isFollowed
      },
      liste{
        isFollowed
      },
      topic{
        isFollowed
      }
    }
  }
`
export const RATING_MUTATION = `
  mutation rating($id:Int!, $rate:Float!, $date:Date, $notes:String){
    rating(id:$id, rate:$rate, date:$date, notes:$notes){
      user{
        profile{
          username
        }
      },
      movie{
        viewerRating
      },
      rating{
        rating, notes, date
      }
    }
  }
`


export const GET_LIST = `
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
export const GET_FOLLOWINGS = `
    query viewer($username:String){
      viewer(username:$username){
      followLists{
        id,name, image,slug
      },
      followPersons{
        id, name, ,slug, images{info, url}
      },
      followTopics{
        id,name,poster, summary
      }
    }
  }
`


export const GET_LIST_OF_LISTS = `
    query listOfLists($first:Int, $skip:Int ){
      listOfLists(first:$first, skip:$skip){
        id,
        slug,
        name,
        image,
        isFollowed
      },
      length(name:"all_lists")
    }
`
export const LISTE = `
    query liste($id:Int, $name: String, $search:String, $first:Int, $skip:Int){
      liste(id:$id, name:$name, search:$search, first:$first, skip:$skip ){
        id,
        name,
        slug,
        year,
        poster,
        viewerRating
      },
      length(id:$id,  name:$name, search:$search)
    }
`

export const GET_DIRECTOR_LIST = `
    query listOfDirectors($first:Int, $skip:Int){
        listOfDirectors(first:$first, skip:$skip){
        id,
        slug,
        name,
        poster,
        isFollowed,
        lenMovies
      },
      length(name:"list_of_directors")
    }
`;

export const GET_PERSON = `
    query getPerson($id:String!){
      person(id:$id){
        id,
        name,
        bio,
        slug,
        poster,
        movies{
          slug,
          name,
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

export const GET_TOPIC_LIST = `
    query{
      listOfTopics{
        id, name, isFollowed, poster
      },
      length(name:"list_of_topics")
    }
`;

export const GET_DIARY_LIST = `
    query{
      listOfDiary{
        id, name, viewerRating,viewerNotes, viewerRatingDate, poster
      },
      length(name:"list_of_diary")
    }
`;


export const GET_TOPIC = `
query topic($id:Int!){
  topic(id:$id){
    id,
    name,
    summary,
    content,
    poster,
    isFollowed,
    movies{
      name,
      id,
      poster
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
      id,name, image, isFollowed
    },
  }
      listOfTopics{
        id, name, isFollowed
      }
}
`
export const GET_MOVIE = `
    query getMovie($id:Int!){
      movie(id:$id){
        id,
        name,
        year,
        slug,
        poster,
        summary,
        data,
        pic,
        images{
          info
        },
        director{
          id,
          name
          slug,
        },
        videos{
          id,
          title,
          summary,
          link,
          duration,
          tags
        },
        isBookmarked,
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
export const PREDICTION = `
    query prediction($id:Int!){
      prediction(id:$id)
    }
`



export const PROFILE_QUERY = `
  query client($username: String!){
      viewer(username:$username){
          username,
          email
    }
  }
`
export const PROFILE = `
  query profile($username: String!, $isSelf:Boolean!){
      profile(username:$username, isSelf:$isSelf){
        text,
          favouriteMovies{
            id, name, year, poster, viewerRating, slug
          },
          favouriteLists{
            id, name, image, slug
          },
          favouritePersons{
            id, name, poster, slug
          },
          favouriteTopics{
            id, name, poster
          }
    }
  }
`