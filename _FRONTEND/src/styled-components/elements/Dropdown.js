import React from "react";
import { useMemo, useCallback, useState, useRef, useEffect } from 'react';
import {  useHistory } from "react-router-dom";

import { Text, Paragraph, 
    Image, ImageShim,ImagePlaceholder, //AspectRatioImage, 
    Box,FlexBox, ListBox,SuperBox, AbsoluteBox, 
    NewLink, CoverLink,Input, HiddenText, 
    TextSection, HeaderMini, LinkButton,
    BookmarkMutation, RatingMutation,TagBox,
    ImdbRatingIcon, YearClockIcon, ProfileIcon, LogoutIcon,
    HomeIcon,ListIcon,PlaceHolderCard,DropdownCaretIcon,
    LogoutMutation,Button, ListItemCaret, Hr,FourSquareIcon
} from "../index"
import { useOnClickOutside, useHover } from '../../functions';




export const FilmListMenu = (props) => {
    const [ref, isHovered] = useHover();
    const isLargeScreen = window.innerWidth > 480;

    const listeler =[
        {text:"Arthouse Movies", link:"/topic/art-house"},
        {text:"Biography Movies", link:"/topic/historical-figures"},
        {text:"Controversial Movies", link:"/topic/controversial-films"},
        {text:"Cyberpunk Movies", link:"/topic/cyberpunk"},
        {text:"Thought-Provoking", link:"/topic/thought-provoking"},
        {text:"LGBTQ+ Movies", link:"/topic/lgbtq-plus-films"},
        {text:"Mystery Movies", link:"/topic/mystery"}
    ]
    return(
        <Box display="flex"
            minWidth="30px" minHeight="30px" 
            position="relative" 
            ref={ref} 
            alignItems="center"
        >   
            <FlexBox 
                color="#f1f1f1 !important" 
                fontSize={["12px", "12px", "12px", "16px"]}
                py={[2]} alignItems="center" fontWeight="bold"
            >
                {isLargeScreen ? "Film Lists" : "Lists"}<DropdownCaretIcon size={"14px"} stroke="#f1f1f1" mx={0}/>
            </FlexBox>
                
            {(
                <ListBox   position="absolute" top={40} left={-20} display="flex"
                    bg="dark" borderRadius="6px" display={isHovered ? "flex" : "none"}
                    border="1px solid" borderColor="black"
                    minWidth={"160px"} minHeight={"40px"}
                    flexDirection="column" alignItems="flex-start"
                    boxShadow="card"
                >
                    {/* All Lists*/}
                    <ListBox  
                        minWidth={"100%"} borderBottom="2px solid"
                        borderColor="#ffffff" borderBox="box-sizing"
                        display="flex"  width={"auto"} 
                        py={[2]} onClick={props.onClick} 
                        clickable hoverLight="#383838"
                    >
                        <NewLink link={"/lists-of-films"} display="flex" >
                            <FourSquareIcon size={16} stroke="#f1f1f1"/>
                            <Text 
                                ml={"8px"} color="light" 
                                fontSize={["12px"]} 
                                fontWeight="bold"
                            >
                                Lists of Films
                            </Text>
                        </NewLink>
                    </ListBox>

                    <Hr/>
                    {listeler.map((liste,i) => (
                        <ListOfFilmsItem 
                            text={liste.text} 
                            link={liste.link} 
                            key={"dd" + i} 
                            minWidth={"100%"} 
                        />
                    ))}
                </ListBox>
                )}
        </Box> 
    )
}

export const ListOfFilmsItem = ({text, link, size=16,  ...props}) =>(
    <ListBox  
        display="flex"  
        width={"auto"} 
        py={[2]} 
        onClick={props.onClick} 
        clickable hoverLight="#383838"
        {...props}
    >
        <NewLink link={link} display="flex" >
            <ListItemCaret size={size} stroke="#f1f1f1"/>
            <Text ml={"8px"} color="light" fontSize={["12px"]}>{text}</Text>
        </NewLink>
    </ListBox>
)


