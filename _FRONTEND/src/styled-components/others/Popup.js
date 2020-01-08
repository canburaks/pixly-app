import React from "react"
import { useState, useCallback, useMemo } from "react"

import {  styled, linearGradientAnimationKeyframe, Text, HeaderMini, HeaderText, SubHeaderText } from "../"
import { themeGet } from '@styled-system/theme-get'

import { linearGradient, backgrounds, backgroundImages, setLightness } from 'polished'
import { generateGradient } from "../../functions/"
import "./Popup.css"

export const Popup = (props) => {
    const [ show, setShow ] = useState(false)
    const spanclassname = useMemo(() => show ? "popuptext show" : "popuptext",[show])
    const toggle = useCallback(() => setShow(!show),[show])

    return(
        <div className="popup" onClick={toggle}>
            {props.Text}
            {/*<TextElement underline>{props.text}</TextElement>*/}
            <span className={spanclassname} id="myPopup">
                {show && props.children}
            </span>
        </div>
    )
}

