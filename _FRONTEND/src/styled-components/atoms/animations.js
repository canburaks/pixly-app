import React from "react"
import { generateGradient } from "../../functions/"
import {  styled, keyframes, css } from "../"

import { 
    ModalBox,Box,FlexBox, Text
} from "../index"


export const GradientAnimationModal = (props) => {
    return (
        <FlexBox 
            position="fixed" justifyContent="center" alignItems="center"
            left={`calc(50vw - 300px)`} right={`calc(50vw - 300px)`}
            top={`calc(50vh - 300px)`} bottom={`calc(50vh - 300px)`}
            {...props}
        >
            <GradientAnimationBox text={props.text} />
        </FlexBox>
)}

export const GradientAnimationBox = (props) => (
    <OuterBox>
        <InnerBox >{props.text}</InnerBox>
    </OuterBox>
)

const OuterBoxRaw = styled.div`
    background: linear-gradient(270deg, #3437C7, #3010AC,  #EC008C, #FC6767, #f42c04 );
    background-size: 400% 400%;
    width:25vw;
    max-width:150px;
    height:25vw;
    max-height:150px;
    border-radius:100%;
    display:flex;
    justify-content:center;
    align-items:center
`
const OuterBox = styled(OuterBoxRaw)({
    animation: () => css`${kf} 2s ease infinite`
  })

const InnerBox = styled.div `
    width:calc(100% - 20px);
    height:calc(100% - 20px);
    border-radius:100%;
    background:black;
    display:flex;
    justify-content:center;
    align-items:center;
    color:white;
    font-size:22px;
    font-weight:bold;
`

const kf = keyframes`
    0%{background-position:0% 50%}
    50%{background-position:100% 50%}
    100%{background-position:0% 50%}
`
