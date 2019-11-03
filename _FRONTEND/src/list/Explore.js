import React from "react";
import {
	useContext,
	useState,
	useReducer,
	useEffect,
	lazy,
	Suspense,
	useRef
} from "react";
import { MAIN_PAGE } from "../functions/query";
import { useQuery } from "@apollo/react-hooks";

import { rgaPageView, rgaStart, Head, MidPageAd } from "../functions/analytics";
import {
	useWindowSize,
	useAuthCheck,
	useClientWidth,
	useValues
} from "../functions/hooks";

import JoinBanner from "../components/JoinBanner.js";

import { GlideBox } from "../components2/Glide.js";
//import { motion, useViewportScroll } from "framer-motion"
import {
	MovieCoverBox,
	DirectorCard,
	MovieCoverCard,
	ImageCard,
	Grid,
	PageContainer,
	ContentContainer,
	Loading,
	SuperBox,
	HiddenText,
	HiddenHeader,
	HiddenSubHeader,
	HeaderText,
	HeaderMini,
	Text,
	NewLink,
	CoverLink,
	CoverCard
} from "../styled-components";

import "./Explore.css";

const ExplorePage = React.memo(props => {
	//rgaPageView()
	const { movies, lists, topics} = props.data
	//console.log("main-page props: ",props)
	const authStatus = useAuthCheck();

	//const listAndTopics = [...topics, ...lists]
	return (
		<PageContainer>
			<Head
				description={
					"Movie Collections: curated movie lists, director's film lists, cannes film festival awards, berlin film festival awards, venice film festival awards, arthouse films and movies, cyberpunk films and movies, based on true story films and movies, latest movies"
				}
				title={
					"Pixly - Discover Your Next Movie"
				}
				keywords={
					"discover movie, pixly movies, pixly home page, pixly cinema, pixly recommendation, movietowatch, movie suggestions, similar movies, similar movie, ai recommendation"
				}
				canonical={`https://pixly.app/explore`}
			>
				<meta name="twitter:card" content="app" />
				<meta name="twitter:site" content="@pixlymovie" />
				<meta
					name="twitter:description"
					content="Personal Movie Recommendation and Social Movie Discovering Platform"
				/>
				<meta name="twitter:app:name:iphone" content="Pixly" />
				<meta name="twitter:app:name:ipad" content="Pixly" />
				<meta name="twitter:app:name:googleplay" content="Pixly" />
				<meta property="og:type" content="business.business" />
				<meta property="og:url" content="https://pixly.app" />
				<meta
					property="og:image"
					content="https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/brand/pixly-hare-circle.png"
				/>
				<meta
					property="business:contact_data:street_address"
					content="."
				/>
				<meta
					property="business:contact_data:locality"
					content="Istanbul"
				/>
				<meta
					property="business:contact_data:region"
					content="Europe"
				/>
				<meta
					property="business:contact_data:postal_code"
					content="34430"
				/>
				<meta
					property="business:contact_data:country_name"
					content="Turkey"
				/>
			</Head>

			<ContentContainer alignItems="center" mb={"100px"} pt={"80px"}>
				<HiddenHeader>Pixly Movies</HiddenHeader>
				{/*<HeaderText textAlign="center">Welcome to Pixly</HeaderText>*/}

				<Grid columns={[1,1, 2, 2,2,3]} py={[4]}>
					{topics.map(topic => (
						<CoverCard 
							key={topic.slug}
							item={topic}
							notext
							link={"/topic/" + topic.slug}
						/>
					))}
				</Grid>

				<Grid columns={[1,1, 2, 2,2,2,3]} py={[4]}>
					{lists.map(list => (
						<CoverCard follow={true}
							key={list.slug}
							notext
							ratio={0.41}
							item={list}
							link={"/list/" + list.slug + "/1"}
						/>
					))}
				</Grid>


				{/*<FeatureBox />*/}
				<HeaderMini>Populars & Upcomings</HeaderMini>
				<MovieCoverBox items={movies} follow={true} columns={[1,2, 2, 3,3,3,3,4]} fontSize={["12px", "14px", "14px"]}  />


			</ContentContainer>

			{!authStatus && <JoinBanner />}
		</PageContainer>
	);
}, () => true)

