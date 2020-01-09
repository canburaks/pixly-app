import React  from "react";
import { useState, useContext, useMemo, useCallback, useEffect } from "react"
import { withRouter, Link, useParams, useLocation } from "react-router-dom";
import { useQuery } from '@apollo/react-hooks';
import gql from "graphql-tag";


import { useWindowSize, useAuthCheck, useClientWidth, useClientHeight, useValues,
    
} from "../../functions/hooks"

import { rgaPageView, Head, MidPageAd, HomePageFeedAd,  FeedMobileCollectionAd,
    SIMILAR_FINDER, MOVIE, MoviePageAd,FeedMobileTopicPageAd
} from "../../functions"

import { GlobalContext } from "../..";
import JoinBanner from "../../components/JoinBanner.js"

import {  PageContainer, ContentContainer, Grid, ListCoverBox, HiddenHeader, ImageCard,CollectionCard,
    Loading, HeaderText, Text, FlexBox, RegularInput, MovieAutoComplete, SuperBox, CoverLink, TagBox,
    NewLink, Image, SubHeaderText, LinkButton, HeaderMini, Span, Box, Hr, HashLink,
    SimilarMovies
} from "../../styled-components"


const MOVIE_MINI = gql`
query movie($slug:String){
    movie (slug:$slug){slug, name, year, poster, summary, nongenreTags}
}
`;



