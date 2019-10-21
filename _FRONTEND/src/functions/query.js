import gql from "graphql-tag";

export const MAIN_PAGE = gql`
query mainPage{
    mainPage{
    movies{id, slug, name, year, poster, coverPoster }
    lists{id, slug, name,  poster, coverPoster, largeCoverPoster }
    persons{id, slug, name, poster, coverPoster }
    }
}
`

export const MOVIE_BOARD = gql`
query listOfRecentMovies($first:Int, $skip:Int){
    listOfRecentMovies(first:$first, skip:$skip){
        id,
        name,
        year,
        slug,
        hasCover,
        poster,
        coverPoster,
    }
}
`

export const PERSONA = gql`
query persona($username:String!){
    persona(username:$username){
        profile{
            username,
            name,
            bio,
            country,
            points,
            active,
            avatar,
            cognitoVerified,
            cognitoRegistered,
            shouldChangePassword,
            bookmarks{ id,name,poster, slug},
            ratings{
                movie{ id, name, poster,slug, viewerRating }
                },
            favouriteMovies{
                id, name, year, poster,slug, viewerRating, isFaved
            },
            followingLists{
                id, name, image,listType, slug,
                owner{ id, username },
                relatedPersons{ id, name, poster, slug}
            },
            followingPersons{
                id, name, poster, slug, squarePoster
            },
            followers{
                id, username, avatar
            },
            followingProfiles{
                id, username, avatar
            },
        },
        recentMovies{
            id, name,slug, poster, coverPoster
        },
        recommendations{
            prediction,
            movie{
                id, name, year, slug, poster, coverPoster, summary,imdbRating, imdb,
                director{id, name, poster}
            }
        },
    }
}
`

export const DIRECTOR_PERSON_MIX = gql`
    query directorPersonMix($id:String, $slug:String){
    directorPersonMix(id:$id, slug:$slug){
        id,
        name,
        isActive,
        bio,
        slug,
        poster,
        jobs,
        filteredData,
    
        homepage,
        imdb,
        facebook,
        twitter,
        instagram,

        coverPoster,
        hasCover,
        seoTitle,
        seoDescription,
        seoShortDescription,
        seoKeywords,
        richdata,

        quotes,
        relatedLists{
            id,
            slug,
            name,
            listType,
            movies{
                id,name, slug, poster
            }
            },
        movies{
            name,
            id,
            slug,
            poster,coverPoster,
            year
            },
        videos{
            id,
            title,
            summary,
            link,
            duration,
            tags,
            isFaved,
            ytId,
            thumb
            },
        isFollowed,
    }
}
`

export const DIRECTOR = gql`
    query director($id:String!){
    director(id:$id){
        id,
        name,
        bio,, slug,
        poster,
        jobs,
        squarePoster,
        coverPoster,
        hasCover,
        movies{
            name,
            id,
            slug,
            poster,coverPoster
            },
        favouriteMovies{
            id, name, poster, slug
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
        isFollowed,
        viewerMovies{
            id,name, poster, slug
        },
        viewerFavouriteMovies{
            id,name, poster, slug
        }
    }
    }
`


export const MOVIE = gql`
    query getMovie($id:Int, $slug:String){
        movie(id:$id, slug:$slug){
            id,
            name,
            year, slug,
            poster,
            hasCover,
            coverPoster,
            summary,
            prediction,
            imdbRating,

            homepage,
            imdb,
            facebook,
            twitter,
            instagram,

        seoTitle,
        seoDescription,
        seoShortDescription,
        seoKeywords,
        richdata,

        quotes,
            director{
                id,
                name,
                slug
            },
        crew{
            job, character, person{
                id,name, poster, slug,
            }
        },
        similars{
          id, name, slug, poster, coverPoster, hasCover
        },
        contentSimilars{
            commonTags, movie{id, name, slug, poster, coverPoster, hasCover}
        },
        tags{
            name, slug, tagType, genreTag, subgenreTag, phenomenalTag, themeTag, formTag
        },
        videos{
            id,
            title,
            summary,
            link,
            duration,
            tags,
            isFaved,
            ytId,
            thumb
            },
        isBookmarked,
        isFaved,
        viewerRating,
        viewerPoints,
        appears{
            id, name,slug, owner{
                id, username
            },relatedPersons{
                id, name, poster, coverPoster, hasCover, slug
            }
        }
        },
        viewer{id,username,points, lists{id,name, numMovies}}
    }
`

