import gql from "graphql-tag";
import { request, GraphQLClient } from 'graphql-request'

export const FACEBOOK_CONNECT = gql`
  mutation facebookConnect($data: String!) {
    facebookConnect(data:$data) {
      user{
        profile{
          username,
        }
      },
      success,
      message
    }
  }
`;
export const FACEBOOK_AUTHENTICATE = gql`
  mutation facebookAuthenticate($data: String!) {
    facebookAuthenticate(data:$data) {
      success,
      message,
      user{
        profile{
          id,
          token,
          username,
          points,
          ratingset,
          numBookmarks,
          cognitoRegistered,
          cognitoVerified
        }
      }
    }
  }
`;


export const FORGET_PASSWORD = gql`
  mutation forgetPassword($username: String!) {
    forgetPassword(username:$username) {
      status
    }
  }
`;
export const CONFIRM_FORGET_PASSWORD = gql`
  mutation changeForgetPassword($username: String!, $verificationCode:String!, $newPassword: String! ) {
    changeForgetPassword(username:$username, verificationCode:$verificationCode, newPassword:$newPassword) {
      message,
      status
    }
  }
`;


export const CHANGE_PASSWORD = gql`
  mutation changePassword($username: String!, $oldPassword: String!, $newPassword: String!) {
    changePassword(username:$username, oldPassword:$oldPassword, newPassword:$newPassword) {
      user{
        profile {
          id,
          username,
          name, 
          bio,
          points,
          cognitoRegistered,
          cognitoVerified,
        }
      },
      message,
      status
    }
  }
`;


export const RESEND_REGISTRATION_MAIL = gql`
  mutation resendMail($username: String!) {
    resendMail(username:$username) {
      user{
        profile {
          id,
          username,
          name, 
          bio,
          points,
          cognitoRegistered,
          cognitoVerified,
        }
      },
      message
    }
  }
`;

export const CHECK_VERIFICATION = gql`
  mutation checkVerification($username: String!) {
    checkVerification(username:$username) {
      status
    }
  }
`;



export const PROFILE_MUTATION = gql`
  mutation ProfileMutation($username: String!, $name: String, $bio: String, $country: String) {
    profileInfoMutation(username: $username, name:$name, bio:$bio, country:$country) {
        profile {
          id,
          username,
          name, 
          bio,
          country
        }
      }
    }
`;
export const PREDICTION_MUTATION = gql`
    mutation prediction($id:Int!){
      prediction(id:$id){
        prediction
      }
    }
`


export const ADD_MOVIE = gql`
    mutation AddMovie( $movieId: Int!, $listeId: Int! ){
        addMovie(movieId:$movieId, listeId:$listeId){
            message, profile{
              lists{
                id, name, image, numMovies, owner{id, username}
              }
            }
        }
    }
`
export const ADD_MOVIES = gql`
    mutation AddMovies( $movieIds: [Int]!, $listeId: Int! ){
        addMovies(movieIds:$movieIds, listeId:$listeId){
            message,liste{id,name, numMovies, movies{id, name, poster}} profile{
              lists{
                id, name, image, numMovies, owner{id, username}
              }
            }
        }
    }
`

export const REMOVE_MOVIE = gql`
    mutation removeMovie( $movieId: Int!, $listeId: Int! ){
        removeMovie(movieId:$movieId, listeId:$listeId){
            message, profile{
              lists{
                id, name, image, numMovies, owner{id, username}
              }
            }
        }
    }
`

export const REMOVE_MOVIES = gql`
    mutation removeMovie( $movieIds: List!, $listeId: Int! ){
        removeMovie(movieIds:$movieIds, listeId:$listeId){
            message, profile{
              lists{
                id, name, image, numMovies, owner{id, username}
              }
            }
        }
    }
`

export const DELETE_LIST = gql`
    mutation DeleteList( $id: Int! ){
        deleteList(id:$id){
            profile{
                lists{
                    id,name, image, numMovies, owner{id, username}
                }
            },
            message
        }
    }
`

export const CREATE_LIST = gql`
    mutation CreateMutation(
        $name: String!,
        $summary: String,
        $public: Boolean){
        createList(name: $name, summary:$summary, public:$public){
            message,
            liste{id},
            profile{ 
                lists{
                    id, name, image, numMovies, owner{id, username}
                } 
            }
        }
    }
`


export const SIGNUP_MUTATION = gql`
  mutation SignupMutation(
    $email: String!
    $password: String!
    $username: String!
    $name: String!
  ) {
    createUser(email: $email, password: $password, username: $username, name: $name) {
      user {
        profile {
          token,username, id,
        }
      }
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation LoginMutation($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      user {
        profile {
          id,
          token,
          username,
          points,
          ratingset,
          numBookmarks,
          cognitoRegistered,
          cognitoVerified,
        }
      }
    }
  }
`;

export const LOGOUT_MUTATION = gql`
  mutation logout {
  logout{
        message
    }
  }
`
export const BOOKMARK_MUTATION = gql`
  mutation bookmark($id:Int!){
    bookmark(id:$id){
      user{
        profile{
          username
        }
      },
      movie{
        id,
        isBookmarked,
      }
    }
  }
`
export const FAV_MUTATION = gql`
  mutation fav($id:Int!, $type:String!){
    fav(id:$id, type:$type){
      user{
        id, username
      },
      video{
        id,
        title,
        isFaved
      },
      movie{
        id, name, isBookmarked, isFaved
      }
    }
  }
`

export const FOLLOW_MUTATION = gql`
  mutation follow($id:String, $obj:String!, $username:String){
    follow(id:$id, obj:$obj, username:$username){
      person{
        isFollowed
      },
      liste{
        isFollowed
      },
      targetProfile{
        isFollowed
      }
    }
  }
`
export const RATING_MUTATION = gql`
  mutation rating($id:Int!, $rate:Float!, $date:String, $notes:String){
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
export const IMAGE_UPLOAD = gql`
  mutation uploadAvatar($file: Upload!){
    uploadAvatar(file: $file){
        success
    }
  }
`
