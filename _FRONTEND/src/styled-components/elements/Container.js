import React from "react";

import {  styled } from "../"
import { themeGet } from '@styled-system/theme-get'

import { 
    Box,SuperBox, GridBox, FlexBox, BlurBox, Text, HeaderText, HeaderMini, NewLink, Paragraph,
    TagText,HtmlBox,
} from "../index"
import { SocialBox } from "../others"
import parse, { domToReact } from 'html-react-parser';



export const HtmlContainer = ({ html, ...props }) => {

    const options = {
        replace: domNode => {
            //console.log(domNode.name)
            if (domNode.attribs && (
                    domNode.name === 'h3' || 
                    domNode.name === 'h4' ||
                    domNode.name === 'h6')
                ) {
                return <HeaderMini {...props}>{domToReact(domNode.children)}</HeaderMini>
            }
            else if (domNode.attribs && domNode.name === 'p') {
                //console.log(domNode)
                return <Text {...props} textAlign="justify">{domToReact(domNode.children)}</Text>
            }
          }
    }

    function parseTest(){
        if(html){
            //console.log("parser" , html)
            //console.log("topic: ", parseResult)
            return parse(html, options)
             
        }
    }
    parseTest()
    return (
        <HtmlBox>
            {parseTest()}
        </HtmlBox>
    )
}

export const TopPanelBackElement = (props) => (
    <Box display="flex"
        flexDirection="column"
        width={"105vw"} maxHeight={"100vh"} position={"relative"} py={[4,4,4]} mb={[3]} zIndex={2}
        {...props}
    >
        <BlurBox 
            src={props.src} //will be either coverPoster or poster for blurry background  
            position="absolute"
            width={"110vw"} maxHeight={["110vh", "105vh", "105vh"]}
            left={"-5vw"} top={"-95px"} bottom={"-10px"} 
            blur={props.blur || 20}
            zIndex={2}
            />
        {props.children}
    </Box>
)

export const TopPanelCoverElement = React.memo((props) => (
    <SuperBox src={props.item.largeCoverPoster || props.item.coverPoster || props.item.poster} 
        position={"relative"} 
        top={0} left={["1vw", "1vw", "5vw"]} right={["1vw", "1vw", "5vw"]} maxWidth={["94vw", "95vw", "88vw"]}
        height={["53vw","53vw", "45vw"]} maxHeight={"80vh"}
        boxShadow="duo" 
        zIndex={3}
        borderRadius={8}
        overflow="hidden"
    >   
        <SocialBox size={24} item={props.item} position="absolute" top="20px" right="20px" />
        {props.Actions && <props.Actions item={props.item} authStatus={props.authStatus} />}

        {/*console.log("top panel", props.item.name) */}
        <Box position={"absolute"} pl={[2,2,3]} py={[1,1,2]} pt={[2,3,4]} left={0} bottom={0} width={"100%"} height={"auto"} darken={props.darken}>
            <HeaderText color="lightDark1" textShadow={"textDark"} fontSize={[16, 16, 20, 24, 28]} fontWeight="bold">{props.header}</HeaderText>

            {props.Header && <props.Header item={props.item} authStatus={props.authStatus} />}
            {props.subheader && <HeaderText color="lightDark1" textShadow="dark" fontSize={[15, 15, 18, 20, 22]} fontWeight="500">{props.subheader}</HeaderText>}
            {/*console.log("il", props.isLargeScreen)*/}
            {(props.text && props.isLargeScreen) && <Paragraph color="lightDark1" textShadow={"textDark"} fontSize={[14, 14, 16, 16,18]}  maxWidth={"95%"}>{props.text}</Paragraph>}
            {props.children}
        </Box>

    </SuperBox>
), (prevProps, nextProps) => (prevProps.isLargeScreen === nextProps.isLargeScreen))



export const PaginationBox = ({currentPage, totalPage, nextPage, prevPage}) => (
<Box justifyContent="center" alignItems="center" className="fbox-r jcc aic pag">
    <Box fontWeight="bold" color="dark" textAlign="center" hoverUnderline clickable onClick={prevPage}>
        {currentPage > 1 && "< Previous" }
    </Box>
    
    <Box fontWeight="bold" color="dark" textAlign="center" m={[3]}>
        {currentPage}
    </Box>

    <Box fontWeight="bold" color="dark" textAlign="center" hoverUnderline clickable onClick={nextPage}>
        {(currentPage < totalPage) && "Next >" }
    </Box>
</Box>
) 


