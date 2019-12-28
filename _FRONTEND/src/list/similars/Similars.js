import React  from "react";
import { useState, useContext, useMemo, useCallback, useEffect } from "react"
import { withRouter, Link, useParams, useLocation } from "react-router-dom";
import { useQuery } from '@apollo/react-hooks';


import { useWindowSize, useAuthCheck, useClientWidth, useClientHeight, useValues } from "../../functions/hooks"

import { rgaPageView, Head, MidPageAd, HomePageFeedAd,  FeedMobileCollectionAd,
    SIMILAR_FINDER, LIST_BOARD, MoviePageAd
} from "../../functions"

import { GlobalContext } from "../..";
import JoinBanner from "../../components/JoinBanner.js"

import {  PageContainer, ContentContainer, Grid, ListCoverBox, HiddenHeader, ImageCard,CollectionCard,
    Loading, HeaderText, Text, FlexBox, RegularInput, MovieAutoComplete, SuperBox, CoverLink, TagBox,
    NewLink, Image, SubHeaderText, LinkButton
} from "../../styled-components"



const SimilarFinder = (props) => {




    const { slug, page } = useParams();
    let location = useLocation();
    // This is autocomplete search result, not similars
    const [searchResult, setSearchResult ] = useState([])

    const searchdispatcher = (resultedMovies) => {
        if (searchResult.length === 0 || searchResult.length !== resultedMovies.length){
            setSearchResult(resultedMovies)
            const searchinput = document.getElementById("autoComplete")
            window.scrollTo(0, searchinput.offsetTop)

        }
    }

    const state = useContext(GlobalContext);
    const screenSize = useWindowSize()
    const heroImageHeight = useClientHeight("similar-finder-hero-image")
    
    const partitionQuantity = useValues([4,4,4,4,3])
    const isMobile = window.innerWidth < 480;
    const isSmallScreen = useMemo(() => !screenSize.includes("L"), [screenSize]) 
    const isMoviePage = (page !== undefined && slug !== undefined)

    /* Hero Image */
    const horizontalurl = "https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/similar-finder-page/black-silk.jpg"
    const verticalurl = "https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/similar-finder-page/black-silk-vertical.jpg"
    const responsiveurl = isSmallScreen ? verticalurl : horizontalurl

    //const firstPart = allLists.slice(0,partitionQuantity)
    //const secondPart = allLists.slice(partitionQuantity, partitionQuantity * 2)
    //const thirdPart = allLists.slice(partitionQuantity * 2, partitionQuantity * 3)
    //const fourthPart = allLists.slice(partitionQuantity * 3, partitionQuantity * 4)
    //const fifthPart = allLists.slice(partitionQuantity * 4, partitionQuantity * 5)

    const ResponsiveAd1 = isMobile ? FeedMobileCollectionAd : HomePageFeedAd
    const ResponsiveAd2 = isMobile ? FeedMobileCollectionAd : MidPageAd
    const ResponsiveAd3 = isMobile ? FeedMobileCollectionAd : MoviePageAd

    console.log("router",isMoviePage, location, slug, page)
    if (location.pathname !== "/similar-movie-finder" && searchResult.length > 0){
        //clean autocomplete items
        setSearchResult([])
    } 
    console.log(props)

    //console.log(otherLists)
    useEffect(() => window.scrollTo(0,0), [])
    const canonical = `https://pixly.app/${props.location.pathname}`
    //console.log("canonical", canonical, heroImageHeight)
    return (
        <PageContainer>
            <Head
                title={"Pixly - Similar Movie Finder. Find Movies Similar To Your Favourites."}
                description={"Pixly.App offers free similar movie finder service. Find similar movies " +
                            "to your favourite films. Discover movies that has similar topic and tags."}
                image={"https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/landing-page/main-page-collage.jpg"}

                canonical={canonical}
            />
                {/* HERO */}
                <FlexBox className="similar-finder-hero"
                    position="relative"
                    width="100%" height={"auto"}
                    display="flex" flexDirection="column" alignItems="center"
                    top={-75} px={[3,3,4]}
                >
                    <Image className="similar-finder-hero-image"
                        src={responsiveurl} 
                        width={"100vw"} height="auto" alt="similar movie finder" minHeight="250px"
                        position="absolute" top={0} left={0}
                    />
                    <HeaderText  
                        fontFamily={"playfair"} fontWeight="bold"
                        fontSize={["36px", "36px", "42px", "48px", "54px", "60px"]}
                        color="white" my={[3]} pt={[3]} mt={["150px", "150px", "125px"]}
                        textAlign="center" position="relative"
                    >
                        Similar Movie Finder
                    </HeaderText>  
                    <Text color="white" position="relative" my={[3,3,4]}>
                        Are you looking a good movies to watch and can't decide? Let search your favourite film 
                        and discover similar movies.
                    </Text>
                    {/* Search Input*/}
                    {isMoviePage 
                        ?<LinkButton px={[3,3,4]} m={[2]}
                            to={{pathname:"/similar-movie-finder" }} 
                            color="light" bg="dark" borderRadius="4px" 
                            height={"50px"} width={"60%"} maxWidth={"400px"} 
                            hoverScale hoverBg="#3633CC" boxShadow="card" zIndex={1}
                        >
                            Look For Another Movie
                        </LinkButton>
                        :<MovieAutoComplete dispatch={searchdispatcher} mt={[3,3,4]} position="relative" />
                        }
                </FlexBox>

                {isMoviePage &&
                        <SimilarFinderQuery />
                        }

                <ContentContainer display="flex" flexDirection="column" alignItems="center" justifyContent="flex-start">
                    {searchResult && searchResult.length>0 &&
                        <FlexBox flexDirection="column" alignItems="center" width="100%" justifyContent="flex-start" pb={[4]}>
                            {searchResult.map(movie => <MovieSearchCard item={movie} />)}
                        </FlexBox>}
         
                </ContentContainer>


            
        </PageContainer>

    );
};



