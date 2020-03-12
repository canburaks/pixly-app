import React, { useState, useRef,useEffect, useCallback, useMemo } from "react";
import { withRouter, useParams, useHistory } from "react-router-dom";
import { useQuery } from '@apollo/react-hooks';
import { TOPIC_SEARCH_QUERY } from "../../functions/query"


import { isEqualObj, Head, MidPageAd, HomePageFeedAd, 
    MoviePageAd, FeedMobileCollectionAd,
    TopicArticleAd, TopicOrderedListAd,
    TopicOrderedListAd2,useClientWidth,
    useValues, useWindowSize, useWindowWidth, FeedMobileTopicPageAd, useDebounce,
    BannerAd,
} from "../../functions"


import { 
    Box, FlexBox, Text,Input,SearchInput, Form,Loading, Button,
    ImdbIcon, WatchIcon, SearchIcon,SubHeaderText,Image,CoverImage,
    PageContainer, ContentContainer, InputRange, SearchButton, PaginationBox, 
    TextSection,SchemaArticle,MovieRichCardBox,MovieRichCard, Grid,VideoPlayer,
    //YearSlider,RatingSlider,
    HtmlBox, HtmlContainer, MessageBox, Hr, HomeIcon,FilmIcon,
    LargeTopicMovieCard, WhiteMovieCard, HeaderMini, TagBox, SuperBox, CoverLink, NewLink,
    Ul,Li,ImdbRatingIcon, AbsoluteBox,ImageBoxBg,YearClockIcon,RightIcon,
    BookmarkMutation, RatingMutation, LikeMutation, StarIcon,YoutubeIcon, Iframe
} from "../../styled-components"

import { useNetworkStatus } from 'react-adaptive-hooks/network';
import { LazyLoadImage, LazyLoadComponent } from 'react-lazy-load-image-component';

import { YearSlider, RatingSlider, TagSelect, SearchInputMaterial, SimpleDialog } from "../../styled-material"
import ModalVideo from 'react-modal-video'
import { YoutubePlayer } from "cbs-react-components";

import "./OrderedList.css"

const FilterPanel = ({ dispatcher, states }) => {
    const [yearData, setYearData ] = useState({minYear:1950, maxYear:2019})
    const [ratingData, setRatingData ] = useState({minRating:5.0, maxRating:9.9})
    
    // IF AUTOFILTER UNCOMMENT IT AND REMOVE BUTTON
    //const debouncedYears = useDebounce(yearData, 500);
    //const debouncedRatings = useDebounce(ratingData, 500);

    const yearDispatcher = useCallback((data) => setYearData(data), [yearData])
    const ratingDispatcher = useCallback((data) => setRatingData(data), [ratingData])

    const submitHandler = (e) => {
        e.preventDefault()
        const filterVariables = {...yearData, ...ratingData}
        if (!isEqualObj( states, filterVariables)){
            dispatcher(filterVariables);
        }
    }
    /*
    IN CASE OF AUTO FILTER UNCOMMENT
    useEffect(() =>{
        const filterVariables = {...debouncedYears, ...debouncedRatings}
        console.log("filter panel dispatcer", filterVariables)
        dispatcher(filterVariables)
    })
    */
    return (
        <Form flexWrap="wrap" onSubmit={submitHandler}>
            <FlexBox id="search-settings-box" className="topic-page"
                width={["100%", "100%", "100%"]}  
                minHeight={["80px", "80px", "80px", "100%"]}
                justifyContent="space-around"
                alignItems="center"
                flexWrap="wrap"
                px={[3]} mt={[3]}
                borderBottom="1px solid"
                borderTop="1px solid"
            >
            <FlexBox width={["100%"]} flexDirection={"column"}>
                <FlexBox width={["100%"]} flexDirection={["column", "column", "column", "row"]}>
                    <YearSlider dispatcher={yearDispatcher}  iconColor="black" />
                    <RatingSlider dispatcher={ratingDispatcher} />
                </FlexBox>

                <Button 
                    type="submit" 
                    display="flex" alignItems="center" justifyContent="center"
                    width="100%" height={"40px"}
                    fontWeight="bold" 
                    color="light" bg="#282828"
                    px={[4,4,5]} borderRadius={"8px"}
                    hoverBg="#181818" boxShadow="card" 
                >
                    <SearchIcon  stroke="white" strokeWidth="3" size={16} position="relative" bottom={0}/>Search
                </Button>
            </FlexBox>

            </FlexBox>
        </Form>
    )
}