export const Grid = styled(GridBox)`
    width:100%;
    position:relative;
    grid-template-rows: minmax(50px, 400px;);

    @media screen and (min-width: 200px){
        grid-template-columns: repeat(${props => props.columns[0]}, 1fr);
    }
    @media screen and (min-width: ${themeGet("breakpoints.xs")}){
        grid-template-columns: repeat(${props => props.columns[1]}, 1fr);

    }
    @media screen and (min-width: ${themeGet("breakpoints.sm")}){
        grid-template-columns: repeat(${props => props.columns[2]}, 1fr);

    }
    @media screen and (min-width: ${themeGet("breakpoints.md")}){
        grid-template-columns: repeat(${props => props.columns[3]}, 1fr);

    }
    @media screen and (min-width: ${themeGet("breakpoints.lg")}){
        grid-template-columns: repeat(${props => props.columns[4]}, 1fr);

    }
    @media screen and (min-width: ${themeGet("breakpoints.xl")}){
        grid-template-columns: repeat(${props => props.columns[5]}, 1fr);

    }
    @media screen and (min-width: ${themeGet("breakpoints.xxl")}){
        grid-template-columns: repeat(${props => props.columns[6]}, 1fr);

    }
    @media screen and (min-width: ${themeGet("breakpoints.xxxl")}){
        grid-template-columns: repeat(${props => props.columns[7]}, 1fr);

    }
    transition: ${themeGet("transitions.medium")};
`
Grid.defaultProps = {
    gridColumnGap: ["8px", "8px", "16px"],
    gridRowGap: "32px"
}

export const TagBox = ({tags, num=100}) => (
    <FlexBox flexWrap="wrap" py={[2]} color="light">
        {tags.slice(0, num).map(tag => (
            <TagText key={tag.name ? "tbox"+ tag.name : "tbox" + tag}  
                fontSize={["10px","12px","12px", "12px", "12px", "14px"]}
                fontFamily="header"
            >
                {tag.name ? tag.name : tag}
            </TagText>
            ) )}
    </FlexBox>
)
 

const Container = (props) => (
    <Box  
        display="flex" position="relative" 
        flexDirection="column" justifyContent="flex-start"
        pt={[2]}
        height={"auto"} 
        {...props} 
    
    />
) 
export const Clippy = styled(Container)`
    position: absolute;
    top:0;
    left:0;
    width:100vw;
    height: 80px;
    background: #242830;
    background: linear-gradient(
        180deg,
        rgba(10, 10, 10, 0.7) 0%,
        rgba(36, 40, 48, 0.2) 80%,
        rgba(36, 40, 48, 0) 100%
    );
`

export const PageContainer = (props) => (
    <Container  id={"page-container"}
        minWidth={"100vw"} maxWidth={"100vw"}  minHeight={"70vh"} pt={0}
        {...props}
    />
)

export const ContentContainer = (props) => (
    <Container  id="content-container" display="flex"
        width={"100%"} minHeight={"70vh"}
        px={"5vw"}
        {...props}
    />
)


// Sample
//<BlurryBox src={item.coverPoster} blur={20} mb={[3]} width={"100vw"} height={"56vw"} />
export const BlurryBox = (props) =>(
    <Box display="flex"
        flexDirection="column"
        width={props.width} height={props.height} position={"relative"} py={"5vw"} px={"10vw"}
    >
        <BlurBox src={props.src}  position="absolute"
            width={"100%"} minHeight={props.height}  left={0} top={0} blur={props.blur}
            />
        {props.children}
    </Box>
)


//-------------------------------------------------------------
/*
export const ColorBox = (props) => {
    const [colors, setColors] = useState(null)
        return(
        <>
        <ColorExtractor rgb getColors={colors => setColors(rgbGradient(colors))} src={props.src} />
            {colors && 
                <GradientBox display="flex"
                    flexDirection="column" justifyContent="center" alignItems="center" 
                    width={"100vw"} height={"60vw"} background={colors} {...props}
                    >
                    {props.children}
                </GradientBox>}
        </>
    )
}
function rgbGradient(arrays, opacity=0.9, degree=90){
    const filterLightColors = arrays.filter(c => (parseFloat(c[0]) + parseFloat(c[1]) + parseFloat(c[2])<550))
    const sorted = filterLightColors.sort(function(a,b){return a[0] - b[0]})
    //console.log("rgb function", sorted)
    const colors = [`linear-gradient(${degree}deg`];
    const quantity = sorted.length;
    sorted.map((c,i) => (
        colors.push(`rgba(${Math.trunc(c[0])}, ${Math.trunc(c[1])}, ${Math.trunc(c[2])}, ${opacity}) ${Math.trunc((i * (100/(quantity-1))))}%`)
        ))
    const css = colors.join(", ") + ")"
    return css
}
*/
//-------------------------------------------------------------