export const HomeDropdown = (props) => {
    const [isOpen, setOpen] = useState(false)
    const ref = useRef();
    useOnClickOutside(ref, () => setOpen(false));
    const toggle = () => setOpen(!isOpen) 
    return(
        <Box minWidth="30px" minHeight="30px" position="relative" mr={[2,2,2,2,3]}>   
            <ListIcon onClick={toggle} />
                
            {isOpen && (
                <ListBox  ref={ref} position="absolute" top={"40px"} left={"-100px"}
                    bg="dark" borderRadius="6px"
                    border="1px solid" borderColor="black"
                    minWidth={"60px"} minHeight={"40px"}
                    display="flex"
                    flexDirection="column" alignItems="flex-start"
                    boxShadow="card"
                    onClick={toggle}
                >
                    <NewLink color="#f1f1f1 !important" link={"/explore"}>
                        <DropItem onClick={toggle} minWidth={"160px"} p={[2]}>
                            Explore 
                        </DropItem>
                    </NewLink>
                    <NewLink color="#f1f1f1 !important" link={"/advance-search"}>
                        <DropItem onClick={toggle} minWidth={"160px"} p={[2]}>
                            Advance Search 
                        </DropItem>
                    </NewLink>
                    {/*<NewLink  color="#f1f1f1 !important" link={"/topics"}>
                        <DropItem onClick={toggle} minWidth={"160px"} p={[2]}>
                            Topics
                        </DropItem>
                    </NewLink>
                    <NewLink  color="#f1f1f1 !important" link={"/collections"}>
                        <DropItem onClick={toggle} minWidth={"160px"} p={[2]}>
                            Collections
                        </DropItem>
                    </NewLink>*/}
                    <NewLink  color="#f1f1f1 !important" link={"/directors/1"}>
                        <DropItem onClick={toggle} minWidth={"160px"} p={[2]}>
                            Directors
                        </DropItem>
                    </NewLink>

                </ListBox>
                )}
        </Box> 
    )
}



export const ProfileDropdown = (props) => {
    const [hoverRef, isHovered] = useHover();
    const [isOpen, setOpen] = useState(false)
    //useOnClickOutside(ref, () => setOpen(false));


    const toggle = () => setOpen(!isOpen) 

    useEffect(() => {
        if (isHovered !== isOpen) {
            //console.log(isHovered, isOpen)
            setOpen(isHovered)
        }
            return () => setOpen(isHovered)
    }, [isHovered, toggle])
    return(
        <Box minWidth="30px" minHeight="30px" position="relative" mr={[2,2,2,2,3]} ref={hoverRef}>   
            <ProfileIcon onClick={toggle}/>
                
            {isOpen && (
                <ListBox position="absolute" top={"40px"} left={"-80px"}
                    bg="dark" borderRadius="6px"
                    border="1px solid" borderColor="black"
                    minWidth={"60px"} minHeight={"40px"}
                    display="flex"
                    flexDirection="column" alignItems="flex-start"
                    boxShadow="card"
                >
                    <ProfileTextIcon onClick={toggle} username={props.username} />
                    <NewLink color="#f1f1f1 !important" link={"/explore"}>
                        <DropItem onClick={toggle} minWidth={"160px"} p={[2]}>
                            Explore 
                        </DropItem>
                    </NewLink>
                    <NewLink color="#f1f1f1 !important" link={"/advance-search"}>
                        <DropItem onClick={toggle} minWidth={"160px"} p={[2]}>
                            Advance Search 
                        </DropItem>
                    </NewLink>
                    <NewLink  color="#f1f1f1 !important" link={"/directors/1"}>
                        <DropItem onClick={toggle} minWidth={"160px"} p={[2]}>
                            Directors
                        </DropItem>
                    </NewLink>

                    <LogoutTextIcon   />
                </ListBox>
                )}
        </Box> 
    )
}
const DropItem = (props) => (
    <ListBox  display="flex"  minWidth={"120px"} py={[2]} onClick={props.onClick} clickable hoverLight="#383838" {...props}/>
)


//Only SVG Icons
export const ProfileTextIcon = ({username, size=20, ...props}) =>(
    <DropItem {...props}>
        <ProfileIcon size={size}/>
        <Text ml={"8px"} color="light" fontSize={`${size - 4}px`}>Profile</Text>
        <CoverLink link={`/${localStorage.getItem("USERNAME")}/dashboard`}></CoverLink>
    </DropItem>
)
//Only SVG Icons
export const LogoutTextIcon = ({size=20, ...props}) =>(
    <DropItem  {...props}>
        <LogoutMutation display="flex">
            <LogoutIcon size={size}/>
            <Text ml={"8px"} color="light" fontSize={`${size - 4}px`}>Logout</Text>
        </LogoutMutation>
    </DropItem>
)

