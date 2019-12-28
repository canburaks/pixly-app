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




    const { slug, page } = useParams();
    let location = useLocation();
    // This is autocomplete search result, not similars
    const [searchResult, setSearchResult ] = useState([])

    const searchdispatcher = (resultedMovies) => {
        if (searchResult.length === 0 || searchResult.length !== resultedMovies.length){
            setSearchResult(resultedMovies)
            const searchinput = document.getElementById("autoComplete")
            window.scrollTo({left:0, top:searchinput.offsetTop, behavior:"smooth"})

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
    useEffect(() => window.scrollTo({top:0,left:0, behavior:"smooth"}), [])
    const canonical = `https://pixly.app/${props.location.pathname}`
    //console.log("canonical", canonical, heroImageHeight)
    return (
        <PageContainer>
            <Head
                title={"Pixly - Similar Movie Finder. Find Movies Similar To Your Favourites."}
                description={"Pixly.App offers free similar movie finder service. Find similar movies " +
                            "to your favourite films. Discover movies that are similar to your favourite films.."}
                image={"https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/landing-page/main-page-collage.jpg"}

                canonical={canonical}
            />
                {/* HERO */}
                <FlexBox className="similar-finder-hero"
                    position="relative"
                    width="100%" height={isSmallScreen ? heroImageHeight : "auto"}
                    display="flex" flexDirection="column" alignItems="center"
                    top={-75} px={[3,3,4]}
                >
                    <Image className="similar-finder-hero-image"
                        src={responsiveurl} 
                        width={"100vw"} height="auto" alt="similar movie finder" minHeight="600px"
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
                        and discover similar movies. Besides, "People also like" section can provide good movie recommendations. 
                        The movies of "People also like" section are recommended by&nbsp;
                        <NewLink to="/blog/a-brief-introduction-to-collaborative-filtering" target="_blank" underline> 
                            collaborative filtering mechanism. 
                        </NewLink>
                    </Text>
                    <Text color="white" position="relative" my={[3,3,4]}>Let First Search A Movie. Select It. See Similar Films.</Text>
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
                        :<MovieAutoComplete 
                            dispatch={searchdispatcher} 
                            mt={[3,3,4]} 
                            position="relative" 
                            placeholder="Let search" 

                            />
                        }
                </FlexBox>

                {isMoviePage && <SimilarFinderQuery />}

                <ContentContainer display="flex" flexDirection="column" alignItems="center" justifyContent="flex-start">
                    {searchResult && searchResult.length>0 &&
                        <FlexBox flexDirection="column" alignItems="center" width="auto" 
                            justifyContent="flex-start" 
                            bg="rgba(255,255,255, 0.9)" boxShadow="0 6px 8px -4px rgba(0,0,0, 0.4)"
                            pb={[4]} px={[3,3,4]} borderRadius={6}
                        >
                            {searchResult.map(movie => <MovieSearchCard item={movie} key={movie.slug} />)}
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
        <FlexBox width={"100%"} flexDirection="column" bg={"rgba(215,215,215, 1)"}
        >
            <MovieInfoCard item={data.film} />
            {data.listOfContentSimilarMovies && 
                <MovieContentSimilarCardBox items={data.listOfContentSimilarMovies} />
                }
                {data.listOfSimilarMovies && 
                    <FlexBox flexDirection="column" px={[2]}>
                        <HeaderMini>People also like</HeaderMini>
                        <Text mt={[2]} fontSize={["14px", "16px", "18px"]}>
								People who like
								<Span fontWeight="bold" opacity={1}> {data.film.name} </Span>
								also like and give high ratings below movies. This
								can be a good indicator that if you like '
								{data.film.name}' probably you will also like them. Here the movies like {data.film.name} {data.film.year}.
						</Text>
                        <MovieRecommendationBox items={data.listOfSimilarMovies} />
                    </FlexBox>
                }


        </FlexBox>
    );
    useEffect(() => {
        const banner = document.getElementById("similar-banner-movie")
        if (banner) window.scrollTo({left:0, top:banner.offsetTop, behavior:"smooth"})
    })
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
		boxShadow="0 6px 8px -4px rgba(0,0,0, 0.4)"
        bg={"rgba(215,215,215, 0.9)"}
        maxHeight={["200px"]} alignItems="center"
        mx={[3,3,3]} my={[2]}
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
        borderBottom="2px solid"
        borderColor="dark"
        alignItems="center"
        p={[2]} 
        id="similar-banner-movie"
        {...props}
	>	
        <NewLink link={`/movie/${item.slug}`}>
            <Image 
                src={item.poster} 
                alt={item.name} title={"Visit " + item.name + ` - ${item.year} Page`} 
                height={[ "129px"]}
                width={[ "84px", ]}
            />
        </NewLink>
        <SubHeaderText fontWeight="bold" my={[2,2,3,4]} ml={3} title={`Click for visit ${item.name} page.`}
            fontSize={[ "24px", "24px","30px", "36px", "46px"]} textAlign="center"
        >
            <NewLink link={`/movie/${item.slug}`} hoverUnderline>
                The Similar Movies Like
                {item.name} ({item.year})
            </NewLink>
        </SubHeaderText>


	</FlexBox>
)

const ContentSimilarMovieCard = ({ item }) => (
	<SuperBox
		src={item.poster}
		width="100%"
		ratio={1.5}
		boxShadow="0 6px 8px 4px rgba(0,0,0, 0.4)"
        className="content-similar-movie-card"
	>	

		<CoverLink link={`/movie/${item.slug}`} title={item.name} zIndex={0} />
		<FlexBox 
			position="absolute" 
			bottom={0} left={0}
			width={"100%"} height={"auto"}
			flexDirection="column"  justifyContent="space-between"
			p={[2]} zIndex={1}
			bg={"rgba(0,0,0, 0.85)"} minHeight={"100px"}
		>
			<Text color="light" fontWeight="bold" zIndex={1}>
                <NewLink link={`/movie/${item.slug}`} hoverUnderline>{item.name} ({item.year})</NewLink>
            </Text>
			<TagBox tags={item.nongenreTags || []} num={4} color={"light"}/>
		</FlexBox>
		<CoverLink link={`/movie/${item.slug}`} />
	</SuperBox>
)

const MovieRecommendationCard = ({ item }) => (
	<SuperBox
		src={item.coverPoster || item.poster}
		width="100%"
		ratio={0.7}
		boxShadow="0 6px 8px 4px rgba(0,0,0, 0.4)"
	>	
        <CoverLink link={`/movie/${item.slug}`} title={item.name} zIndex={0}/>
		<FlexBox 
			position="absolute" 
			bottom={0} left={0}
			width={"100%"} height={"auto"}
			flexDirection="column" px={[2]} pt={[2]}
			bg={"rgba(0,0,0, 0.85)"} minHeight={"80px"} zIndex={1}
		>
			<Text color="light" fontWeight="bold">
                <NewLink link={`/movie/${item.slug}`} hoverUnderline>{item.name} ({item.year})</NewLink>
            </Text>
			<TagBox tags={item.nongenreTags || []} num={6} color={"light"}/>
		</FlexBox>

	</SuperBox>
)

export default withRouter(SimilarFinder);
