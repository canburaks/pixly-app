import React from "react";

import { Text, Paragraph, NewLink, Box, FlexBox} from "../atoms"


export const TextSection = (props) =>(
    <Box display="flex" 
        flexDirection="column" justifyContent="flex-start" alignItems="center"
        py={[3]} my={[2]}
        {...props} 
    >
        <Text color={"dark"} textShadow="light" fontWeight="bold" fontSize={props.headerSize} 
            pt={"4px"}
        >
            {props.header}
        </Text>
        {props.text && 
        <Paragraph color={"dark"} fontWeight={400} fontSize={props.textSize} 
            minHeight={30}  mt={[1]} maxHeight={200} textHidden={props.textHidden}
        >
            {props.text}
        </Paragraph>}
    </Box>
)


TextSection.defaultProps = {
    headerSize:"m",
    textSize:"s"
}