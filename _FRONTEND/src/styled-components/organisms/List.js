import React from "react";
import { useMemo, useCallback, useState } from 'react';

import { 
    Box, Grid, ImageCard,PaginationBox,
    MovieCoverCard, MoviePosterCard,MovieSimilarCard, CrewCard,
    RecommendationCard,MovieInformationCard,MovieRichCard,
    TagBox,FlexBox
} from "../index"

export const MovieRichCardBox = React.memo((props) => (
    <Grid columns={[1,1,1,2,2,2,3,3,4]} py={[4]}>
        {props.items.map( item => (
            <MovieRichCard item={item} key={"rec" + item.id} follow={props.follow} />
        ))}
    </Grid>
))



export const ListCoverBox = React.memo(({ items, columns=[1,1,2,2,2,3,3], ratio=0.41, text=false }) => (
    <Grid columns={columns} py={[4]}>
        {items.map( item => (
            <ImageCard
                src={item.coverPoster} 
                text={text === true ? item.name : null}
                key={item.slug}
                link={`/list/${item.slug}/1`}
                hiddentext={item.name}
                ratio={ratio} 
                width={"100%"}
                boxShadow="card"
                hoverShadow
            />
            ))}
    </Grid>
))


export const MoviePosterBox = React.memo(({ items, columns=[2,3,4,5,6,6, 8], ratio=1.6, notext=false, ...props }) => (
    <Grid 
        columns={columns} py={[4]}         
    >
        {items.map( item => (
            <MoviePosterCard
                notext={notext}
                item={item}
                key={item.slug}
                ratio={ratio} 
                width={"100%"}
                fontSize="xs"
                {...props}
            />
            ))}
    </Grid>
))

export const MovieCoverBox = React.memo(({ items, columns=[2,2,3,4,4,4,5], ratio=0.5625, notext=false, ...props }) => (
    <Grid columns={columns } py={[4]}>
        {items.map( item => (
        <MovieCoverCard 
            notext={notext}
            title={item.name + ` - ${item.year}`}
            item={item}
            ratio={ratio}
            follow={props.follow}
            key={props.key ? props.key + item.slug : item.slug}
            {...props} 
        />))}
    </Grid>
), (p,n) => (p.key ? (p.key === n.key) : (p.items.length === n.items.length)) )


//For Content Similar Movies with common tags 

//For Content Similar Movies with common tags 
export const MovieInformationBox = React.memo(({ items, columns=[1,1,2,2,3,3,4], ratio=0.5625, ...props }) => (
    <Grid columns={columns} py={[4]}>
        {items.map( item => (
            <MovieInformationCard item={item} key={"rec" + item.id}/>
        ))}
    </Grid>
))

export const MovieSimilarBox = React.memo(({ items, columns=[1,1,2,2,3,3,4], ratio=0.5625, ...props }) => (
    <Grid columns={columns} py={[4]}>
        {items.map( item => (
        <MovieSimilarCard 
            item={item.movie}
            ratio={ratio}
            key={"sim" + item.movie.slug}
            {...props} 
        >
            <TagBox tags={item.commonTags} />
        </MovieSimilarCard>
        ))}
    </Grid>
), (p,n) => (p.key ? (p.key === n.key) : (p.items.length === n.items.length)))

export const ProfileCircleBox = React.memo(({ items, columns=[4,6,8,10,12] }) => (
    <Grid
        columns={columns} py={[2]}         
    >
        {items.map( item => (
            <ImageCard
                src={item.avatar} 
                key={item.username}
                title={item.username}
                link={`/user/${item.username}`}
                ratio={1} 
                width={"100%"}
                borderRadius="100%"
                boxShadow="card"

            />
            ))}
    </Grid>
))



export const RecommendationBox = React.memo(({ items, columns=[1,1,2,2,3,3,4], ratio=0.5625, ...props }) => (
    <Grid columns={columns} py={[4]}>
        {items.map( item => (
        <MovieInformationCard item={item} key={"rec" + item.id}/>
        ))}
    </Grid>
))




// For paginated containers
export const ElementListContainer = (props) => {
    const { items, type="poster", perPageItems=24 } = props;

    const [currentPage, setCurrentPage] = useState(() => props.page ? props.page : 1)
    //console.log("m",movies)
    const totalPageNumber = Math.ceil(items.length / perPageItems)
    const isOverflowed = items.length > perPageItems;


    const [ listStart, listEnd ] = useMemo(() => [((currentPage - 1) * perPageItems), (currentPage * perPageItems)], [currentPage])
    const slicedItems = items.slice(listStart, listEnd)

    const RenderElement = type==="poster" 
        ? MoviePosterBox : (type==="cover" 
            ? MovieCoverBox : (type==="recommendation"
                ? RecommendationBox : ProfileCircleBox))

    //const RenderElement = <RenderElementSelector type={type} />

    const prevPage = useCallback(() => (setCurrentPage(currentPage => currentPage - 1)), [])
    const nextPage = useCallback(() => (setCurrentPage(currentPage => currentPage + 1)), [])


    return(
        <Box flexDirection="column" justifyContent="flex-start" width={"100%"}>
            
            <RenderElement  items={slicedItems} />


            {/*PAGINATION */}
            {isOverflowed && 
                <PaginationBox 
                    currentPage={currentPage} 
                    totalPage={totalPageNumber} 
                    nextPage={nextPage} prevPage={prevPage} 
                />}
        </Box>
    )
}

