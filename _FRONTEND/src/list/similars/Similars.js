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
    NewLink, Image, SubHeaderText, LinkButton, HeaderMini, Span
} from "../../styled-components"



const SimilarFinder = (props) => {
    const { slug } = useParams();
    let location = useLocation();
    // This is autocomplete search result, not similars
    const [searchResult, setSearchResult ] = useState([])

    const searchdispatcher = (resultedMovies) => {
        if (searchResult.length === 0 || searchResult.length !== resultedMovies.length){
            setSearchResult(resultedMovies)
            const searchinput = document.getElementById("autoComplete")
            window.scrollTo({left:0, top:searchinput.offsetTop - 20, behavior:"smooth"})

        }
    }

    const state = useContext(GlobalContext);
    const screenSize = useWindowSize()
    const heroImageHeight = useClientHeight("similar-finder-hero-image")
    
    const partitionQuantity = useValues([4,4,4,4,3])
    const isSmallScreen = useMemo(() => !screenSize.includes("L"), [screenSize]) 
    const isMoviePage = slug !== undefined

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
    },[slug])

    const canonical = `https://pixly.app/${props.location.pathname}`
    ////console.log("canonical", canonical, heroImageHeight)
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
                <SuperBox className="similar-finder-hero"
                    position="relative"
                    width="100%" height={"auto"}
                    display="flex" flexDirection="column" alignItems="center"
                    px={[4,4,5]}
                    src={responsiveurl} pb={[4,4,5]}
                >
                    <Image className="similar-finder-hero-image"
                        src={responsiveurl} 
                        width={"100vw"} height="auto" alt="similar movie finder" minHeight="600px"
                        position="absolute" top={0} left={0}
                    />
                    <HeaderText  
                        fontFamily={"playfair"} fontWeight="bold"
                        fontSize={["36px", "36px", "42px", "48px", "54px", "60px"]}
                        color="white" my={[2]} pt={[2]} mt={["150px", "150px", "125px"]}
                        textAlign="center" position="relative"
                    >
                        Similar Movie Finder
                    </HeaderText>  
                    <Text color="white" position="relative" my={[3,3,4]} px={[3,3,4,4,5]}>
                        Are you looking good movies to watch and can't decide? Let search your favourite film 
                        and discover similar movies like it. Besides, "People also like" section may provide good movie recommendations. 
                        The movies of "People also like" section are selected with&nbsp;
                        <NewLink to="/blog/a-brief-introduction-to-collaborative-filtering" target="_blank" underline> 
                            collaborative filtering mechanism. 
                        </NewLink>
                    </Text>
                    {!isMoviePage && 
                        <SubHeaderText 
                            fontWeight="bold" color="white" 
                            position="relative" 
                            mt={[3,3,4]} mb={[2,2,3]}  textAlign="center"
                            fontSize={["18px","18px","24px", "28px", "32px"]}
                        >
                            Search A Movie. Select It. See Similar Movies Like It.
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
                            placeholder="E.g. Matrix " 

                            />
                        }
                </SuperBox>

                {isMoviePage && <SimilarFinderQuery />}

                <ContentContainer 
                    display="flex" flexDirection="column" 
                    alignItems="center" justifyContent="flex-start" 
                    bg={"rgba(120,120,120, 0.7)"}
                    height="100%"
                >
                    {searchResult && searchResult.length>0 &&
                        <FlexBox flexDirection="column" alignItems="center" width="auto" 
                            justifyContent="flex-start" display="relative" top={-50} zIndex={1}
                            bg="rgba(255,255,255, 1)" boxShadow="0 6px 18px -8px rgba(0,0,0, 0.4)"
                            pb={[4]} pt={[2]} px={[3,3,4]} borderRadius={6}
                        >
                            <Text color="dark" textAlign="center" fontWeight="bold" underline>Choose Your Movie</Text>
                            {searchResult.map(movie => <MovieSearchCard item={movie} key={movie.slug} />)}
                        </FlexBox>}
         
                </ContentContainer>


            
        </PageContainer>

    );
};



const SimilarFinderQuery = props => {
    const { slug, page=1 } = useParams();
	const { loading, error, data } = useQuery(SIMILAR_FINDER, {
        variables:{slug:slug, page:page},
		partialRefetch: true
    });
    const summaryChar = useValues([150, 200,300,350,400, 600])

    const ResponsiveAd2 = window.innerWidth ? FeedMobileCollectionAd : MidPageAd
    const ResponsiveAd3 = window.innerWidth ? FeedMobileCollectionAd : MoviePageAd



	if (loading) return <Loading />;
	//console.log("main", data)
	if (error) return <div>{error.message}</div>;
	if (data) return (
        <FlexBox 
            width={"100%"} px={[2,2,3]}
            flexDirection="column" id="similar-movie-finder-result-box"
            bg={"rgba(255,255,255, 1)"}
        >
            <MovieInfoCard item={data.film} summaryChar={summaryChar}/>
            {data.listOfContentSimilarMovies && 
                <>
                    <ResponsiveAd2 />
                    <MovieContentSimilarCardBox items={data.listOfContentSimilarMovies.slice(0,12)} />

                </>
                }
                {data.listOfSimilarMovies && data.listOfSimilarMovies.length > 0 && 
                    <FlexBox flexDirection="column" px={[2]}>
                        <ResponsiveAd3 />
                        <HeaderMini>People also like</HeaderMini>
                        <Text mt={[2]} fontSize={["14px", "16px", "18px"]}>
								People who like
								<Span fontWeight="bold" opacity={1}> {data.film.name} </Span>
								also like and give high ratings below movies. If you like 
                                '{data.film.name}' the chance of you will like below movies are highly probable.
                                Here the movies like {data.film.name} {data.film.year}.
						</Text>
                        <MovieRecommendationBox items={data.listOfSimilarMovies} />
                    </FlexBox>
                }


        </FlexBox>
    );

};
const MovieRecommendationBox = (props) => (
    <Grid columns={[1,1,1,2,2,2,2,3,4]} py={[4]}>
        {props.items.map( item => (
            <MovieRecommendationCard item={item} key={"rec" + item.slug}/>
        ))}
    </Grid>
)

