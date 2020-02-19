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
    TopicCoverCard, TextSection,Image, SuperBox,FlexListItem, Dt, Dd, CoverLink, Hr,CardContainer,
    Loading, HeaderText, HeaderMini, NewLink, Text,Box, FlexBox, Span, CoverBox, SubHeaderText,CoverImage
} from "../styled-components"
import { LazyLoadComponent } from 'react-lazy-load-image-component';
import Carousel from 'nuka-carousel';


const ListOfFilms = (props) => {
    const data = props.data
    //console.log(data)
    
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

    const orderTopics = () => {
        const firstPart = []
        
        // order of topics wrt slugs
        const featureSlugs = [
            "cinematic-documentary", "post-apocalyptic", "bdsm-movies",
            "romantic-comedy","gangster-films","mystery",
            "cyberpunk","historical-figures", "art-house",
            "based-on-true-story"
        ]
        
        //create featured topics
        featureSlugs.forEach(slug => {
            props.data.topics.forEach(t => {
                if (t.slug === slug){
                    firstPart.push(t)
                }
            })
        })
        //remove featured topics
        const secondPart = props.data.topics.filter(t => !featureSlugs.includes(t.slug))
        return [...firstPart, ...secondPart]
    }
    const topics = useMemo(() => orderTopics(),[])
    const responsive = [
        { breakPoint: 1280, cardsToShow: 4 }, // this will be applied if screen size is greater than 1280px. cardsToShow will become 4.
        { breakPoint: 760, cardsToShow: 2 },
      ];
    //console.log("data",topics)
    useEffect(() => window.scrollTo(0,0), [])
    const isSmallScreen = window.innerWidth < 500
    return (
        <PageContainer>
            <Head title={"Great Lists of Films - Discover Collections of Best and Great Movies"}
                description={
                        `Right place for people asking What movie should I watch?` + 
                        `Check the great lists of films that includes the masterpieces of cinema that will fit your cinema taste or mood.`
                }

                canonical={`https://pixly.app/lists-of-films`}
				image={"https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/landing-page/great-film-lists-arrival-small.jpg"}
            />
            {true && <FlexBox 
                overflow="hidden" flexDirection="column" 
                position="relative"  
                width={"100%"} bg="dark"
                //borderBottom="8px solid"
                //borderColor="rgba(40,40,40, 1)"
                zIndex={1}
            >
                <HeaderText  zIndex={1}
                    fontWeight={[400]}
                    fontSize={["24px", "24px", "28px", "32px", "38px", "44px"]}
                    color="white"pt={[3]}
                    textAlign="center" 
                    fontFamily={"playfair"}
                >

                    List Of Movie Collections
                </HeaderText>   
                <Carousel className={"list-carousel"}
                    autoplay 
                    easing="easeSinInOut" swiping 
                    speed={500}
                    slideWidth={isSmallScreen ? 0.8 : 0.5}
                    //heightMode={{max:250}}
                    //autoplayInterval={3000} 
                    slideIndex={1}
                    cellAlign="center"
                    //cellSpacing={window.innerWidth/20} 
                    framePadding={"20px 0 20px 0"}
                >
                    {topics.slice(0,10).map(topic => (
                        <FlexBox position="relative" width={"100%"} height="100%" key={topic.slug} p={[2]} >
                            <CoverImage 
                                ratio={0.6}
                                alt={`Popular Films: ${topic.name}`}
                                title={`Popular Films: ${topic.name}`}
                                src={topic.coverPoster}
                                link={`/topic/${topic.slug}`}
                                borderRadius={"6px"}
                            />
                        </FlexBox>
                    ))}
                </Carousel>
                <SubHeaderText zIndex={1}
                    fontFamily={"playfair"} minWidth={"100%"}
                    fontSize={["12px", "12px", "14px", "14px"]}
                    color="white"  fontWeight={400} mt={[1]}
                    textAlign="center" opacity={1}
                >
                    "Right Place for people asking <strong><em>What Movie Should I Watch?</em></strong>"
                </SubHeaderText>   
            </FlexBox>}

            <ContentContainer>
                <TopicSection topics={topics} />
                <ListeSection lists={allLists} />
            </ContentContainer>
        </PageContainer>
    )
}
const TopicSection = ({topics, partitionQuantity=6}) => (
    <CardContainer px={[4]}>
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
            The Categorical List of Films 
        </SubHeaderText>
        <Text mt={[3]} textAlign="justify" color="dark" fontSize={["12px", "12px", "14px"]}>
            Pixly topics are kind of film collections that can be a genre or 
            subgenre film list with brief or detailed explanations. The films of these 
            lists are selected by us. Those include the top and well-known movies of its category.
            We often expand our collections by either creating a new list of movies or updating the current ones.

        </Text>
            <Grid columns={[1,1,2,2,2,3]} py={[2,2,3]} gridColumnGap={[2,2,3]}>
                {topics.slice(0, partitionQuantity).map( item => (
                    <CollectionCard 
                        item={item} key={"rec" + item.id}  
                        link={`/topic/${item.slug}`} 
                        text={item.seoShortDescription} 
                        buttonText={`See ${item.shortName} Movies`}
                    />
                ))}
            </Grid>
            <HomePageFeedAd />


            <Grid columns={[1,1,2,2,2,3]} py={[4]} gridColumnGap={[2,2,3]}>
                {topics.slice(partitionQuantity, partitionQuantity*2).map( item => (
                    <CollectionCard 
                        item={item} key={"rec" + item.id}  
                        link={`/topic/${item.slug}`} 
                        text={item.seoShortDescription} 
                        buttonText={`See ${item.shortName} Movies`}
                    />
                ))}
            </Grid>
            <MoviePageAd />

            <Grid columns={[1,1,2,2,2,3]} py={[4]} gridColumnGap={[2,2,3]}>
                {topics.slice(partitionQuantity*2, partitionQuantity*3).map( item => (
                    <CollectionCard 
                        item={item} key={"rec" + item.id}  
                        link={`/topic/${item.slug}`} 
                        text={item.seoShortDescription} 
                        buttonText={`See ${item.shortName} Movies`}
                    />
                ))}
            </Grid>
    </CardContainer>
)

