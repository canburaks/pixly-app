import React from "react";
import { useContext,useState,useReducer,useEffect,lazy,Suspense,useRef, useMemo} from "react";
import { MAIN_PAGE } from "../functions/query";
import { withRouter, Link } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";

import { rgaPageView, rgaStart, Head, MidPageAd, HomePageFeedAd, MoviePageAd, FeedMobileCollectionAd, ListBoardAd} from "../functions/analytics";
import {
	useWindowSize,
	useAuthCheck,
	useClientWidth,
	useValues
} from "../functions/hooks";


//import { motion, useViewportScroll } from "framer-motion"
import {
    ListCard, PageContainer, ContentContainer, Grid, ListCoverBox, HiddenHeader, ImageCard,
    TopicCoverCard, TextSection,Image, SuperBox,FlexListItem, Dt, Dd, CoverLink, Hr,
    Loading, HeaderText, HeaderMini, NewLink, Text,Box, FlexBox, Span, CoverBox, SubHeaderText
} from "../styled-components"


const ListOfFilms = (props) => {
    const data = props.data
    
    //LISTS
    
    function changeListOrder(lists){
        const orderedlists = lists.sort((a,b) => a.id - b.id)
        const directorsFavourite = orderedlists.filter( l => l.listType==="df")
        const festivalWinners = orderedlists.filter(l => l.listType === "fw")
        const otherLists = orderedlists.filter(l => l.listType === "ms")
        const listOfMonth = orderedlists.filter(l => l.listType === "mm")
        const listOfYear = orderedlists.filter(l => l.listType === "my")
        const result = [...listOfYear, ...listOfMonth, ...otherLists, ...festivalWinners, ...directorsFavourite]
        return result
    }
    const allLists = useMemo(() => changeListOrder(props.data.lists), [])

    // TOPIC
    const topics = useMemo(() => props.data.topics.sort((a,b) => b.id - a.id),[])

    
    //console.log("data",topics, allLists)
    useEffect(() => window.scrollTo(0,0), [])
    return (
        <PageContainer top={-75}>
            <Head
                title={"Great Lists of Films - Discover Collections of Best and Great Movies"}
                description={
                        `Right place for people asking What movie should I watch?` + 
                        `Check the great lists of films that includes the masterpieces of cinema that will fit your cinema taste or mood.`
                }

                canonical={`https://pixly.app/lists-of-films`}
				image={"https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/landing-page/main-page-collage.jpg"}
            />
            <Hero />
            <TopicSection topics={topics} />
            <Hr  border="3px solid" bg="dark"/>
            <ListeSection lists={allLists} />

        </PageContainer>
    )
}
const TopicSection = ({topics, partitionQuantity=4}) => (
    <FlexBox 
        width="100%" height="auto" 
        flexDirection="column" 
        px={["5vw", "5vw", "8vw", "8vw", "10vw", "15vw"]} 
        my={[3,3,4,4,5]}
    >
        <SubHeaderText 
            fontSize={["20px", "20px", "24px", "28px", "32px", "36px"]}
            color="dark" textAlign="center" width="100%"
        >
        <Span  
            fontFamily={"playfair"} minWidth={"100%"}
            fontSize={["24px", "24px", "28px", "32px", "38px", "44px"]} 
            color="dark"  fontWeight={400}
            textAlign="center" opacity={1}
        >
            Topic Collections
        </Span><hr/>
            The Categorical List of Masterpiece Films 
        </SubHeaderText>
        <Text mt={[3]} textAlign="justify" color="dark">
        {`Pixly topics are kind of collections that are more specific than genre based collections. ` + 
            `Topic movies can focus on some specific issue, or can include the topic as an element of the narrative ` +
            `such as art house, cyberpunk films or movies that focus on rich dialogues or movies passed the Bechdel test. ` +
            `We added a filter mechanism to some topics which you can filter the films by IMDb rating or release year. ` 
            }
        </Text>
        <dl>
            <Grid columns={[1,1,2,2,2,2,3]} py={[4]} gridColumnGap={[3,3,3,4]}>
                {topics.slice(0, partitionQuantity).map( item => (
                    <CollectionCard 
                        item={item} key={"rec" + item.id}  
                        link={`/topic/${item.slug}`} 
                        text={item.seoShortDescription} />
                ))}
            </Grid>
            <HomePageFeedAd />


            <Grid columns={[1,1,2,2,2,2,3]} py={[4]} gridColumnGap={[3,3,3,4]}>
                {topics.slice(partitionQuantity, partitionQuantity*2).map( item => (
                    <CollectionCard 
                        item={item} key={"rec" + item.id}  
                        link={`/topic/${item.slug}`} 
                        text={item.seoShortDescription} />
                ))}
            </Grid>
            <MoviePageAd />

            <Grid columns={[1,1,2,2,2,2,3]} py={[4]} gridColumnGap={[3,3,3,4]}>
                {topics.slice(partitionQuantity*2, partitionQuantity*3).map( item => (
                    <CollectionCard 
                        item={item} key={"rec" + item.id}  
                        link={`/topic/${item.slug}`} 
                        text={item.seoShortDescription} />
                ))}
            </Grid>
            <FeedMobileCollectionAd />
        </dl>
    </FlexBox>
)