const SimilarFinder = (props) => {
    const { slug } = useParams();
    const isMoviePage = slug !== undefined
    let location = useLocation();
    // This is autocomplete search result, not similars
    const [ searchResult, setSearchResult ] = useState([])
    const [ selectedMovie, setSelectedMovie ] = useState({})

    // If direct url access movie info requires
    const { loading, error, data } = useQuery(MOVIE_MINI, {variables:{slug:slug}, skip:!isMoviePage});
    if (data && data.movie.slug !== selectedMovie.slug) setSelectedMovie(data.movie)
    
    const searchdispatcher = (resultedMovies) => {
        if (searchResult.length === 0 || searchResult.length !== resultedMovies.length){
            const currentMovie = resultedMovies.filter(m => m.slug === slug)

            setSearchResult(resultedMovies)
            const searchinput = document.getElementById("autoComplete")
            window.scrollTo({left:0, top:searchinput.offsetTop - 20, behavior:"smooth"})

        }
    }

    const screenSize = useWindowSize()
    //const heroImageHeight = useClientHeight("similar-finder-hero-image")
    
    const partitionQuantity = useValues([4,4,4,4,3])
    const isSmallScreen = useMemo(() => !screenSize.includes("L"), [screenSize]) 
    const [ showInfoText, setInfoVisibility] = useState(true) 

    /* Hero Image */
    const horizontalurl = "https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/similar-finder-page/black-silk.jpg"
    const verticalurl = "https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/similar-finder-page/black-silk-vertical.jpg"
    const responsiveurl = isSmallScreen ? verticalurl : horizontalurl


    const ResponsiveAd1 = window.innerWidth ? FeedMobileCollectionAd : HomePageFeedAd

    //const firstPart = allLists.slice(0,partitionQuantity)
    //const secondPart = allLists.slice(partitionQuantity, partitionQuantity * 2)
    //const thirdPart = allLists.slice(partitionQuantity * 2, partitionQuantity * 3)
    //const fourthPart = allLists.slice(partitionQuantity * 3, partitionQuantity * 4)
    //const fifthPart = allLists.slice(partitionQuantity * 4, partitionQuantity * 5)



    //console.log("router",isMoviePage, location, slug, page)
    if (location.pathname !== "/similar-movie-finder" && searchResult.length > 0){
        //clean autocomplete items
        setSearchResult([])
    } 
    //console.log(props)

    ////console.log(otherLists)
    useEffect(() => window.scrollTo({top:0,left:0, behavior:"smooth"}), [])

    useEffect(() => {
        const banner = document.getElementById("similar-movie-finder-result-box")
        if (banner) window.scrollTo({left:0, top:banner.offsetTop, behavior:"smooth"})
        // clear info text except the first time
        if (slug!== undefined && showInfoText === true) setInfoVisibility(false)

    },[slug])
    const summaryChar = useValues([250, 300,400,500,600,700])
    const canonical = `https://pixly.app/${props.location.pathname}`
    return (
        <PageContainer top={-75} position="relative" >
            <Head
                title={"Pixly - Similar Movie Finder. Find Movies Similar To Your Favourites."}
                description={"Pixly.App offers free similar movie finder service. Find similar movies " +
                            "to your favourite films. Discover movies that are similar to your favourite films.."}
                image={"https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/landing-page/main-page-collage.jpg"}

                canonical={canonical}
            />
                {/* HERO */}
                <SuperBox className="similar-finder-hero unmatched-red"
                    position="relative"
                    width="100%" height={"auto"}
                    display="flex" flexDirection="column" alignItems="center"
                    px={[2,2,3]}
                    pb={!showInfoText ? [3,3,4] :[6,6,7]}
                >
                    {/*<Image className="similar-finder-hero-image"
                        src={responsiveurl} 
                        width={"100vw"} height="auto" alt="similar movie finder" minHeight="600px"
                        position="absolute" top={0} left={0}
                    />*/}
                    <HeaderText  
                        fontFamily={"playfair"} fontWeight="bold"
                        fontSize={["24px", "24px","30px", "36px", "42px", "48px", ]}
                        color="white" my={[2]} pt={[2]} mt={showInfoText ? [ "100px"] : ["100px"]}
                        textAlign="center" position="relative"
                    >
                        Similar Movie Finder
                    </HeaderText>  
                    <SubHeaderText  
                        fontFamily={"playfair"} fontWeight="bold"
                        fontSize={["18px", "18px","24px", "24px","30px", "36px"]}
                        color="white" 
                        textAlign="center" position="relative"
                    >
                        Discover <em>Movies Like</em> Your Favourites.
                    </SubHeaderText>  
                    {showInfoText && 
                        <Text color="white" position="relative" my={[3,3,4]} px={[3,3,4,4,5]}>
                            Discover <em>movies like</em> your favourites.
                            Are you looking good movies to watch and can't decide? Let search your favourite film 
                            and discover similar movies like it. Besides, "People also like" section may provide good movie recommendations. 
                            The movies of "People also like" section are selected with&nbsp;
                            <NewLink to="/blog/a-brief-introduction-to-collaborative-filtering" target="_blank" underline> 
                                collaborative filtering mechanism. 
                            </NewLink>
                        </Text>}
                    {!isMoviePage && showInfoText &&
                        <SubHeaderText 
                            fontWeight="bold" color="white" 
                            position="relative" 
                            mt={[4,4,5]} mb={[2,2,3]}  textAlign="center"
                            fontSize={["12px","12px","14px", "18px"]}
                        >
                            Search A Movie. Select It. Find Similar Movies You Like It.
                        </SubHeaderText>
                        }
                    {/* Search Input*/}
                    {isMoviePage 
                        ?<LinkButton px={[3,3,4]} m={[2]}
                            link={"/similar-movie-finder" }
                            color="light" bg="dark" borderRadius="4px" 
                            height={"50px"} width={"60%"} maxWidth={"400px"} 
                            hoverScale hoverBg="#3633CC" boxShadow="card" zIndex={1}
                        >
                            Look For Another Movie
                        </LinkButton>
                        :<MovieAutoComplete 
                            dispatch={searchdispatcher} 
                            position="relative" 
                            placeholder="Movies like .... " 

                            />
                        }
                </SuperBox>



                <ContentContainer 
                    display="flex" flexDirection="column" 
                    alignItems="center" justifyContent="flex-start" 
                    bg={"rgba(120,120,120, 0.7)"}
                    height="100%" minHeight={"0"}
                >
                    {searchResult && searchResult.length>0 &&
                        <FlexBox flexDirection="column" alignItems="center" width="auto" 
                            justifyContent="flex-start" display="relative" top={"-120px"} zIndex={1}
                            bg="rgba(255,255,255, 1)" boxShadow="0 6px 18px -8px rgba(0,0,0, 0.4)"
                            pb={[4]} pt={[2]} px={[3,3,4]} borderRadius={6}
                        >
                            <Text color="dark" textAlign="center" fontWeight="bold" underline>Choose Your Movie</Text>
                            {searchResult.map(movie => <MovieSearchCard item={movie} key={movie.slug} />)}
                        </FlexBox>}
         
                    {(isMoviePage && selectedMovie.slug) && 
                        <>
                        <MovieInfoCard item={selectedMovie} summaryChar={summaryChar}/>
                        <SimilarMovies  movie={selectedMovie} />
                        </>
                }

                </ContentContainer>


            
        </PageContainer>

    );
};



