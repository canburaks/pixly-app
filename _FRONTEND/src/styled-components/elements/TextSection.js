import React from "react";
import { Text, Paragraph, HeaderMini,HeaderText, NewLink, Box, FlexBox, Blockquote, Cite} from "../atoms"

export const Stats = (props) => (
    <FlexBox flexDirection="column" alignItems="center" {...props}>
        <Text  color={props.color} fontSize={["xxxs", "xxs", "xs", "xs", "s"]}>{props.text}</Text>
        <Text color={props.color} fontSize={["s", "m"]} fontWeight={"bold"}>{props.value}</Text>
    </FlexBox>
)

export const Quote = (props) =>(
        <Blockquote cite={props.quote.ownerName}
            fontFamily="quote"
            fontWeight={"500"} fontSize={props.fontSize} 
            mt={[1]}  fontStyle="italic"
            color={"dark"} 
            {...props}
        >
            {props.quote.text}
            <Cite>{props.quote.ownerName}</Cite>
        </Blockquote>
)
Quote.defaultProps = {
    fontSize:"xl"
}

export const ArticleSection = (props) => {

    return (
        <Box display="flex" flexDirection="column" justifyContent="flex-start"
        py={[3]} my={[3,3,4]}
        {...props} 
    >

        {/* Schema headline*/}

        <HeaderText 
            fontSize={props.headerSize || ["20px", "20px", "24px", "28px", "32px"]} 
            fontWeight="bold" 
            color={"dark"} textShadow={props.textShadow || "textGray"}
            pt={[3]} 
        >
            {props.header}
        </HeaderText>

        {props.quote && 
            <Quote 
                fontSize={props.quoteSize} 
                quote={props.quote}
                alignSelf="center"
                maxWidth={["100%", "90%", "90%", "80%"]}
                my={[3,3,3,4]}
            />}
            



        {props.subheader && 
            <HeaderMini 
                fontWeight={500} fontSize={props.subheaderSize} 
                my={[2]} 
                color={"dark"} textHidden={props.textHidden}
            >
                {props.subheader}
            </HeaderMini>}
        
        {/* Article Body*/}
        <Box width={"100%"} height="auto" mt={[3]}>
            <Text fontSize={props.textSize} mt={[2]}>
                {props.summary}
            </Text>
            
            <Text 
                 fontSize={props.textSize} mt={[2]}>
                {props.content}
            </Text>
            {props.children}
        </Box>

    </Box>
)}

ArticleSection.defaultProps = {
    headerSize:"xxl",
    subheaderSize:"l",
    textSize:"m",
    quoteSize:"l"
}

export const TextSection = (props) =>(
    <Box display="flex" 
        flexDirection="column" justifyContent="flex-start" alignItems="flex-start"
         my={[2]} mt={5}
        {...props} 
    >
        <HeaderMini color={"dark"} textShadow={props.textShadow || "textLight"} fontWeight="bold" fontSize={props.headerSize || ["l", "l", "xl", "xxl"]} 
            pt={"4px"} 
        >
            {props.header}
        </HeaderMini>
        {props.text && 
        <Text color={"dark"} fontWeight={400} fontSize={props.textSize} 
            minHeight={30}  mt={[1]} maxHeight={200} textHidden={props.textHidden}
        >
            {props.text}
        </Text>}
        {props.children}
    </Box>
)

TextSection.defaultProps = {
    textSize:"s"
}