const ListeSection = ({lists, partitionQuantity=6}) => (
    <FlexBox 
        width="100%" height="auto" 
        flexDirection="column" 
        px={["5vw", "5vw", "8vw", "8vw", "10vw", "15vw"]} 
        my={[3,3,4,4,5]} py={[4,4,5]}
    >
        <SubHeaderText 
            fontSize={["20px", "20px", "24px", "28px", "32px", "36px"]}
            color="dark" textAlign="center" width="100%"
        >
        <Span  
            fontFamily={"playfair"} minWidth={"100%"}
            fontSize={["24px", "24px", "28px", "32px", "38px", "44px"]} 
            color="dark"  fontWeight={400}
            textAlign="center" opacity={1}
        >
            Collected List Of Films
        </Span><hr/>
        </SubHeaderText>
        <Text mt={[3]} textAlign="justify" color="dark">
            In this part of the great lists of films, you will find very different 
            cinema masterpieces from all around the world cinema. The movies that have won the&nbsp;
            grand prize of film festivals, favourite movies of the directors, top and best movies according to&nbsp;
            cinema professionals, and many more.
        </Text>

        <Text mt={[3]} textAlign="justify" color="dark" fontWeight="bold">
            Are you looking for mainstream movies and classics that must be watched?
        </Text>
        <Text mt={[1]} textAlign="justify" color="dark">
            You can check the <NewLink to="/list/imdb-top-250/1" underline>IMDB Top 250</NewLink> or&nbsp;
            <NewLink to="/list/pixly-selections--good-movies-to-watch/1" underline>Pixly Selections</NewLink>.
        </Text>

        <Text mt={[3]} textAlign="justify" color="dark" fontWeight="bold">
            Are you looking for art movies rather mainstream films?
        </Text>
        <Text mt={[1]} textAlign="justify" color="dark">
            You can check the list of movies that have won the grand prize of Cannes, Berlin and Venice Film Festivals.
            The lists of favourite movies of famous directors can also be a good place for you.
            
        </Text>
        <dl>
            <Grid columns={[1,1,2,2,2,3]} py={[4]} gridColumnGap={[3,3,3,4]}>
                {lists.slice(0, partitionQuantity).map( item => (
                    <CollectionCard ratio={0.4}
                        item={item} key={"rec" + item.id}  
                        link={`/list/${item.slug}/1`} 
                        text={item.seoShortDescription} />
                ))}
            </Grid>
            <MidPageAd />


            <Grid columns={[1,1,2,2,2,3]} py={[4]} gridColumnGap={[3,3,3,4]}>
                {lists.slice(partitionQuantity, partitionQuantity*2).map( item => (
                    <CollectionCard ratio={0.4}
                        item={item} key={"rec" + item.id}  
                        link={`/list/${item.slug}/1`} 
                        text={item.seoShortDescription} />
                ))}
            </Grid>
            <ListBoardAd />

            <Grid columns={[1,1,2,2,2,3]} py={[4]} gridColumnGap={[3,3,3,4]}>
                {lists.slice(partitionQuantity*2, partitionQuantity*3).map( item => (
                    <CollectionCard ratio={0.4}
                        item={item} key={"rec" + item.id}  
                        link={`/list/${item.slug}/1`} 
                        text={item.seoShortDescription} />
                ))}
            </Grid>
        </dl>
    </FlexBox>
)