const MovieSearchCard = ({ item }) => (
	<FlexBox
		width="100%" maxWidth={"600px"}
		boxShadow="0 4px 8px -4px rgba(0,0,0, 0.1)"
        bg={"rgba(255,255,255, 0.9)"}
        maxHeight={["200px"]} alignItems="center"
        px={[3,3,3]} my={[2]} position="relative"
        className="movie-search-card"
	>	
        <Image 
            src={item.poster} 
            alt={item.name} title={"Visit " + item.name + ` - ${item.year} Page`} 
            height={["52px","52px","86px"]}
            width={["34px", "34px","56px"]}
        />
        <Text fontWeight="bold" ml={[2,2,3,4]}>{item.name} ({item.year})</Text>
        <HashLink 
            to={`/movie/${item.slug}#similar-movies`} 
            title={item.name} position="absolute" 
            top={0} left={0} right={0} bottom={0}
            zIndex={1}
        />
	</FlexBox>
)
//When Movie selected from auto complete, this is the banner and identifier of which movies
const MovieInfoCard = ({ item, summaryChar, ...props }) => (
	<FlexBox
		width="100%" 
		boxShadow="0 6px 8px -4px rgba(0,0,0, 0.4)"
        borderBottom="2px solid"
        borderColor="dark"
        alignItems="center"
        flexDirection="column"
        p={[2]} 
        id="similar-banner-movie"
        bg="rgba(235, 235, 235, 0.9)"
        {...props}
	>	
        <Box width="100%"  pt={[3,3,4]}>
            <HeaderMini fontSize={["18px","18px","24px", "28px", "32px"]}
                fontWeight="bold" 
                pb={[2,2,3]} 
                title={`Click for visit ${item.name} page.`}
                width="100%"
            >
                <NewLink link={`/movie/${item.slug}`} underline>
                    {item.name}
                </NewLink>
                ({item.year})
            </HeaderMini>
            <Hr bg="transparent" />

            <NewLink link={`/movie/${item.slug}`} >
                <Image style={{float:"left"}}
                    src={item.poster} 
                    alt={item.name} title={"Visit " + item.name + ` - ${item.year} Page`} 
                    height={[ "129px", "129px",  "172px", "258px"]}
                    width={[ "84px","84px","112px",  "168px" ]}
                    mr={[3]} mt={[3]}
                />
            </NewLink>
            <Text mt={[3]}
                fontSize={["12px", "12px", "16px", "18px"]} 
                lineHeight={["16px", "16px", "24px", "26px"]}
            >
                {item.summary.length > summaryChar 
                    ? item.summary.slice(0,summaryChar) + "..." 
                    : item.summary}
                <NewLink underline link={`/movie/${item.slug}`} ml={[2]}>Details</NewLink>
            </Text>

        </Box>

        <TagBox 
            tags={item.nongenreTags.slice(0,8)} 
            px={[1,1,2,4]} mt={[3]} 
            width={"100%"} 
            color="dark" 
            justifyContent="center"
        />

	</FlexBox>
)


export default withRouter(SimilarFinder);
