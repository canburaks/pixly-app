import React from 'react'
import { useState, useContext, useMemo, useCallback } from "react"
import { 
    Box, FlexBox, Text,Input,SearchInput, Form,Loading, Button,
    ImdbIcon, WatchIcon, SearchIcon,SubHeaderText,
    PageContainer, ContentContainer, InputRange, SearchButton, PaginationBox, 
    TextSection,SchemaArticle,MovieRichCardBox,MovieRichCard, Grid,
    YearSlider,RatingSlider,HtmlBox, HtmlContainer, MessageBox, 
    LargeTopicMovieCard, SmallTopicMovieCard,
} from "../styled-components"

import {
	useWindowSize,
	useAuthCheck,
	useClientWidth,
	rgaSetCloseTime,
	useValues,
} from "../functions";

import { useQuery } from '@apollo/react-hooks';
import { TAG_MOVIES_QUERY } from "../functions/query"


const TagMovies = (props) => {
    const isAuth = useAuthCheck()
    console.log(props)
    const { loading, data, } = useQuery(TAG_MOVIES_QUERY, {variables:{slug:props.match.params.slug}, skip:!isAuth})
    console.log(data)
    return(
        <PageContainer>
            <ContentContainer>
            {data && data.tagMovies.map(movie => (
                    <MovieRichCardBox item={movie} key={movie.id} />
            ))}
            </ContentContainer>
        </PageContainer>
    )
}

export default TagMovies