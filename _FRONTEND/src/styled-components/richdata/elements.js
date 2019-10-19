import React from "react";
import { 
    Text, Image, HeaderMini,HeaderText, NewLink,
    Box, FlexBox,Quote, Blockquote, Cite, Span, Meta
} from "../index"


export const SchemaArticle = (props) =>(
    <Box itemScope itemType="http://schema.org/NewsArticle"
        display="flex" flexDirection="column" justifyContent="flex-start"
        py={[3]} my={[3,3,4]}
        {...props} 
    >
        {/* Schema Image Object*/}
        <Box itemProp="image" itemScope itemType="http://schema.org/ImageObject">
            <Meta itemProp="height" content="600"/>
            <Meta itemProp="width" content="338"/>
            <Meta itemProp="url" content="https://cbs-static.s3.amazonaws.com/static/media/topics/5/cover/cyberpunk-600x338.jpg"/>
            <Image 
                src="https://cbs-static.s3.amazonaws.com/static/media/topics/5/cover/cyberpunk-600x338.jpg" 
                info={`${props.header} + Image`}
                display={"none"}
            />
        </Box>

        {/* Schema author*/}
        <Meta itemProp="author" content="Can Burak S." />

        {/* Schema Publisher*/}
        <SchemaPublisher />

        {/* Schema headline*/}
        <HeaderText itemProp="headline"
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
            />}

        {/* Schema datapublished*/}
        <Span itemProp="datePublished" content={props.publishedAt}>{props.publishedAt}</Span>
        

        {props.subheader && 
            <HeaderMini 
                fontWeight={500} fontSize={props.subheaderSize} 
                my={[2]} 
                color={"dark"} textHidden={props.textHidden}
            >
                {props.subheader}
            </HeaderMini>}
        
        {/* Article Body*/}
        <Box width={"100%"} height="auto" itemProp="articleBody">
            <Text itemProp="description" 
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
                </Text>}
        </Box>

    </Box>
)

export const SchemaPublisher = () => (
    <Box itemProp="publisher" itemScope itemType="http://schema.org/Organization">
        <Box itemProp="logo" itemScope itemType="http://schema.org/ImageObject">
            <Meta itemProp="url" content="https://cbs-static.s3.eu-west-2.amazonaws.com/static/favicons/apple-icon-76x76.png" />
            <Image src="https://cbs-static.s3.eu-west-2.amazonaws.com/static/favicons/apple-icon-76x76.png" info="Pixly Logo" display="none" />
        </Box>
        <Meta itemProp="name" content="Pixly" />
    </Box>
)

SchemaArticle.defaultProps = {
    headerSize:"xxl",
    subheaderSize:"l",
    textSize:"m",
    quoteSize:"l"
}
