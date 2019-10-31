import React from "react";
import { useMemo, useCallback, useState, useRef, useEffect } from 'react';

import { Text, Paragraph, 
    Image, ImageShim,ImagePlaceholder, //AspectRatioImage, 
    Box,FlexBox, ListBox,SuperBox, AbsoluteBox, 
    NewLink, CoverLink,Input, HiddenText, 
    TextSection, HeaderMini, LinkButton,
    BookmarkMutation, RatingMutation,TagBox,
    ImdbRatingIcon, YearClockIcon, ProfileIcon, LogoutIcon,
    HomeIcon,ListIcon,PlaceHolderCard,
    LogoutMutation
} from "../index"
import { useOnClickOutside, useHover } from '../../functions';



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
        <CoverLink link={`/${username}/dashboard`}></CoverLink>
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

