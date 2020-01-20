import React from "react";

import {  styled } from "../"
import { themeGet } from '@styled-system/theme-get'

import { 
    Box,SuperBox, GridBox, FlexBox, BlurBox, Text, HeaderText, HeaderMini, NewLink, Paragraph,
    TagText,HtmlBox,SubHeaderText, Image,CoverLink
} from "../index"
import { SocialBox } from "../others"
import parse, { domToReact } from 'html-react-parser';

import Highlight from 'react-highlight'

import "../../../node_modules/highlight.js/styles/rainbow.css"

export const HtmlContainer = ({ html, ...props }) => {
    const options = {
        replace: domNode => {
            //console.log(domNode)
            if (domNode.attribs && domNode.name ==="h1"){
                return (
                    <HeaderText  mt={"32px !important"}
                        fontSize={["24px", "24px", "28px", "32px", "36px"]}
                    >
                        {domToReact(domNode.children)}
                    </HeaderText>)
            }
            else if (domNode.attribs && domNode.name ==="h2"){
                return <SubHeaderText fontSize={["22px", "22px", "26px"]}  mt={"32px !important"}>{domToReact(domNode.children)}</SubHeaderText>
            }
            else if (domNode.attribs && domNode.name ==="code"){
                return <Highlight>{domToReact(domNode.children)}</Highlight>
            }
            else if (domNode.attribs && (
                    domNode.name === 'h3' || 
                    domNode.name === 'h4')
                ) {
                return <HeaderMini   mt={"8px !important"} fontSize={["20px", "20px", "22px"]}>{domToReact(domNode.children)}</HeaderMini>
            }
            else if (domNode.attribs && domNode.name === 'p' ) {
                //console.log(domNode)
                return <Text fontSize={["14px", "16px", "18px"]}>{domToReact(domNode.children)}</Text>
            }
            //else if (domNode.attribs && domNode.name === 'img') {
            //    //console.log(domNode)
            //    return <Image maxWidth={"100%"}>{domToReact(domNode.children)}</Image>
            //}
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
        <HtmlBox maxWidth={"100%"} overflowX="hidden" {...props} className="html-box">
            {parseTest()}
        </HtmlBox>
    )
}

export const MessageBox = ({ header,Header,subheader,Subheader,miniheader, text, Image, children, ...props}) => (
    <FlexBox 
        overflow="hidden"
        border="1px solid" borderColor="rgba(40,40,40, 0.4)" 
        boxShadow="1px 5px 8px -8px rgba(0,0,0, 0.9)" 
        bg="#d1d1d1"
        p={[2]} mt={[4, 4,5]} px={[3]}
        width={"100%"} {...props}
    >
        <FlexBox flexDirection="column" justifyContent="flex-start" alignItems="flex-start" width={"100%"} textAlign="left">
            {Header && <Header fontWeight="bold" textAlign="left" />}
            {(header || subheader) && 
                <SubHeaderText fontSize={["20px", "20px", "24px", "28px"]} fontWeight="bold" opacity={0.95} textAlign="left">
                    {header || subheader}
                </SubHeaderText>}
            {Subheader && <Subheader fontWeight="bold" opacity={0.9} textAlign="left"/>}
            {miniheader && 
                <HeaderMini fontSize={["20px", "20px", "24px", "28px"]} fontWeight="bold" opacity={0.75}
                    textAlign="left"
                >
                    {miniheader}
                </HeaderMini>}

            <Text opacity={0.8}>{text}</Text>
            <FlexBox width="100%" mt={[3]}>
                {children}
            </FlexBox>
        </FlexBox>
        {Image && 
            <FlexBox maxWidth={"30%"}>
                <Image />
            </FlexBox>
        }
    </FlexBox>
)

export const PostInfoBox = ({ post, follow, children }) => (
    <FlexBox position="relative"
        fontFamily="paragraph" overflow="hidden"
        border="1px solid" borderColor="rgba(40,40,40, 0.4)" 
        boxShadow="1px 5px 8px -8px rgba(0,0,0, 0.9)" 
        bg="#e1e1e1"
        p={[2]} mt={[4, 4,5]}
        width={"100%"}
        minHeight={"300px"}
    >
        <FlexBox flexDirection="column" justifyContent="flex-start" alignItems="flex-start" pb={[3]} width={"100%"}>
            <SuperBox 
                title={post.header}
                src={post.cover} 
                info={post.header + " post image"} 
                width={"100%"} height={"200px"} minHeight={"120px"}
                mb={[4]}
                >
                <CoverLink to={`/blog/${post.slug}`} width={"100%"}/>
            </SuperBox>

            <NewLink to={`/blog/${post.slug}`} follow={follow ? true : undefined}>
                <HeaderMini fontSize={["18px", "18px", "20px", "22px"]} hoverUnderline>{post.header}</HeaderMini>
            </NewLink>
            <Text fontWeight="bold" color={"rgba(40,40,40, 0.7)"} mt={[1]}>{post.summary}</Text>
            <NewLink to={`/blog/${post.slug}`}>
                <Text mt={[3]} fontWeight="bold" underline>See the post</Text>
            </NewLink>
            {children}
        </FlexBox>
    </FlexBox>
)



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



export const TagBox = ({tags, num=100, color, ...props}) => (
    <FlexBox flexWrap="wrap" py={[0,0,1]} color={color || "light"} {...props}>
        {tags.slice(0, num).map(tag => (
            <TagText key={tag.name ? "tbox"+ tag.name : "tbox" + tag}  
                fontSize={props.fontSize || ["10px", "10px", "10px", "12px"]}
                fontFamily="header"
                px={["6px", "6px", "8px"]}
                borderColor={color || "light"}
                color={color || "light"}
                title={tag.name} truncate
                maxHeight="20px"
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
    height: 65px;
    background: #242830;
    background: linear-gradient(
        180deg,
        rgba(10, 10, 10, 0.7) 0%,
        rgba(36, 40, 48, 0.2) 80%,
        rgba(36, 40, 48, 0) 100%
    );
`

export const PageContainer = (props) => (
    <Container  id={"page-container"} bg="#d1d1d1"
        minWidth={"100vw"} maxWidth={"100vw"}  minHeight={"70vh"} pt={0} 
        {...props}
    />
)

export const ContentContainer = (props) => (
    <Container  id="content-container" display="flex" 
        bg="#d1d1d1"
        width={"100%"} minHeight={"70vh"} pb={[3]}
        px={["4vw", "4vw", "6vw", "4vw", "80px"]}
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


export const Grid = styled(GridBox)`
    width:100%;
    position:relative;
    grid-template-rows: minmax(50px, 400px;);

    @media screen and (min-width: 200px){
        grid-template-columns: repeat(${props => props.columns[0]}, 1fr) !important;
    }
    @media screen and (min-width: ${themeGet("breakpoints.xs")}){
        grid-template-columns: repeat(${props => props.columns[1]}, 1fr) !important;

    }
    @media screen and (min-width: ${themeGet("breakpoints.sm")}){
        grid-template-columns: repeat(${props => props.columns[2]}, 1fr) !important;

    }
    @media screen and (min-width: ${themeGet("breakpoints.md")}){
        grid-template-columns: repeat(${props => props.columns[3]}, 1fr) !important;

    }
    @media screen and (min-width: ${themeGet("breakpoints.lg")}){
        grid-template-columns: repeat(${props => props.columns[4]}, 1fr) !important;

    }
    @media screen and (min-width: ${themeGet("breakpoints.xl")}){
        grid-template-columns: repeat(${props => props.columns[5]}, 1fr) !important;

    }
    @media screen and (min-width: ${themeGet("breakpoints.xxl")}){
        grid-template-columns: repeat(${props => props.columns[6]}, 1fr) !important;

    }
    @media screen and (min-width: ${themeGet("breakpoints.xxxl")}){
        grid-template-columns: repeat(${props => props.columns[7]}, 1fr) !important;

    }
    transition: ${themeGet("transitions.medium")};
`
Grid.defaultProps = {
    gridColumnGap: ["8px", "8px", "16px"],
    gridRowGap: "32px"
}

export const TopPanelBackElement = (props) => (
    <Box display="flex"
        flexDirection="column"
        width={"105vw"} maxHeight={"100vh"} position={"relative"} py={[0,0,4]} mb={[3]} zIndex={2}
        {...props}
    >
        <BlurBox 
            src={props.src} //will be either coverPoster or poster for blurry background  
            position="absolute"
            width={"110vw"} maxHeight={["120vh", "120vh", "120vh"]}
            left={"-5vw"} top={-70} bottom={"-10px"} 
            blur={props.blur || 20}
            zIndex={2}
            />
        {props.children}
    </Box>
)

export const TopPanelCoverElement = React.memo((props) => (
    <SuperBox src={props.item.largeCoverPoster || props.item.coverPoster || props.item.poster} 
        position={"relative"} 
        top={0} left={0} maxWidth={["100%"]}
        height={["60vw","60vw", "50vw"]} maxHeight={"90vh"}
        boxShadow="card" 
        zIndex={3}
        overflow="hidden"
    >   
        <SocialBox size={24} item={props.item} position="absolute" top="20px" right="20px" />
        {props.Actions && <props.Actions item={props.item} authStatus={props.authStatus} />}
        {props.Trailer && <props.Trailer />}

        {/*console.log("top panel", props.item.name) */}
        <Box position={"absolute"} 
            pl={[2,2,3]} py={[1,1,2]} pt={[1,1,2]} 
            left={0} bottom={0} 
            width={"100%"} height={"auto"} maxHeight={"50%"}
            darken={props.darken}
            bg={"rgba(0,0,0, 0.5)"}
        >
            <HeaderText color="lightDark1" textShadow={"textDark"} fontSize={[16, 16, 20, 24, 28]} fontWeight="bold">{props.header}</HeaderText>

            {props.Header && <props.Header item={props.item} authStatus={props.authStatus} />}
            {props.subheader && <HeaderText color="lightDark1" textShadow="dark" fontSize={[14, 14, 18, 20, 22]} fontWeight="500">{props.subheader}</HeaderText>}
            {/*console.log("il", props.isLargeScreen)*/}
            {(props.text && props.isLargeScreen) && <Paragraph color="lightDark1" textShadow={"textDark"} fontSize={[14, 14, 16, 16,18]}  maxWidth={"95%"}>{props.text}</Paragraph>}
            {props.children}
        </Box>

    </SuperBox>
), (prevProps, nextProps) => (prevProps.isLargeScreen === nextProps.isLargeScreen && prevProps.item.coverPoster === nextProps.item.coverPoster))


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