export const PROFILE = gql`
query profile($username: String!){
    profile(username:$username){
        id,
        username,
        name,
        country,
        points,
        bio,
        avatar,
        isFollowed,
        isSelf,
        ratingset,
        bookmarks{
            id,name,poster, slug
            },
        lists{
            id, name,public,image,slug, owner{
                username, id
                }
            },
        ratings{
            movie{
                id, name, poster, viewerRating, slug
            }
            },
        followers{
            id, username, avatar
        },
        favouriteMovies{
            id, name, year, poster, viewerRating, isFaved, slug
        },
        followingLists{
            id, name, image,listType,, slug
            owner{
                id, username
            },
            relatedPersons{
                id, name, poster, slug
            }
        },
        followingPersons{
            id, name, poster, squarePoster, slug
        },
        followingProfiles{
            id, username, avatar
        },
    }
    viewer{
        id, username,ratingset,avatar,points, lists{
            id,name, numMovies, slug
        }
    }
}
`

export const MOVIE_SEARCH = gql`
query search($search:String!, $first:Int, $skip:Int){
    search(search:$search first:$first, skip:$skip ){
        id,
        name,
        year,
        slug,
        poster
        isBookmarked,
        isFaved,
        viewerRating
    },
    searchLength(search:$search first:$first, skip:$skip )
}`

export const SEARCH = gql`
query search($search:String!, $first:Int, $skip:Int){
    search(search:$search first:$first, skip:$skip ){
        movies{
            id,
            name,
            year,
            slug,
            hasCover,
            poster,
            coverPoster,
            isBookmarked,
            isFaved,
            viewerRating
            },
        length
    }
}`

export const AUTOCOMPLETE_MOVIE = gql`
query searchMovie($search:String!, $first:Int, $skip:Int){
    searchMovie(search:$search first:$first, skip:$skip ){
        id,
        name,
        slug,
        year,
        poster
    }
}`
export const LIST_SEARCH = gql`
query searchList($search:String!, $first:Int, $skip:Int){
    searchList(search:$search first:$first, skip:$skip ){
        id,
        name,
        slug,
        image,
        isFollowed,
        owner{
            id,username
        },
        numMovies
        },
        viewer{
            lists{
                id,name,numMovies
            }
        }
}`

export const DIRECTOR_SEARCH = gql`
query searchDirector($search:String!, $first:Int, $skip:Int){
    searchDirector(search:$search first:$first, skip:$skip ){
        id,
        name,
        slug,
        poster,
        isFollowed,
        lenMovies,
        isActive
    }
    viewer{
        lists{
            id,name,numMovies
        }
    }
}`

export const LISTE = gql`
query liste($id:Int, $slug:String, $page:Int,$first:Int, $skip:Int ){
    liste(id:$id, slug:$slug, page:$page, first:$first, skip:$skip ){
        id,
        slug,
        name,
        summary,
        isFollowed,
        numMovies,
        numFollowers,
        isSelf,
        referenceNotes,
        referenceLink,
        listType,
        seoTitle,
        poster, coverPoster, largeCoverPoster,
        seoDescription,
        seoShortDescription,
        seoKeywords,
        richdata,
        relatedPersons{
            id, name, slug
        },
        owner{
            username, id
            },
        movies{
            id, name,slug, year, hasCover, poster,isBookmarked, isFaved,
            viewerRating, coverPoster, summary,imdbRating
            tags{
                name, slug, genreTag, subgenreTag
            },
        },
        followers{
            username, avatar
        }
    },
}
`


export const BOOKMARKS = gql`
query listOfBookmarks($username:String!, $first:Int, $skip:Int){
    listOfBookmarks(username:$username first:$first, skip:$skip ){
        id,
        name,
        year,
        slug,
        poster
        isBookmarked,
        isFaved,
        viewerRating
    },
    length(name:"bookmarks"),
    viewer{
        lists{
            id,name, numMovies
        }
    }
}`

export const RATINGS_MOVIE = gql`
query listOfRatingsMovie($username:String!, $first:Int, $skip:Int){
    listOfRatingsMovie(username:$username first:$first, skip:$skip ){
        id,
        name,
        year,
        slug,
        poster
        isBookmarked,
        isFaved,
        viewerRating
    },
    length(name:"ratings"),
    viewer{
        lists{
            id,name, numMovies
        }
    }
}`
export const COUNTRIES = gql`
query countries{
    countries{
        country
    }
}
`

export const LIST_REFETCH = gql`
query profile($username:String!){
    profile(username:$username ){
        lists{
            id, name,slug, numMovies, image
        }

    }
}
`