const MovieContentSimilarCardBox = React.memo(({ items, columns=[2,2,3,3,3,4,6], ...props }) => (
    <Grid columns={columns} py={[4]} px={[2]}>
        {items.map( item => <ContentSimilarMovieCard item={item} key={item.slug + "cs"} />)}
    </Grid>
), (p,n) => (p.key ? (p.key === n.key) : (p.items.length === n.items.length)))

const MovieSearchCard = ({ item }) => (
	<FlexBox
		width="100%" maxWidth={"600px"}
		boxShadow="0 4px 8px -4px rgba(0,0,0, 0.1)"
        bg={"rgba(255,255,255, 0.9)"}
        maxHeight={["200px"]} alignItems="center"
        px={[3,3,3]} my={[2]}
        className="movie-search-card"
	>	
        <CoverLink 
            to={{
                pathname:`/similar-movie-finder/${item.slug}`,
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
        <FlexBox width="100%"  pt={[3,3,4]}>
            <NewLink link={`/movie/${item.slug}`}>
                <Image 
                    src={item.poster} 
                    alt={item.name} title={"Visit " + item.name + ` - ${item.year} Page`} 
                    height={[ "129px", "129px",  "172px", "258px"]}
                    width={[ "84px","84px","112px",  "168px" ]}
                />
            </NewLink>
            <FlexBox flexDirection="column" px={[3,3,4]}>
                <SubHeaderText 
                    fontWeight="bold" 
                    mb={[2,2,3]}
                    title={`Click for visit ${item.name} page.`}
                    textAlign="center" width="100%"
                >
                    <NewLink link={`/movie/${item.slug}`} underline>
                        The Similar Movies Like&nbsp;{item.name} ({item.year})
                    </NewLink>
                </SubHeaderText>
                <Text fontSize={["12px", "12px", "16px", "18px"]} lineHeight={["16px", "16px", "24px", "26px"]}>{item.summary.length > summaryChar ? item.summary.slice(0,summaryChar) + "..." : item.summary}</Text>
            </FlexBox>
        </FlexBox>

        <TagBox 
            tags={item.nongenreTags.slice(0,8)} 
            px={[2,2,4]} mt={[3]} 
            width={"100%"} 
            color="dark" 
            justifyContent="center"
        />

	</FlexBox>
)

const ContentSimilarMovieCard = ({ item }) => (
	<SuperBox
		src={item.poster}
		width="100%"
		ratio={1.5}
		boxShadow="0 6px 8px 4px rgba(0,0,0, 0.4)"
        className="content-similar-movie-card"
        title={"Visit " + item.name + ` - ${item.year} Page`} 
	>	

		<CoverLink link={`/movie/${item.slug}`} title={item.name} zIndex={0} />
		<FlexBox 
			position="absolute" 
			bottom={0} left={0}
			width={"100%"} height={"auto"}
			flexDirection="column"  justifyContent="space-between"
			p={[2]} zIndex={1}
			bg={"rgba(0,0,0, 0.85)"} minHeight={"100px"}
            className="content-similar-movie-card-info"
		>
			<Text color="light" fontWeight="bold" zIndex={1} mb={[2]}>
                <NewLink link={`/movie/${item.slug}`} hoverUnderline>{item.name} ({item.year})</NewLink>
            </Text>
			<TagBox tags={item.nongenreTags || []} num={4} color={"light"}/>
		</FlexBox>
	</SuperBox>
)

const MovieRecommendationCard = ({ item }) => (
	<SuperBox
		src={item.coverPoster || item.poster}
		width="100%"
		ratio={0.7}
		boxShadow="0 6px 8px 4px rgba(0,0,0, 0.4)"
        className="recommendation-similar-movie-card"
	>	
        <CoverLink link={`/movie/${item.slug}`} title={item.name} zIndex={0}/>
		<FlexBox 
			position="absolute" 
			bottom={0} left={0}
			width={"100%"} height={"auto"}
			flexDirection="column" px={[2]} py={[2]}
            className="recommendation-similar-movie-card-info"
			bg={"rgba(0,0,0, 0.85)"} minHeight={"80px"} zIndex={1}
		>
			<Text color="light" fontWeight="bold" mb={[2]}>
                <NewLink link={`/movie/${item.slug}`} hoverUnderline>{item.name} ({item.year})</NewLink>
            </Text>
			<TagBox tags={item.nongenreTags || []} num={6} color={"light"}/>
		</FlexBox>

	</SuperBox>
)

export default withRouter(SimilarFinder);