const SpotifyPlaylist = React.memo(({ src }) => (
    <Iframe src={src}
        width={800} height={300}
        frameborder="0"
        allowtransparency="true" allow="encrypted-media"
        ml={[3]}
    />
),() => true)

const TopicQuery = ({ lazyvariables }) =>{
    const { slug, page=1 } = useParams();
    let history = useHistory();
    const node = useRef(null) // FOR PAGINATION: SCROLL TOP
    const screenSize = useWindowSize()

    const [ filterVariables, setFilterVariables ] = useState({minYear:1950, maxYear:2019, minRating:5.0, maxRating:9.9})

    const multiSlugCapture = (slug) =>{
        if (slug === "romantic-comedy-movies") return "romantic-comedy"
        else if (slug === "controversial-movies-about-bdsm") return "bdsm-movies"
        else return slug
    }
    

    const { loading, data, error } = useQuery(TOPIC_SEARCH_QUERY,{variables:{
        topicSlug:(multiSlugCapture(slug)),
        page,
        minRating:filterVariables.minRating, maxRating:filterVariables.maxRating,
        minYear:filterVariables.minYear, maxYear:filterVariables.maxYear
    },partialRefetch:true})

    // Filter Dispatcher
    const filterDispatcher = useCallback((data) => setFilterVariables(data), [filterVariables])

    // Pagination Handlers
    const nextPage = () => history.push(`/topic/${slug}/${parseInt(page) + 1}`)
    const dynamicSuffix = useMemo(() => parseInt(page)===2 ? "" : `/${parseInt(page) - 1}`,[page])
    const prevPage = () => history.push(`/topic/${slug}${dynamicSuffix}`)

    var contentContainerWidth;
    useEffect(()=>{
        console.log("ue")
        if (node){
            console.log("node",node.current)
        }
    },[node])

    //Network
    const { effectiveConnectionType } = useNetworkStatus();
    let speed = effectiveConnectionType ? effectiveConnectionType === "4g" ? "fast" : "slow" : "slow"


    if (error) return <div>{error.message}</div>
    if (!data && loading) return <Loading />
    if (data){
        //console.log(data.complexSearch)
        const topic = data.complexSearch.topic
        const isOrdered = topic.isOrdered

        const haveOrderedItems = data.complexSearch.topicItems && data.complexSearch.topicItems.length > 0
        const selector =  isOrdered //haveOrderedItems   // or other

        const items = selector ? data.complexSearch.topicItems : data.complexSearch.topicResult
        //const quantity = haveOrderedItems ? data.complexSearch.topicItems.length : data.complexSearch.quantity 
        const quantity = data.complexSearch.quantity 

        const hideContent2 = (topic.htmlContent2 && topic.htmlContent2.length > 1) && window.innerWidth < 500 && !topic.showHtmlContent2

        //console.log(topic, items, quantity, isOrdered, screenSize)
        //console.log(screenSize, screenSize.includes("XL"))
        //console.log("speed", speed)
        // Other variables
        const title = "See the details of the " + topic.shortName.toLowerCase() + " movie."        
        const Liste = selector ? OrderedList : UnorderedList

        const spotifylistwidth = screenSize.includes("L") ? 300 : (contentContainerWidth ? contentContainerWidth : window.innerWidth * 0.8)
        //console.log("size", screenSize)



        return (
            <PageContainer>
                <Head richdata={topic.richdata}
                    title={topic.seoTitle}
                    description={topic.seoDescription}
                    keywords={topic.keywords}
                    image={topic.coverPoster ? topic.coverPoster : topic.poster ? topic.poster : null}
                    canonical={`https://pixly.app/topic/${topic.slug}`}
                />
            
                {topic.heroPoster &&
                    <Image src={topic.heroPoster} 
                        width="100vw" height="auto" minHeight="100px" position="relative"
                        minHeight={160}
                        alt={topic.name} 
                        title={topic.name} 
                    />}
                <BannerAd />
                <ContentContainer minHeight={"150px"} maxWidth={"100%"} ref={node}
                    flexDirection="column" pb={[4,4]} alignItems="center" bg="transparent"
                >
                    {/* TOPIC MAIN TEXT & STRUCTURED ARTICLE DATA*/}
                    {true && <SchemaArticle 
                            headerSize={["24px", "26px", "28px", "32px"]}
                            textSize={["14px","16px", "16px", "18px"]}
                            mt={[3]} mb={[0]} py={[0]}
                            header={topic.name}
                            quote={topic.quotes.length > 0 && topic.quotes[0]}
                            description={topic.seoShortDescription}
                            summary={topic.summary}
                            content={topic.content}
                            image={topic.coverPoster}
                            createdAt={topic.createdAt}
                            updatedAt={topic.updatedAt}
                            wiki={topic.wiki}
                        >   
                        <HtmlContainer 
                            my={[3]} 
                            html={topic.htmlContent}     
                        />
                        {topic.showHtmlContent2 && (topic.htmlContent2 && topic.htmlContent2.length > 1) 
                            && <TopicArticleAd />
                            }
                        <FlexBox justifyContent={["flex-start", "flex-start"]} mt={[5]} flexWrap={["wrap", "wrap", "wrap", "nowrap"]}>
                            {!hideContent2 
                                ?   <HtmlContainer 
                                        mb={[3]} 
                                        html={topic.htmlContent2}     
                                    />
                                : <HtmlContainer my={[3]} html={topic.htmlContent3} />}
                            {topic.spotifyPlaylist && <SpotifyPlaylist src={topic.spotifyPlaylist} />}
                        </FlexBox>
                    </SchemaArticle>}
                    
                    {/* FILTER WITH YEAR AND RATING */}
                    {topic.searchable && <FilterPanel dispatcher={filterDispatcher} states={filterVariables} />}

                    <Hr />
                
                    {/* CONTENT */}
                    <Liste items={items} title={title} speed={speed} size={screenSize} />

                    {/* PAGINATION */}
                    <Box id="search-rresult-box"  ref={node}
                        borderColor="rgba(40,40,40, 0.3)"
                        minWidth={["100%", "100%", "100%", "100%", "100%"]} height={"auto"}
                        p={[1,2,3]} mb={[5]}
                    >
                    {quantity > 18 &&
                        <PaginationBox 
                            currentPage={page} 
                            totalPage={Math.ceil(quantity/18)} 
                            nextPage={nextPage} prevPage={prevPage} 
                        />}
                    {topic.references && 
                        <HtmlContainer 
                            my={[5]} 
                            fontSize={["14px","16px", "16px", "18px"]} 
                            html={topic.references}     
                        />}
                    </Box>
                </ContentContainer>
            </PageContainer>
        )
    }
    else return <div></div>
}