export const MY_LIST_REFETCH = gql`
query liste($id:Int!, $first:Int, $skip:Int){
    liste(id:$id, first:$first, skip:$skip){
        id,
        name,
        summary,
        slug,
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
            id, name, year, slug, poster, viewerRating, isFaved
        },
        bookmarks{
            id,name,poster, slug
        },
    }
}
`
export const LIST_BOARD = gql`
    query listOfCategoricalLists($admin:Boolean, $first:Int, $skip:Int ){
        listOfCategoricalLists(admin:$admin, first:$first, skip:$skip){
        id,
        slug,
        name,
        poster,coverPoster,
        image,
        seoShortDescription,
        isFollowed,
        numMovies,
        listType,
        relatedPersons{
            id,name, poster, slug
        },
        owner{
            id,username
        },
    }
    }
`
export const ADVANCE_FILTER = gql`
    query filterPage($first:Int, $skip:Int, $year:Int, $minYear:Int,
        $maxYear:Int, $minRating:Float, $maxRating:Float, $tagMovielensIds: [Int], $tagCustomIds: [Int] ){
        filterPage( first:$first, skip:$skip, year:$year, minYear:$minYear, maxYear:$maxYear,
            minRating:$minRating, maxRating:$maxRating, tagMovielensIds:$tagMovielensIds, tagCustomIds:$tagCustomIds){
                advanceQueryResult{
                id,
                name,
                poster,coverPoster,
                year
            },
            quantity
        }
    }
`
export const COMPLEX_SEARCH = gql`
    query complexSearch(
        $keywords: String, 
        $page: Int, 
        $first: Int,
        $minYear: Int, $maxYear: Int, 
        $minRating: Float, $maxRating: Float, 
        $tags: [String],
        ){
        complexSearch( 
            keywords: $keywords,
            page: $page, 
            first:$first,
            minYear: $minYear, maxYear: $maxYear,
            minRating: $minRating, maxRating: $maxRating, 
            tags: $tags,
            ){  
                result{
                    id,
                    name,
                    poster,
                    coverPoster,
                    year,
                    slug
                }
                quantity
        },
    }
`
export const COMPLEX_TAG_SEARCH = gql`
    query complexSearch(
        $keywords: String, 
        $page: Int, 
        $minYear: Int, $maxYear: Int, 
        $minRating: Float, $maxRating: Float, 
        $tags: [String],
        ){
        complexSearch( 
            keywords: $keywords,
            page: $page, 
            minYear: $minYear, maxYear: $maxYear,
            minRating: $minRating, maxRating: $maxRating, 
            tags: $tags,
            ){
                result{
                id,
                name,
                hasCover,
                poster,
                coverPoster,
                year,
                slug
            },
            quantity
        }
    }
`


export const DISCOVERY_LISTS = gql`
    query discoveryLists{
        discoveryLists{
            id,
            slug,
            name,
            poster,
            listType,
            relatedPersons{
                id, name, poster, coverPoster
            },
            imagesAll
        },        listOfTags{
            movielensId, name, quantity, tagType, customId
        }
    }

`
export const TAG_LIST = gql`
    query listOfTags{
        listOfTags{
            name, slug,  tagType, genreTag, subgenreTag
        }
    }

`
export const TOPIC_SEARCH_QUERY = gql`
    query complexSearch(
        $page: Int, 
        $minYear: Int, $maxYear: Int, 
        $minRating: Float, $maxRating: Float, 
        $tags: [String], $topicSlug:String
        ){
        complexSearch( 
            page: $page, 
            minYear: $minYear, maxYear: $maxYear,
            minRating: $minRating, maxRating: $maxRating, 
            tags: $tags, topicSlug:$topicSlug
            ){  
                topicResult{
                        id, name,slug, year, hasCover, poster,isBookmarked, isFaved,
                        viewerRating, coverPoster, summary,imdbRating
                        tags{
                            name, slug, genreTag, subgenreTag
                    },
                }
                topic{
                    name, summary,content, slug, poster, 
                    seoTitle, seoShortDescription, seoKeywords,
                    coverPoster, createdAt, updatedAt, wiki
                    quotes{
                        ownerName, text
                    }
                },
                quantity
        }
}
`
export const TOPIC_LIST_QUERY = gql`
    query{
        listOfTopics{
            id,name, slug, coverPoster, summary
        }
    }
`

export const TOPIC_QUERY = gql`
    query topic($slug:String){
        topic(slug:$slug){
            id,name, slug, coverPoster
        }
    }
`


export const refetchList = { refetchQueries: [{query:MYSELF}] }
export const refetchMe = { refetchQueries: [{query:MYSELF}] }


export function refetchFunction(query, variables){
    return { refetchQueries: [{query, variables}] }
}

/*
export const TAG_LIST = gql`
    query discoveryLists{
        listOfTags{
            name, slug,  tagType, genreTag, subgenreTag
        }
    }

`
*/