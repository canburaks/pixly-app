import React from "react";
import { useMemo, useState } from 'react';
import {  useWindowSize, useValues } from "../../functions" 
import IR  from 'react-input-range'; // Originally InputRange


import { 
    Box, Text, NewLink, TopPanelBackElement, TopPanelCoverElement,
    DirectorLink, DirectorLinks,FlexBox, TagText,
    LikeMutation,BookmarkMutation, RatingMutation, FollowMutation,
    UsersIcon, EyeIcon,UserIcon,Select, Option,
    Input,
} from "../index"

import "./slider.css"


export const InputRange = (props) => (
    <IR
        minValue={props.min} 
        value={props.value}
        maxValue={props.max} 
        disabled={props.disabled}
        formatLabel={value => `${value}`}
        step={props.step || 1}
        onChange={props.onChange}
        onChangeComplete={props.onChangeComplete} 
        {...props}
    />
)

export const InputText = (props) => (
    <Input
        value={props.value}
        onChange={props.onChange}
        disabled={props.disabled}
        {...props}
    />
)

export const InputSelect = ({options, selected=null, onChange, ...props}) => (
    <Select 
        onChange={onChange}
        value={selected}
        {...props} 
    >
        {options.map((value,i) => (
            <Option key={"options" + i + value} value={value}>
                {value}
            </Option>
        ))}
    </Select>
)