const OrderedCard = ({ item, specs, play}) => (
    <FlexBox width="90vw" flexDirection={["column", "column","column", "row"]}
        border={"0px"} borderRadius={6}
        boxShadow="card" bg="#f1f1f1"
        my={[3]} overflow="hidden"
        className="ordered-topic-card"
        alignItems="stretch"
        minHeight={"auto"}
    >

        {/* TOP CONTENT*/}
        <FlexBox width="100%" display={["flex", "flex", "flex", "none"]}>
            <CoverImage 
                src={item.coverPoster}
                title={"Visit " + item.movie.name}
                alt={`${item.movie.name} poster`} 
                ratio={specs.ratioTop}  
                link={`/movie/${item.movie.slug}`} 
                follow={true}
            />
            <FlexBox position="absolute" left={"20px"} top={"12px"} flexDirection="column" alignItems="center" width="auto">
                <BookmarkMutation id={item.movie.isBookmarked} active={item.movie.isBookmarked} size={specs.iconSize + 4} />
                <LikeMutation id={item.movie.isBookmarked} active={item.movie.isBookmarked} size={specs.iconSize} mt={[2]} />
            </FlexBox>

            <FlexBox position="absolute" left={"20px"} bottom={"4px"} justifyContent="space-between" alignItems="center">
                <RatingMutation item={item.movie} size={36} />
                {item.movie.videos.length > 0 &&
                    <TrailerIcon 
                        onClick={() => play(item.movie.videos)} 
                        right={"-12px"} bottom={0}
                        width={"40px"} height="40px"
                        zIndex={12} 
                        position="relative"
                        
                    />
                }
            </FlexBox>
        </FlexBox>
        

        {/* HTML CONTENT*/}
        <FlexBox 
            flexDirection="column"
            
            position="relative"
            width={["100%","100%","100%","40vwv","45vw"]}
            height="auto"
            minHeight={["30vw"]}
            px={[3,3,3,2,3,4]} pt={[3,3,3,3,3]} pb={[2]}
        >
        <FlexBox width="100%" position="relative" flexGrow={1} flexDirection="column"  pb={[3]}>
            <NewLink 
                link={`/movie/${item.movie.slug}`} 
                title={`See ${item.movie.name} (${item.movie.year}) plot, cast, trailer, similar films and movie recommendations.`}
                hoverUnderline follow
                pb={[3,3,3,2,2]}
                > 
                <HeaderMini textAlign="left" fontWeight="bold" height="100%"
                    fontSize={specs.headerSize}
                    
                >
                    {item.header || `${item.movie.name} (${item.movie.year})`}
                </HeaderMini>
            </NewLink>
            {item.htmlContent 
                ? <HtmlContainer 
                    html={item.htmlContent} 
                    style={{
                        p:{fontSize:specs.textSize},
                        a:{fontSize:specs.textSize},
                    }} 
                />
                : <Text mt={[2]} fontSize={specs.textSize}>
                        {item.movie.summary.length > 450 
                                ? item.movie.summary.slice(0,450) + "..." 
                                : item.movie.summary
                            }
                    </Text>
            }
            </FlexBox>

            {/* HOME BUTTON*/}
            <Box display="flex" position="relative" 
                left={0} bottom={0} 
                height={"auto"} width="100%"
                mt="4px" pb={"2px"} pt="4px" borderTop="1px solid" borderColor="rgba(0,0,0,0.25)"
                justifyContent="space-between" alignItems="flex-end"
            >
                {false && <NewLink link={`/movie/${item.movie.slug}`} 
                    follow title={`Visit ${item.movie.name} (${item.movie.year})'`} 
                >
                    <Box display="flex" 
                        alignItems="center" hoverColor="#3437c7" 
                        justifyContent="center" fontWeight="bold" 
                        opacity={0.8}
                    >
                        More <RightIcon size={"20px"} />
                    </Box>
                </NewLink>}

                <Box display="flex" title={`${item.movie.name} released in ${item.movie.year} and have ${item.movie.imdbRating} IMDb rating.`}>
                    <YearClockIcon year={item.movie.year} color="dark" fill="#181818" opacity={0.8}  noShadow size={specs.iconSize -4} />
                    {item.movie.imdbRating && 
                        <ImdbRatingIcon 
                            rating={item.movie.imdbRating} color="dark" noShadow 
                             
                        />}
                </Box>
            </Box>
        </FlexBox>

        {/* RIGHT SECTION*/}
        <FlexBox  display={["none", "none", "none", "flex"]}
            flexDirection="column" alignItems="center" 
            width={["40vw","40vw","40vw","50vw","45vw"]}  
            height={["30vw","30vw","30vw",`auto`]}
            boxShadow="4px 4px 12px 4px rgba(0,0,0,0.4)"
            >   

            <SuperBox flexGrow={1} height="auto" minWidth="100%" className="img-supbox"
                src={item.coverPoster}
                alt={`${item.movie.name} poster`} 
                ratio={0.6}  zIndex={0}
            >
                {item.movie.videos.length > 0 &&
                    <TrailerIcon 
                        onClick={() => play(item.movie.videos)} 
                        zIndex={12} 
                        position="relative"
                        left={0} top={0}
                        width={"60px"} height="50px" overflow="hidden"
                        mr={[2,2,3]}

                    />
                }
                <CoverLink link={`/movie/${item.movie.slug}`}  title={item.movie.name}  zIndex={2} follow={true}/>
            </SuperBox>

            {/* NAME PANEL*/}
            {false && <FlexBox width={"100%"} height={"60px"}
                position="relaive"  bg="dark" flexDirection="column" 
                pl={"8px"}
                borderBottom="1px solid" borderColor="rgba(255,255,255,0.3)"
            >   
                <NewLink link={`/movie/${item.movie.slug}`} follow={true}
                    title={`See the details of ${item.movie.name} (${item.movie.year}).`}                        
                >
                    <Text color="light" hoverUnderline fontWeight="bold" fontSize="13px">{item.movie.name} ({item.movie.year})</Text>
                </NewLink>

            {/* ACTOR PANEL*/}
                {false && <FlexBox alignItems="center">
                    {item.persons.map(star => (
                        <NewLink link={`/person/${star.slug}`} key={star.id} follow={true}>
                            <Text color="#f1f1f1" fontSize="12px" mr={"16px"} opacity={0.8} hoverUnderline>{star.name}</Text>
                        </NewLink>
                    ))}
                </FlexBox>}

            </FlexBox>}
            {/* MUTATION PANEL */}
            <FlexBox width={"100%"} height={"50px"} position="relaive" bg="dark" alignItems="center">
                    <BookmarkMutation id={item.movie.id} 
                        active={item.movie.isBookmarked} 
                        size={specs.iconSize } mx={[2]} 
                    />
                    <LikeMutation id={item.movie.id} 
                        active={item.movie.isBookmarked} 
                        size={specs.iconSize - 2} 
                    />
                    <Box display="flex" flexGrow={1}
                        width="100%" height="100%"
                        justifyContent="center" alignItems="center"
                    >
                        <RatingMutation item={item.movie} size={36} />
                    </Box>
                </FlexBox>
        </FlexBox>

    </FlexBox>
)


    