const Hero = () => (
    <FlexBox className="unmatched-red"
        width="100%"
        height="auto"
        display="flex" flexDirection="column"
        px={"5vw"} pt={[5,5,5,6]} pb={[3,3,4]}
        bg={"rgba(0,0,0,0.8)"}
    >
        <CoverBox bg={"rgba(0,0,0,0.4)"} zIndex={0} />

        <HeaderText  zIndex={1}
            fontFamily={"playfair"} fontWeight={[400]}
            fontSize={["24px", "24px", "28px", "32px", "38px", "44px"]}
            color="white" my={[3]} pt={[3]}
            textAlign="center" 
        
        >
        <Span  
            fontFamily={"playfair"} minWidth={"100%"}
            fontSize={["24px", "24px", "28px", "32px", "38px", "44px"]}
            color="white"  fontWeight={400}
            textAlign="center" opacity={1}
        >
            Great Lists Of Films
        </Span>
            <hr/>
            Curated and Collected
            Movie Lists
        </HeaderText>  
        <SubHeaderText zIndex={1}
            fontFamily={"playfair"} minWidth={"100%"}
            fontSize={["18px", "18px", "20px", "24px", "26px", "28px", "34px"]}
            color="white"  fontWeight={400} mt={[4,4,5]}
            textAlign="center" opacity={1}
        >
            "Right Place for people asking <em>What Movie Should I Watch?</em>"
        </SubHeaderText>
</FlexBox>
)

const CollectionCard = (props) => (
    <FlexBox flexDirection="column" mb={[5]} height={"100%"} mt={[2]}>
        <SuperBox 
            display="flex" flexDirection="column" 
            src={props.item.coverPoster || props.item.poster} 
            ratio={props.ratio || 0.5625} borderRadius={"8px"}
            width={"100%"}
        ><CoverLink link={props.link} color="transparent">{props.link}</CoverLink>
        </SuperBox>
        <HeaderMini width={"75%"} fontFamily={"playfair"} color="dark" hoverUnderline
            my={[2,2,3]}
            >
            <NewLink link={props.link}>
            <Dt>
                {props.item.name}
            </Dt>
            </NewLink>
        </HeaderMini>
        <Dd  
            color="dark"
            textAlign="justify"
        >
            {props.text.slice(0,200)}
        </Dd>
        <Box position="absolute" bottom={"20px"} width={"100%"}>
            <NewLink link={props.link}  
                fontWeight="bold" color="dark" 
                hoverUnderline
            >
                {props.buttonText || "See more"}
            </NewLink>
            <Hr my={"8px"} />
        </Box>
    </FlexBox>
    )
const ListOfFilmsQuery = props => {
	const { loading, error, data } = useQuery(MAIN_PAGE, {
		partialRefetch: true
	});
	if (loading) return <Loading />;
	//console.log("main", data)
	if (error) return <div>{error.message}</div>;
	if (data) return <ListOfFilms data={data.mainPage} {...props} />;
};

export default withRouter(ListOfFilmsQuery);

