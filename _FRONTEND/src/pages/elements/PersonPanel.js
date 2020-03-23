/* eslint-disable */
import React from "react";
import { useState, useContext } from "react";

//import { SocialBox } from "../../components/SocialMedia" 
import { Title,  FollowButton } from "./Elements"
import { FlexBox, Image, HeaderText, Text, SocialBox, CardContainer } from "../../styled-components"

import "./PersonPanel.css"

export const FacebookLink = ({link, name, size, className="", }) => (
    <OuterLink href={link} mr={[1]}>
        <FacebookIcon facebook fill="#f1f1f1" />
    </OuterLink>
)
export const InstagramLink = ({link, name, size, className="", }) => (
    <OuterLink href={link} mr={[1]}>
        <InstagramIcon instagram/>
    </OuterLink>
)
export const TwitterLink = ({link, name, size, className="", }) => (
    <OuterLink  href={link} mr={[1]}>
        <TwitterIcon twitter/>
    </OuterLink>
)
export const HomeLink = ({link, name, size, className="", }) => (
    <OuterLink  href={link} mr={[1]}>
        <HomeIcon />
    </OuterLink>
)


const PersonPanel = (props) =>{
    //console.log(props)
    return(
        <CardContainer flexDirection="row">
            <Image 
                src={props.item.poster} 
                alt={`${props.item.name} poster`} 
                title={`${props.item.name} poster`} 
                width={["25vw", "25vw","25vw", "20vw" ]}
                maxWidth={"200px"} maxHeight="300px"
                height={["38vw", "38vw","38vw", "30vw"]}
                border="2px solid" borderColor="rgba(0,0,0,0.5)"

            />

            <FlexBox flexDirection="column" flexGrow={1} pl={[3,3,4,5]}>
                <HeaderText>{props.item.name}</HeaderText>
                {props.person && 
                    props.item.jobs && <Text capitalize>{props.item.jobs.join(", ")}</Text>}
                {props.person && 
                    props.personData["place_of_birth"] && <p className="t-xs t-color-dark t-bold op90">Birth Place: {props.personData.place_of_birth}</p>}
                {props.person && 
                    props.personData["birthday"] && <p className="t-xs t-color-dark t-bold op90">Born: {props.personData.birthday}</p>}

                <hr />

                <SocialBox size={40} item={props.item}  fill imdblink/>

                
            </FlexBox>

        </CardContainer>
    )
}

export default PersonPanel