const OrderedList = ({ items, speed, size}) => {
    //const ordereditems = items.sort((a,b) => (a.rank || a.movie.year) - (b.rank || b.movie.year))
    
    //Trailer
    const [isOpen, setOpen] = useState(false)
    const [videos, setVideos] = useState(null)
    const closeHandler = () => setOpen(false)
    const playHandler = (videos) => (setVideos(videos), setOpen(true))

    const movies = items.filter(i => i.rank !== 100).sort((a,b) => (a.rank - b.rank))
    const nonranked = items.filter(i => i.rank === 100).sort((a,b) => (b.movie.imdbRating -a.movie.imdbRating))
    const ordereditems = [...movies, ...nonranked]

    //Responsive Height
    const rightTextPanelHeight = 60
    const rightMutatinPanelHeight = 50
    //const rightBottomPanelHeight = rightMutatinPanelHeight + rightTextPanelHeight // mutation + name
    //const onewidth = useMemo(() => window.innerWidth / 100, [size])
    //const setTotalHeight = useCallback((imagevw) => imagevw + (rightBottomPanelHeight / onewidth),[size])

    //console.log("screen",items)

    const specs = {
        isLargeScreen:size.includes("L"),
        flexDirection:size.includes("L") ? "row" : "column",
        show:size.includes("L") ? "right" : "top",
        iconSize:size.includes("S") ? 26 :32,
        headerSize:size.includes("S") ? ["18px"] : ["16px","16px","16px","16px","20px", "20px"],
        textSize:size.includes("S") ? ["14px"]   : ["14px"],
        htmlContentWidth: ["100%","100%","100%","40vwvw","50vw"],
        
        rightPosterWidth  :["40vw","40vw","40vw","40vw","45vw"],
        rightPosterHeight :["24vw","24vw","24vw","24vw","28vw"],
        //htmlContentHeight :["30vw","30vw","30vw",`${setTotalHeight(24)}vw`, `${setTotalHeight(28)}vw`],
        htmlContentHeight :["30vw","30vw","30vw",`auto`],

        //---------------TOP-------------------
        // Screen size is the most determinant
        // Only use poster in extra-small size and slow internet
        typeTop: (speed==="slow" && size==="XS") ? "poster": "cover",
        ratioTop:(speed==="slow" && size==="XS") ? 1.5 : 0.6,
        //----------------RIGHT-----------------
        // Only use poster in medium size and slow internet
        typeRight: (speed==="slow" && size==="M") ? "poster": "cover",
        ratioRight:(speed==="slow" && size.includes("S")) ? 1.5 : 0.6,
        rightTextPanelHeight,
        rightMutatinPanelHeight
        //------------------------------------
    }
    //console.log("ordered", items)
    return (
        <>
            {ordereditems.slice(0,4).map( item => (
                    <OrderedCard key={"rec" + item.movie.id}
                        item={item}
                        specs={specs}
                        play={playHandler}
                    />
            ))}
            <TopicOrderedListAd />
            {ordereditems.slice(4, 8).map( item => (
                    <OrderedCard key={"rec" + item.movie.id}
                        item={item}
                        specs={specs}
                        play={playHandler}
                    />
            ))}

            <MidPageAd />
            {ordereditems.slice(8, 12).map( item => (
                    <OrderedCard key={"rec" + item.movie.id}
                        item={item}
                        specs={specs}
                        play={playHandler}
                    />
            ))}

            <HomePageFeedAd />
            {ordereditems.slice(12, 16).map( item => (
                    <OrderedCard key={"rec" + item.movie.id}
                        item={item}
                        specs={specs}
                        play={playHandler}
                    />
            ))}

            <TopicOrderedListAd2 />
                {ordereditems.slice(16, 20).map( item => (
                        <OrderedCard key={"rec" + item.movie.id}
                            item={item}
                            specs={specs}
                            play={playHandler}
                        />
                ))}


            <FeedMobileTopicPageAd />
                {ordereditems.slice(20).map( item => (
                        <OrderedCard key={"rec" + item.movie.id}
                            item={item}
                            specs={specs}
                            play={playHandler}
                        />
                ))}

            <SimpleDialog
                onClose={closeHandler}
                isOpen={isOpen}
            >
                <FlexBox minWidth="90vw" minHeight={["auto", "auto", "70vh"]} maxWidth="100%" overflowX="hidden">
                    <YoutubePlayer
                        videos={videos}
                    />
                </FlexBox>
            </SimpleDialog>
        </>
    )
}