const SimilarFinderQuery = props => {
    const { slug, page } = useParams();
	const { loading, error, data } = useQuery(SIMILAR_FINDER, {
        variables:{slug:slug, page:page},
		partialRefetch: true
    });


	if (loading) return <Loading />;
	console.log("main", data)
	if (error) return <div>{error.message}</div>;
	if (data) return (
        <FlexBox width={"100%"} flexDirection="columns">
            <MovieInfoCard item={data.film} />

        </FlexBox>
    );
    useEffect(() => {
        const banner = document.getElementById("similar-banner-movie")
        if (banner) window.scrollTo(0, banner.offsetTop)
    })
};

const MovieSearchCard = ({ item }) => (
	<FlexBox
		width="100%" maxWidth={"600px"}
		boxShadow="0 6px 8px -4px rgba(0,0,0, 0.4)"
        bg={"rgba(215,215,215, 0.9)"}
        maxHeight={["200px"]} alignItems="center"
        m={[3,3,3]}
        className="movie-search-card"
	>	
        <CoverLink 
            to={{
                pathname:`/similar-movie-finder/${item.slug}/1`,
                state:{movie:item}
                }} 
            title={item.name} 
            zIndex={0}
        />
        <NewLink link={`/movie/${item.slug}`} zIndex={1}>
            <Image 
                src={item.poster} 
                alt={item.name} title={"Visit " + item.name + ` - ${item.year} Page`} 
                height={["52px","52px","86px"]}
                width={["34px", "34px","56px"]}
            />
        </NewLink>
        <Text fontWeight="bold" ml={[2,2,3,4]}>{item.name} ({item.year})</Text>
	</FlexBox>
)
//When Movie selected from auto complete, this is the banner and identifier of which movies
const MovieInfoCard = ({ item, ...props }) => (
	<FlexBox
		width="100%" 
		boxShadow="0 6px 8px -4px rgba(0,0,0, 0.4)"
        bg={"rgba(215,215,215, 0.9)"}
        maxHeight={["200px"]} alignItems="center"
        p={[3,3,3]}
        className="movie-search-card"
        id="similar-banner-movie"
        {...props}
	>	

        <NewLink link={`/movie/${item.slug}`}>
            <Image 
                src={item.poster} 
                alt={item.name} title={"Visit " + item.name + ` - ${item.year} Page`} 
                height={["52px","52px","86px"]}
                width={["34px", "34px","56px"]}
            />
        </NewLink>
        <SubHeaderText fontWeight="bold" ml={[2,2,3,4]}>
            <NewLink link={`/movie/${item.slug}`} hoverUnderline>
                {item.name} ({item.year})
            </NewLink>
        </SubHeaderText>
	</FlexBox>
)


export default withRouter(SimilarFinder);