const ListeSection = ({lists, partitionQuantity=6}) => (
    <CardContainer px={[4]}>
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
        <Text mt={[3]} textAlign="justify" color="dark" fontSize={["12px", "12px", "14px"]}>
            In this part of the great lists of films, you will find very different 
            cinema masterpieces from all around the world cinema. The movies that have won the&nbsp;
            grand prize of film festivals, favourite movies of the directors, top and best movies according to&nbsp;
            cinema professionals, and many more.
        </Text>
            <Grid columns={[1,1,2,2,2,2,3]} py={[4]} gridColumnGap={[2,2,3]}>
                {lists.slice(0, partitionQuantity).map( item => (
                    <CollectionCard ratio={0.4}
                        item={item} key={"rec" + item.id}  
                        link={`/list/${item.slug}/1`} 
                        text={item.seoShortDescription} />
                ))}
            </Grid>
            <MidPageAd />


            <Grid columns={[1,1,2,2,2,2,3]} py={[4]} gridColumnGap={[2,2,3]}>
                {lists.slice(partitionQuantity, partitionQuantity*2).map( item => (
                    <CollectionCard ratio={0.4}
                        item={item} key={"rec" + item.id}  
                        link={`/list/${item.slug}/1`} 
                        text={item.seoShortDescription} />
                ))}
            </Grid>
            <ListBoardAd />

            <Grid columns={[1,1,2,2,2,2,3]} py={[4]} gridColumnGap={[2,2,3]}>
                {lists.slice(partitionQuantity*2, partitionQuantity*3).map( item => (
                    <CollectionCard ratio={0.4}
                        item={item} key={"rec" + item.id}  
                        link={`/list/${item.slug}/1`} 
                        text={item.seoShortDescription} />
                ))}
            </Grid>
    </CardContainer>
)

const Hero = () => (
    <CardContainer 
        width="100%"
        height="auto"
        display="flex" flexDirection="column"
        px={"5vw"} pt={[6]} pb={[3,3,4]}
        bg={"rgba(0,0,0,0.8)"}
    >
        <CoverBox bg={"rgba(0,0,0,0.4)"} zIndex={0} />

        <HeaderText  zIndex={1}
            fontWeight={[400]}
            fontSize={["24px", "24px", "28px", "32px", "38px", "44px"]}
            color="white"pt={[3]}
            textAlign="center" 
        
        >

            Curated and Collected
            Movie Lists
        </HeaderText>  
        <SubHeaderText zIndex={1}
            fontFamily={"playfair"} minWidth={"100%"}
            fontSize={["16px", "16px", "18px", "20px", "22px", "24px", "26px"]}
            color="white"  fontWeight={400} mt={[4,4,5]}
            textAlign="center" opacity={1}
        >
            "Right Place for people asking <strong><em>What Movie Should I Watch?</em></strong>"
        </SubHeaderText>
</CardContainer>
)

const CollectionCard = (props) => (
    <FlexBox flexDirection="column" mb={[2]} height={"auto"} mt={[2]}>
        <LazyLoadComponent>
            <SuperBox 
                display="flex" flexDirection="column" 
                src={props.item.coverPoster || props.item.poster} 
                ratio={props.ratio || 0.5625} borderRadius={"6px"}
                width={"100%"} boxShadow="card"
            >
                <CoverLink link={props.link} 
                    color="transparent" 
                    title={props.item.name + "\n" + props.item.summary.slice(0,200)}
                    follow={true}
                    >
                    {props.link}
                </CoverLink>
            </SuperBox>
        </LazyLoadComponent>
        <HeaderMini width={"75%"} 
            fontWeight="bold" 
            color="dark" hoverUnderline
            my={[2,2,3]} fontSize={["14px", "14px", "16px"]}
            >
            <NewLink link={props.link} follow={true} title={"See " + props.item.name}>
                {props.item.name}
            </NewLink>
        </HeaderMini>
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

