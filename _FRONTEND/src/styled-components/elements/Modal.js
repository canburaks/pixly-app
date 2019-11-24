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
import { useScrollPosition, useOnClickOutside, lockBodyScroll, unlockBodyScroll } from "../../functions/"



export const SimpleModal = (props) => {
	return(	
		<>
			{props.isOpen && 
			<ModalBox overflowY="auto" zIndex={20} pt={"80px"}>
				<FlexBox flexDirection="column" alignItems="center"
					justifyContent="flex-start"
					position="relative" 
					height="auto" 
					px={"20px"} pb={"15px"}
					borderRadius={"4px"}
					
					overflowX="hidden"
					bg={props.bg ? props.bg : "dark"}
					boxShadow="card"
					zIndex={20}
					{...props}
				>
					<FlexBox 
						borderBottom="1px solid" borderColor="rgba(255,255,255, 0.4)"
						justifyContent="space-between" 
						width={"100%"} 
						px={[2]} mb={[2]} pb={[1]}
					>
						<HeaderMini maxWidth={"75%"} color={props.color ? props.color : "light"}>{props.header}</HeaderMini>
						<CloseButton  zIndex={22} onClick={props.closeModal} color={props.color ? props.color : "light"} />
					</FlexBox>
					{props.children}
				</FlexBox>
			</ModalBox>}
		</>
	)
}



// No outside click and  no body scroll lock
export const SimpleModal2 = (props) => {
	return(	
		<>
			{props.isOpen && 
			<ModalBox>
				<Box display="flex" position="absolute"
					top={"10vh"} 
					left={["2vw","2vw", "5vw"]} right={["2vw","2vw", "5vw"]}
					flexDirection="column" alignItems="center"
					width={["96vw", "96vw", "90vw"]} 
					height="auto" 
					px={"20px"} pt={"10px"} pb={"30px"}
					borderRadius={"16px"}
					overflowY="auto"
					overflowX="hidden"
					bg={props.bg ? props.bg : "dark"}
					boxShadow="card"
					zIndex={20}
					{...props}
				>
					<FlexBox 
						borderBottom="1px solid" borderColor="rgba(255,255,255, 0.4)"
						justifyContent="space-between" 
						width={"100%"} 
						px={[2]} mb={[2]} pb={[1]}
					>
						<HeaderMini maxWidth={"75%"} color={props.color ? props.color : "light"}>{props.header}</HeaderMini>
						<CloseButton  zIndex={22} onClick={props.closeModal} color={props.color ? props.color : "light"} />
					</FlexBox>
					{props.children}
				</Box>
			</ModalBox>}
		</>
	)
}

//When Modal is open, body scroll will be locked
export const Modal = (props) => {
	const innerModalRef = useRef()
	useOnClickOutside(innerModalRef, () => props.closeModal())


    
    //useEffect(() => {
    //    if (props.isOpen){
    //        lockBodyScroll()
    //    }
    //    return () => unlockBodyScroll()
    //},[props.isOpen])

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
					px={[2]} mb={[2]} pb={[1]}
				>
					<HeaderMini maxWidth={"75%"} color="light">{props.header}</HeaderMini>
					<CloseButton  zIndex={20} onClick={props.closeModal} />
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
