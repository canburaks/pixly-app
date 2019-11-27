import React from "react";
import { Text, Paragraph, HeaderMini,
        Image, ImageShim, //AspectRatioImage, 
        Box, FlexBox, SuperBox, TagBox,
        TextSection, Card, ImageCard, AspectRatioCard, MosaicCard,DarkCard,
        NewLink, Input, LinkButton,CoverLink, ImdbRatingIcon, YearClockIcon, 
        BookmarkMutation, RatingMutation, Hr
} from "../index"


export const CollectionCard = (props) => (
    <FlexBox flexDirection="column" mb={[5]} height={"100%"}>
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
                {props.item.name}
            </NewLink>
        </HeaderMini>
        <Text  
            color="dark"
            textAlign="justify"
        >
            {props.text.slice(0,200)}
        </Text>
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

export const WhiteMovieCard = ({ item }) => (
<FlexBox flexDirection="column" mb={[5]} height={"100%"}>
    <SuperBox 
        display="flex" flexDirection="column" 
        src={item.coverPoster || item.poster} 
        ratio={0.5625} borderRadius={"8px"}
        width={"100%"}
    >
        <FlexBox flexDirection="column" 
            position="absolute"
            bottom={0} left={0}
            width="100%" height="auto" 
            p={[2]} 
            bg={"rgba(0,0,0, 0.7)"}
        >
            <FlexBox width={"100%"}  justifyContent="flex-end">
                {item.imdbRating && 
                    <ImdbRatingIcon 
                        rating={item.imdbRating} 
                        size={"22px"} 
                        fill="#fac539"
                    />}
                {item.year && 
                    <YearClockIcon fill="#f1f1f1"
                        year={item.year} 
                        size={"22px"} 
                        ml={[2,2,2,2,3]}
                    />}
                <BookmarkMutation id={item.id} active={item.isBookmarked} size={"28px"} ml={[2]} mb={"4px"}/>
            </FlexBox>
        </FlexBox>
    </SuperBox>
        <HeaderMini width={"75%"} fontFamily={"playfair"} color="dark" hoverUnderline
            my={[2,2,3]}
            >
            <NewLink link={`/movie/${item.slug}`}>
                {item.name}
            </NewLink>
        </HeaderMini>
    <Text  color="dark">{item.summary.length > 300 ? `${item.summary.slice(0,300)} ...` : item.summary.slice(0,300)}</Text>
    <TagBox tags={item.tags || []} num={6} color={"dark"} />
    <Box position="absolute" bottom={"20px"} width={"100%"}>
        <NewLink link={`/movie/${item.slug}`}  
            fontWeight="bold" color="dark" 
            hoverUnderline            
        >
            See more
        </NewLink>
        <hr />
    </Box>

</FlexBox>
)

export const LargeTopicMovieCard = ({ item }) => (
    <SuperBox 
        display="flex" flexDirection="column" 
        src={item.coverPoster || item.poster} 
        ratio={0.5625} borderRadius={"8px"}
    >
        <FlexBox flexDirection="column" 
            position="absolute"
            bottom={0} left={0}
            width="100%" height="auto" 
            p={[3,3,3,3,4]} 
            bg={"rgba(0,0,0, 0.7)"}
        >
            <FlexBox width={"100%"} pb={[3,3,3,3,4]}>
                <HeaderMini width={"75%"} fontFamily={"playfair"} color="light" hoverUnderline>
                    <NewLink link={`/movie/${item.slug}`}>
                        {item.name}
                    </NewLink>
                </HeaderMini>
                {item.imdbRating && 
                    <ImdbRatingIcon 
                        rating={item.imdbRating} 
                        size={"22px"} 
                        fill="#fac539"
                    />}
                {item.year && 
                    <YearClockIcon fill="#f1f1f1"
                        year={item.year} 
                        size={"22px"} 
                        ml={[2,2,2,2,3]}
                    />}
                <BookmarkMutation id={item.id} active={item.isBookmarked} size={"28px"} ml={[2]} mb={"4px"}/>
            </FlexBox>
            <Text color="light">{item.summary < 200 ? item.summary.slice(0,200) + "..." : item.summary.slice(0,200)}</Text>
            <TagBox tags={item.tags || []} num={6} />
        </FlexBox>
    </SuperBox>
)
export const CoverCard = (props) => (
    <ImageCard
        src={props.item.coverPoster || props.item.poster} 
        text={!props.notext ? props.item.name : null}
        link={props.link}
        hiddentext={props.item.name}
        ratio={props.ratio || 0.5625} 
        borderRadius={"6px"}
        boxShadow="card"
        hoverShadow
        follow={props.follow}
        {...props}
    />
)

export const MovieInformationCard = (props) => (
    <DarkCard 
        src={props.item.coverPoster}
        link={`/movie/${props.item.slug}`}
        header={props.item.name}
        textSize={["13px", "13px", "13px","14px", "14px", "16px"]}
        buttonText={"Show More"}
    >
        <FlexBox justifyContent="space-between" alignItems={"center"} mb={[1]} mt={[2]} width="100%">
            {props.item.imdbRating && 
                <ImdbRatingIcon 
                    rating={props.item.imdbRating} 
                    size={["18px", "18px", "24px"]} 
                    fill="#fac539"
                />}
            {props.item.year && 
                <YearClockIcon fill="white"
                    year={props.item.year} 
                    size={["18px", "18px", "24px"]} 
                    ml={[2,2,2,2,3]}
                />}
        </FlexBox>

        <Text
            fontSize={["13px", "13px", "13px","14px", "14px", "16px"]}
            color="light"
            my={[2]}
            >
            {props.item.summary.length > 100 ? props.item.summary.slice(0,100) + "..." : props.item.summary}
        </Text>

    </DarkCard>
)


export const RecommendationCard = (props) => (
    <DarkCard 
        src={props.item.coverPoster}
        link={`/movie/${props.item.slug}`}
        header={props.item.name}
        headerSize={[]}
        textSize={["13px", "13px", "13px","14px", "14px", "16px"]}
        buttonText={"Show More"}
    >
        <FlexBox justifyContent="space-between" alignItems={"center"} mb={[1]} mt={[2]} width="100%">
            <ImdbRatingIcon rating={props.item.imdbRating} size={["18px", "18px", "24px"]} fill="#fac539"/>
            <YearClockIcon year={props.item.year} size={["18px", "18px", "24px"]} ml={[2,2,2,2,3]}/>
        </FlexBox>
        <Text
            fontSize={["13px", "13px", "13px","14px", "14px", "16px"]}
            color="light"
            my={[2]} mb={[3]}
            >
            {props.item.summary.length > 100 ? props.item.summary.slice(0,100) + "..." : props.item.summary}
        </Text>

    </DarkCard>

)
export const MovieSimilarCard = (props) => (
    <DarkCard
        src={props.item.coverPoster || props.item.poster}
        link={`/movie/${props.item.slug}`}
        header={props.item.name}
        year={props.item.year}
        imdbRating={props.item.imdbRating}
    >
        {props.children}
    </DarkCard>
)

export const TopicCoverCard = (props) => (
    <DarkCard 
        src={props.item.coverPoster}
        link={`/topic/${props.item.slug}`}
        text={props.item.summary}
        textSize={["13px", "13px", "13px","14px", "14px", "16px"]}
        buttonText={"Show Me"}
    />
)



export const DirectorCard = (props) => (
    <ImageCard 
        src={props.item.poster}
        text={!props.notext ? props.item.name : null}
        link={`/person/${props.item.slug}`}
        hiddentext={props.item.name}
        ratio={1.67} 
        borderRadius={"8px"}
        boxShadow="card"
        hoverShadow 
        {...props}
    />
)

export const CrewCard = (props) => (
    <Card width={"100%"} p={[1]}  height={"100%"} boxShadow="card" maxWidth={"200px"}>
        <ImageCard
            src={props.crew.person.poster} 
            link={`/person/${props.crew.person.slug}`}
            hiddentext={props.crew.person.name}
            ratio={1.5}
            borderRadius={"8px"}
            title={props.crew.person.name}
        />
        <NewLink link={`/person/${props.crew.person.slug}`} hoverUnderline>
            <Text fontSize={["xs", "xs", "s"]} fontWeight="bold">
                {props.crew.person.name}
            </Text>
        </NewLink>
        {props.crew.character && 
            <Text fontSize={["xs", "xs", "s"]} opacity={0.8} mt={"auto"}>{props.crew.character.slice(0,20)}</Text>
            }
    </Card>
)


export const ListCard = (props) => (
    <Card width={props.width || "100%"} p={"0px"}  height={props.height || "100%"} boxShadow="card" bg="white" hoverShadow borderRadius={"8px"} 
        justifyContent="space-between"

    >
        <ImageCard
            src={props.item.coverPoster} 
            link={`/list/${props.item.slug}/1`}
            hiddentext={props.item.name}
            ratio={0.41}
            borderRadius={"6px"}
        />
    </Card>
)

export const MovieCoverCard = (props) => (
    <ImageCard
        src={props.item.coverPoster || props.item.poster} 
        text={!props.notext ? props.item.name : null}
        link={`/movie/${props.item.slug}`}
        hiddentext={props.item.name}
        ratio={props.ratio || 0.6} 
        follow={props.follow}
        borderRadius={"6px"}
        boxShadow="card"
        hoverShadow
        {...props}
    />
)


export const MoviePosterCard = (props) => (
    <ImageCard
        src={props.item.poster} 
        text={!props.notext ? props.item.name : null}
        link={`/movie/${props.item.slug}`}
        hiddentext={props.item.name}
        ratio={props.ratio || 1.6} 
        borderRadius={"6px"}
        boxShadow="card"
        {...props}
    />
)


export const MosaicListCard = (props) => (
    <Card width={"100%"} p={"1px"}  height={"100%"} boxShadow="card" hoverShadow borderRadius={"8px"}>
        <MosaicCard images={props.list.image} />
        <TextSection minHeight={40} header={props.list.name}  />
        <NewLink to={`/list/${props.list.slug}/1`} position="absolute" width={"100%"} height="100%" top="0" left="0" zIndex={6} />
    </Card>
)
// Original
/*


export const MovieSimilarCard2 = (props) => (
    <FlexBox 
        flexDirection="column" justifyContent="flex-start" 
        width={"100%"} height={"auto"} 
        bg="dark" borderRadius={"8px"}
        boxShadow="card"
        hoverShadow={"hover"}
    >
        <ImageCard
            src={props.item.coverPoster || props.item.poster} 
            link={`/movie/${props.item.slug}`}
            hiddentext={props.item.name}
            ratio={props.ratio || 0.5625} 
            borderRadius={0}
            borderTopLeftRadius={"8px"}
            borderTopRightRadius={"8px"}
            boxShadow="card"
            textShadow="textLight"
            {...props}
        />
        <FlexBox p={[2,2,3]} pb={[1]} flexDirection="column" justifyContent="flex-start" width={"100%"}>
            <Text color="light" fontWeight="bold">{props.item.name}</Text>
            {props.children}
        </FlexBox>

    </FlexBox>
)

    <Card width={"100%"} p={[1]}  height={"100%"} boxShadow="card" hoverShadow>
        <ImageCard
            src={props.item.coverPoster || props.item.poster} 
            link={`/movie/${props.item.slug}`}
            hiddentext={props.item.name}
            ratio={props.ratio || 0.5625} 
            borderRadius={"8px"}
        />
        <TextSection minHeight={20} 
            header={props.item.name}
            headerSize="s"
            />
        {props.children}
    </Card>


export const DirectorCard2 = React.memo((props) => (
    <NewLink rel="nofollow" to={`/person/${props.person.slug}`}>
        <ImageBox src={props.person.poster} borderRadius={8} 
            width={1} height={1} minWidth={150} maxWidth={163} maxHeight={270} minHeight={250}
            boxShadow="small" {...props}
            >
            <Text fontSize="m" color="light" fontWeight="bold" position="absolute" left="8px" bottom="8px" >{props.person.name}</Text>
        </ImageBox>
    </NewLink>
))



//export const DirectorCard3 = React.memo((props) => (
//    <AspectRatioImage ratio={1/2} width={350} src={props.person.poster} {...props}>
//    </AspectRatioImage>
//))

*/