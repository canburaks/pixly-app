import React from "react";
import { Text, Paragraph, HeaderMini,HeaderText, NewLink, Box, FlexBox,Quote, Blockquote, Cite} from "../index"


export const SchemaArticle = (props) =>(
    <Box display="flex" 
        flexDirection="column" justifyContent="flex-start"
        py={[3]} my={[3,3,4]}
        {...props} 
    >
        <HeaderText 
            fontSize={props.headerSize || ["20px", "20px", "24px", "28px", "32px", "36px"]} 
            fontWeight="bold" 
            color={"dark"} textShadow={props.textShadow || "textGray"}
            pt={"4px"} 
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
            />   
            }

        {props.subheader && 
            <HeaderMini 
                fontWeight={500} fontSize={props.subheaderSize} 
                my={[2]} 
                color={"dark"} textHidden={props.textHidden}
            >
                {props.subheader}
            </HeaderMini>}

        <Text 
            fontWeight={400} fontSize={props.textSize} 
            mt={[1]} maxHeight={200} 
            color={"dark"} textHidden={props.textHidden}
        >
            {props.text}
        </Text>
        {props.secondText && 
            <Text 
                fontWeight={400} fontSize={props.textSize} 
                mt={[1]} maxHeight={200} 
                color={"dark"} textHidden={props.textHidden}
            >
                {props.secondText}
            </Text>
        }
    </Box>
)

SchemaArticle.defaultProps = {
    headerSize:"xxl",
    subheaderSize:"l",
    textSize:"m",
    quoteSize:"l"
}
