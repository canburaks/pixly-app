import gql from "graphql-tag";
import { GraphQLClient } from 'graphql-request'
import { setupClient } from 'use-graphql-request'
import { print } from "./lib"


const client = new GraphQLClient('https://playthough.com/graphql', {
    headers: {
        authorization: localStorage.getItem("AUTH_TOKEN") ? `JWT ${localStorage.getItem("AUTH_TOKEN")}` : `Bearer ${localStorage.getItem("AUTH_TOKEN")}`
    },
})

export const useGraphQL = setupClient(client)


export function useGql(query, variables){
    const { data,loading, error } = useGraphQL(query, variables)
    const response = { data, loading, error }
    console.log("use gql", response)
    return response
}

export const movieAutoCompleteQuery = (search) => {
    return useGql(AUTOCOMPLETE_MOVIE, {search})
}


const AUTOCOMPLETE_MOVIE = gql`
query searchMovie($search:String!, $first:Int, $skip:Int){
    searchMovie(search:$search first:$first, skip:$skip ){
        id,slug,
        name,
        year,
        poster
    }
}`


export const LIST_REFETCH = gql`
query liste($id:Int!, $first:Int, $skip:Int){
    liste(id:$id, first:$first, skip:$skip){
        id,slug,
        name,
        isFollowed,
        numMovies,
        numFollowers,
        isSelf,
        owner{
            username, id
            },
        movies{
            id, name, poster,isBookmarked, isFaved, viewerRating, slug
        }
    }
}
`

export const MYSELF = gql`
query myself{
    viewer{
        id,
        username,
        name,
        country,
        points,
        lists{
            id, name,public,image,slug, owner{
                username, id
                }
            },
        diaries{
            date, notes, rating, movie{
                id, name, poster
            }
        },
        favouriteMovies{
            id, name, year, poster, viewerRating, isFaved, slug
        },
        bookmarks{
            id,name,poster, slug
        },
    }
}
`

export const refetchList = (id) =>  ({ refetchQueries: [{query:LIST_REFETCH, variables:{id}}] })
export const refetchMe = { refetchQueries: [{query:MYSELF}] }