const UnorderedList = ({items, speed, title }) => {
    const ratio = useMemo(() => speed==="fast" ? 0.7 : 1.5, [speed])
    const columns = useMemo(() => speed==="fast" ? [1,1,1,2,2,2,3] : [1,1,2,2,3,3,4], [speed])
    //console.log("unordered", speed)
    return(
        <>
        <HomePageFeedAd />
        <Grid columns={columns} py={[1]} gridColumnGap={[2,2,2,3]} width="100%" height="auto" >
            {items.slice(0,6).map( item => (
                    <UnorderedCard key={"rec" + item.id}
                        item={item}  title={title}
                        ratio={ratio}
                    />
            ))}
        </Grid>

        <MoviePageAd />
        <Grid columns={columns} py={[1]} gridColumnGap={[2,2,2,3]} width="100%" height="auto" >
            {items.slice(6, 12).map( item => (
                    <UnorderedCard key={"rec" + item.id}
                        item={item}  title={title}
                        ratio={ratio}
                    />
            ))}
        </Grid>

        <MidPageAd />
        <LazyLoadComponent>
        <Grid columns={columns} py={[1]} gridColumnGap={[2,2,2,3]} width="100%" height="auto" >
            {items.slice(12, 18).map( item => (
                    <UnorderedCard key={"rec" + item.id}
                        item={item}  title={title}
                        ratio={ratio}
                    />
            ))}
        </Grid>
        </LazyLoadComponent>
        <LazyLoadComponent>
        <Grid columns={columns} py={[1]} gridColumnGap={[2,2,2,3]} width="100%" height="auto" >
            {items.slice(18).map( item => (
                    <UnorderedCard key={"rec" + item.id}
                        item={item}  title={title}
                        ratio={ratio}
                    />
            ))}
        </Grid>
        </LazyLoadComponent>
    </>
    )
}

