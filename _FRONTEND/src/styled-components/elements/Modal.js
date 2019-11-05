import React from "react";
import { useMemo, useCallback, useState, useEffect, useRef } from 'react';
import { createGlobalStyle } from 'styled-components'


import { Text,  HeaderMini,
        Image, ImageShim,ImagePlaceholder, //AspectRatioImage, 
        Box, AbsoluteBox, FlexBox,ModalBox,
		NewLink, Input, Button, BubbleButton, 
		ModalMotionBox
} from "../"

import { TextSection } from "./TextSection"
import { useScrollPosition, useOnClickOutside } from "../../functions/hooks"



export const Modal = (props) => {
	const innerModalRef = useRef()
	useOnClickOutside(innerModalRef, () => props.closeModal())


    
    useEffect(() => {
		function lockbody(){
			document.body.style.position = 'fixed';
			document.body.style.overflowY = "hidden";
		}
	
		function unlockbody(){
			document.body.style.scrollBehavior = 'smooth'
			document.body.style.overflowY = "auto";
		}
        if (props.isOpen){
            lockbody()
        }
        return () => unlockbody()
    },[props.isOpen])

	return(	
		<ModalMotionBox isOpen={props.isOpen} top={"120px"} >
			<Box ref={innerModalRef} 
				display="flex" position="absolute"
				top={"10vh"} 
				left={["2vw","2vw", "5vw"]} right={["2vw","2vw", "5vw"]}
				flexDirection="column" 
				width={["96vw", "96vw", "90vw"]} 
				height="auto" 
				px={"20px"} pt={"10px"} pb={"30px"}
				borderRadius={"16px"}
				overflowY="auto"
				overflowX="hidden"
				bg="dark"
				boxShadow="card"
			>
				<FlexBox 
					borderBottom="1px solid" borderColor="rgba(255,255,255, 0.4)"
					justifyContent="space-between" 
					width={"100%"} 
					pb={[1]}
					
				>
					<HeaderMini maxWidth={"75%"} color="light">{props.header}</HeaderMini>
					<CloseButton  zIndex={10} onClick={props.closeModal} />
				</FlexBox>
				{props.children}
			</Box>
		</ModalMotionBox>
	)
}

const CloseButton = (props) =>( 
	<Button 
		bg="transparent" color="rgba(220,220,220, 0.8)"  hoverColor="white"
		fontSize={30}
		clickable
		textShadow={"textDark"}
		position="realtive" 
		px={"8px"}
		py={0}
		{...props}
	>
		x
	</Button>
)
