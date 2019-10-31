import React from "react";

import {  styled } from "../"
import { themeGet } from '@styled-system/theme-get'
//import { ProgressBar,Popup } from "cbs-react-components";

import { 
    Box,SuperBox, GridBox, FlexBox, BlurBox, Text, HeaderText, NewLink, Paragraph,
    TagText,Menu, MenuItem, Image,Stats,
    PlaceIcon, HomeIcon, SettingsIcon, FollowMutation,
    ProgressBar
} from "../index"
import { SocialBox } from "../others"

//import { ColorExtractor } from 'react-color-extractor'

export const ProfileCoverPanel = (props) => (
    <FlexBox flexDirection="column" width={"100%"} justifyContent="flex-end" height="auto" maxHeight={"450px"} bg="dark" mt={0}>
        {props.profile.isSelf && 
        <SettingsIcon 
            position="absolute" 
            right={["5vw", "5vw", "10vw"]} top={["20px"]} 
            onClick={props.onClickSettings} zIndex={5}
        />}
        <FlexBox width="100%" pt={[3,3,3,4]} px={[2,2,2,3]}>
            {/* AVATAR PART*/}        
            <Image 
                src={props.profile.avatar} 
                info={props.profile.name + " avatar"} 
                width={["80px", "80px", "90px", "110px"]} height={["80px", "80px", "90px", "110px"]} 
                borderRadius={"100%"}
                my="auto"
            />
            {/* INFO PART*/}
            <FlexBox flexDirection="column" ml={[2,2,3,4]}>
                <HeaderText  color="light" fontSize={["16px", "16px", "16px", "18px"]} >{props.profile.name}</HeaderText>
                <FlexBox>
                    <Text color="light" opacity={0.7}>@{props.profile.username}</Text>
                    <PlaceIcon text={props.profile.country && props.profile.country[0]} opacity={0.7} size={"20px"}/>
                </FlexBox>
                {props.profile.bio && <Text color="light" opacity={0.7}>{props.profile.bio}</Text>}
            </FlexBox>
        </FlexBox>

        {/* MENU AND SIMILARITY*/}
        <FlexBox flexDirection="column" width={"100%"} maxWidth={"600px"} alignItems="stretch" px={[1,1,2,3]} mt={[3]}>

            {props.similarity && props.similarity.valid && <SimilarityPanel similarity={props.similarity}/>}
            <ProfileMenuPanel {...props}/>
        
        </FlexBox>

    </FlexBox>
)
const SimilarityPanel = ({ similarity }) => (
<Box maxWidth={"100%"} mx={[3]} position="relative">
    <ProgressBar
        
        percentValue={similarity.percent}                          //required
        height="16px"                         //default 30(px)
        fontSize={16}                       //default 16(px)
        borderRadius={16}                    //default 4(px)
        spectrum={{ start: 0, stop: 120, tranparency: 0.5 }} //default none
    />
    <Text color="light" fontSize={["12px"]} opacity={0.7}>{similarity.message}</Text>
</Box>
)


const ProfileMenuPanel = (props) => (
    <Menu mt={[3]}>
        {props.profile.isSelf && 
            <MenuItem width={"16%"} maxWidth={"80px"}
                name={"home"}
                active={props.state === 'home'}
                onClick={props.onClick}
            >
                <HomeIcon />
            </MenuItem>}

        <MenuItem width={"16%"} maxWidth={"100px"}
            name="ratings"
            active={props.state === 'ratings'}
            onClick={props.onClick}
        >
            <Stats color="light" text="RATINGS" value={props.profile.points} />
        </MenuItem>
        <MenuItem width={"16%"} maxWidth={"60px"}
            name="likes"
            active={props.state === 'likes'}
            onClick={props.onClick}
        >
            <Stats color="light" text="LIKES" value={props.profile.favouriteMovies.length} />
        </MenuItem>

        <MenuItem width={"16%"} maxWidth={"100px"}
            name="bookmarks"
            active={props.state === 'bookmarks'}
            onClick={props.onClick}
        >
            <Stats color="light" text="WATCHLIST" value={props.profile.bookmarks.length} />
        </MenuItem>

        <MenuItem width={"20"} maxWidth={["90px","100px", "120px", "120px"]}
            name="followers"
            name='followers'
            active={props.state === 'followers'}
            onClick={props.onClick}
        >
            <Stats color="light" text="FOLLOWERS" value={props.profile.followers.length} />
        </MenuItem>
        <MenuItem width={"20"} maxWidth={["90px","100px", "120px", "120px"]}
            name='followings'
            active={props.state === 'followings'}
            onClick={props.onClick}
        >
            <Stats color="light" text="FOLLOWINGS" value={props.profile.followingProfiles.length} />
        </MenuItem>

        {!props.profile.isSelf &&
            <MenuItem width={"16%"} maxWidth={"100px"} clickable={false}
            >
                <FollowMutation username={props.profile.username} active={props.profile.isFollowed} />
            </MenuItem>}
    </Menu>
)