const UnorderedCard = ({ item, ratio, title=null }) => (
        <FlexBox
            width="100%"
            maxWidth={"600px"}
            position="relative"
            boxShadow="0 6px 8px 4px rgba(0,0,0, 0.4)"
            overflow="hidden" 
            borderRadius={6}
        >	
            <CoverImage 
                src={ratio < 1 ? (item.coverPoster ? item.coverPoster : item.poster) : item.poster}
                title={"Visit " + item.name}
                alt={`${item.name} poster`} 
                ratio={ratio}   follow={true}
                link={`/movie/${item.slug}`} 
            />
            <AbsoluteBox top={"20px"} right={"20px"}>
                <ImdbRatingIcon rating={item.imdbRating} />
            </AbsoluteBox>
            <AbsoluteBox top={"20px"} left={"20px"}>
                <BookmarkMutation active={item.isBookmarked} id={item.id}/>
            </AbsoluteBox>
    
            <FlexBox 
                flexDirection="column" justifyContent="space-between"
                px={[2]} pt={[2]} pb={[1]}
                minHeight={"80px"} 
                maxHeight={["50%", "50%", "50%", "50%","50%"]}
                width={"100%"} 
                position="absolute" 
                bottom={0} left={0}
                bg={"rgba(0,0,0, 0.85)"} zIndex={1}
            >
                <HeaderMini fontSize={["14px","14px","14px", "16px"]} 
                    color="light"  
                    pb={[1]}
                >
                    <NewLink 
                        link={`/movie/${item.slug}`} 
                        hoverUnderline 
                        follow={true}
                        title={title ? `${item.name} (${item.year}): ${title} ` : `${item.name} (${item.year})`}
                    >
                        {item.name.trim()}
                    </NewLink>
                    &nbsp;({item.year})
                </HeaderMini>
                <Text fontSize={["12px","12px","14px", "14px"]} 
                    color="rgba(255,255,255, 0.75)" 
                    lineHeight={["14px","14px","16px", "16px"]}
                    maxHeight={"60px"} pb={[1]}
                >
                    {item.summary.length > 120 ? item.summary.slice(0,115) + ".." : item.summary}
                </Text>
                <TagBox tags={item.tags || []}
                    num={6} 
                    color={"rgba(255,255,255, 0.75)"} 
                    fontSize={["10px", "10px", "10px", "10px"]} 
                    flexWrap="nowrap" overflow="hidden"    
                />
            </FlexBox>
        </FlexBox>
)



const TrailerIcon = ({onClick, ...props}) => (
	<FlexBox 
		display="flex"
		to={`#movie-page-video-header`}
		title={"See Video Section"}
		position="absolute"
        alignItems="center"
        justifyContent="center"
		left={"45%"}
		width={"10%"}
		top={"45%"}
		height={"45%"}
        onClick={onClick}
        {...props}
	>
		<YoutubeIcon size={[50,50,50, 35]} hoverScale />
	</FlexBox>
)
export default withRouter(TopicQuery);
