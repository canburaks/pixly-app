import React from 'react'
import { useState, useContext, useMemo, useCallback } from "react"
import { PageContainer, ContentContainer } from "../styled-components"


const B = (props) => <div style={{width:500, height:500, backgroundColor:"yellow"}}>{props.children.slice(0,2)}</div>
const C = (props) => <div style={{width:100, height:100, margin:10, backgroundColor:"blue"}}>{console.log(props)}</div>

const DraftPage = (props) => {

    return(
        <PageContainer>
            <ContentContainer>
                <B>
                    <C/>
                    <C/>
                    <C/>
                    <C/>
                </B>
            </ContentContainer>
        </PageContainer>
    )
}

export default DraftPage