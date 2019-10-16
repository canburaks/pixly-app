import React from "react";
import { useMemo, useCallback, useState, useEffect } from 'react';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { isEqualObj } from "../../functions"

import { 
    Box, Grid, ImageCard,PaginationBox,
    MovieCoverCard, MoviePosterCard,MovieSimilarCard, CrewCard, TagText,
    LikeIcon, BookmarkIcon , FollowIcon, FollowSuccessIcon, UnfollowIcon, FollowSuccessAnimateIcon,
  } from "../index"


  const QueryBox = ({query, variables, page,  }) =>{
    console.log("querybox",variables)
    const [parser, { loading, data, error, variables:prevVariables }] = useLazyQuery(query);
    const nextPage = useMemo(() => setPage(page => page + 1),[])
    const prevPage = useMemo(() => setPage(page => page - 1),[])

    console.log("topic query",data, props.variables)
    if (loading) return <Loading />
    if (data) return (
        <>
            <MovieCoverBox 
                columns={[2,3,3,3,4,4,6]} 
                items={data.complexSearch.topicResult} 
                fontSize={[12,12,14]}

                />
            <PaginationBox 
                currentPage={props.variables.page} 
                totalPage={Math.ceil(data.complexSearch.quantity/24)} 
                nextPage={props.nextPage} prevPage={props.prevPage} 
            />
        </>
        )
    
        else return <div></div>

}