const ExploreQuery = props => {
	const { loading, error, data } = useQuery(MAIN_PAGE, {
		partialRefetch: true
	});
	if (loading) return <Loading />;
	if (error) return <div>{error.message}</div>;
	if (data) return <ExplorePage data={data.mainPage} {...props} />;
};

const FeatureBox = () => (
	<Grid columns={[1, 1, 2, 2 ,2,]} width={"100%"} my={[3]} mb={[5,5,5,6]} maxWidth={"900px"}>
		<DirectorsFeature />
		<CollectionsFeature />
		<TopicsFeature />
		<SearchFeature />
	</Grid>
)

const CollectionsFeature = React.memo(() => (
	<SuperBox maxHeight={"255px"}
		src={"https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/figma/collections.jpg"}
		hoverShadow
		ratio={0.5625}
		borderRadius={"6px"}
		boxShadow="card"
	>
		<HiddenHeader>Collections</HiddenHeader>
		<HiddenSubHeader>
			Curated and Collected Best Movie Lists
		</HiddenSubHeader>
		<CoverLink link={"/collections"} text={"Visit Collections"} />
	</SuperBox>
));
const DirectorsFeature = React.memo(() => (
	<SuperBox maxHeight={"255px"}
		src={"https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/figma/directors.jpg"}
		hoverShadow
		ratio={0.5625}
		borderRadius={"6px"}
		boxShadow="card"
	>
		<HiddenHeader>Directors</HiddenHeader>
		<HiddenSubHeader>
			Famous Directors Favorite Film Lists and Directors Filmographies
		</HiddenSubHeader>
		<CoverLink link={"/directors/1"} text={"Visit Famous Directors"} />
	</SuperBox>
));
const SearchFeature = React.memo(() => (
	<SuperBox maxHeight={"255px"}
		src={"https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/figma/search.jpg"}
		hoverShadow
		ratio={0.5625}
		borderRadius={"6px"}
		boxShadow="card"
	>
		<HiddenHeader>Search</HiddenHeader>
		<HiddenSubHeader>
			Search Movies with IMDb Rating and Release Year.
		</HiddenSubHeader>
		<CoverLink
			link={"/advance-search"}
			text={
				"Visit Advance Movie Search Page and Search Movies by IMDb Rating"
			}
		/>
	</SuperBox>
));
const TopicsFeature = React.memo(() => (
	<SuperBox maxHeight={"255px"}
		src={"https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/figma/topics.jpg"}
		hoverShadow
		ratio={0.5625}
		borderRadius={"6px"}
		boxShadow="card"
	>
		<HiddenHeader>Topics</HiddenHeader>
		<HiddenSubHeader>
			Explore Movies by their specific subjects
		</HiddenSubHeader>
		<CoverLink
			link={"/topics"}
			text={"Visit Topic Page and Explore Movies with topics"}
		/>
	</SuperBox>
));


export default ExploreQuery;

/*
const MainPageQuery2 = (props) =>{
    const client = useApolloClient();

    const cachedata = client.readQuery({query:MAIN_PAGE})
    const [mainPage, { loading, error, data, refetch }] = useLazyQuery(MAIN_PAGE)

    const [ pageData, setPageData ] = useState(null)

    if (pageData){
        return  <MainPage data={pageData.mainPage} />
    }
    if (pageData === null){
        if (cachedata && cachedata.mainPage){
            console.log("cache data is setting")
            setPageData(cachedata)
        }
        else if (data && data.mainPage){
            console.log("lazy query data is setting")
            setPageData(data)
        }
        
        else if (!cachedata){
            console.log("no data: querying lazily")
            mainPage()
        }
    }
*/
