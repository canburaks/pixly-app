import React, { useEffect, useState, useContext } from "react";
import "./Footer.css"
import { GlobalContext } from "../";
import {  HiddenText, PinterestIcon, TumblrIcon, NewLink, Box } from "../styled-components"

const Footer = (props) =>{
    return(
        <Box className="footer">
            <NewLink 
                position="absolute" left={20} 
                fontWeight="bold" hoverColor="white"
                link={"/blog"}
            
            >
                BLOG
            </NewLink>
            {/*
            <a href="https://twitter.com/pixlymovie" className="twitter-follow-button" data-show-count="false">Follow @pixlymovie</a>
            */}

            <PixlyTwitterIcon />
        </Box>
    )
}

const PixlyTwitterIcon = () => {
    const state = useContext(GlobalContext)
    const anchorRelationship = (window.location.pathname === "" || window.location.pathname === "/") 
        ?  "" 
        : "noopener nofollow noreferrer"
    return(
    <div className="footer-twitter " >
        <a 
            target="_blank"
            data-flip-widget="ico" 
            href="https://flipboard.com/@pixlymovies?utm_campaign=tools&utm_medium=follow&action=follow"
        >
            <img 
            src="https://cdn.flipboard.com/badges/flipboard_srsw.png" 
            alt="Flipboard" 
            />
        </a>

        <a target="_blank" rel={anchorRelationship} href="https://twitter.com/pixlymovie" className="footer-link fbox-r jcfs aic">
            <svg 
                aria-hidden="true" focusable="false" className="f-icon svg-inline--fa fa-twitter fa-w-16"
                role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
            >
                <title>"@pixlymovie"</title>
                <path fill="currentColor" d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"></path>
            </svg>
            <HiddenText>Pixly Twitter</HiddenText>
        </a>
        <a target="_blank"
            rel="noopener nofollow"
            href="https://twitter.com/pixlymovie"
            className=""
        >
    </a>
        {/*
    */}

        <a target="_blank" rel={anchorRelationship} href="https://facebook.com/pixlymovie" className="footer-link fbox-r jcfs aic">
            <svg
                aria-hidden="true" focusable="false" 
                className="svg-inline--fa fa-facebook-square fa-w-14 f-icon"
                role="img" xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512" 
            >
                <title>"https://facebook.com/pixlymovie"</title>
                <path fill="currentColor" d="M400 32H48A48 48 0 0 0 0 80v352a48 48 0 0 0 48 48h137.25V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.27c-30.81 0-40.42 19.12-40.42 38.73V256h68.78l-11 71.69h-57.78V480H400a48 48 0 0 0 48-48V80a48 48 0 0 0-48-48z"></path>
            </svg>
            <HiddenText>Pixly Facebook</HiddenText>
        </a>
        <a target="_blank" rel={anchorRelationship} href="https://www.instagram.com/pixlymovie" className="footer-link fbox-r jcfs aic">
            <svg aria-hidden="true" focusable="false" className="svg-inline--fa fa-instagram fa-w-14 f-icon"
                role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"
                >
                <title>"@pixlymovie"</title>
                <path fill="currentColor" d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path>
            </svg>
            <HiddenText>Pixly instagram</HiddenText>
        </a>

        <a target="_blank" rel={anchorRelationship} href="https://pixlymovies.tumblr.com/" className="footer-link fbox-r jcfs aic">
            <svg width="40" height="40"  className="svg-inline--fa  f-icon"
                viewBox="0 0 24 24" 
                fill="#f1f1f1"
            >
                <path d="M20 0a4 4 0 0 1 4 4v16a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4h16zm-7.38 5H10.6c-.1.72-.26 1.32-.5 1.78-.25.47-.57.87-.97 1.2-.35.3-.9.53-1.4.7l-.22.07v1.99h1.95v4.9c0 .65.07 1.14.2 1.47.14.34.39.66.74.96a4.49 4.49 0 0 0 2.83.93 7.28 7.28 0 0 0 2.98-.63l.3-.13v-2.21c-.72.46-1.44.69-2.17.69-.4 0-.76-.1-1.08-.28a1.3 1.3 0 0 1-.55-.6 3.14 3.14 0 0 1-.08-.92v-4.18h3.32v-2.5h-3.32V5z"/>
            </svg>
            <HiddenText>Pixly Tumblr</HiddenText>
        </a>

        <a target="_blank" rel={anchorRelationship} href="https://www.pinterest.com/pixlymovie/" className="footer-link fbox-r jcfs aic">
        <svg
            aria-hidden="true"
            data-prefix="fab"
            data-icon="pinterest-square"
            viewBox="0 0 448 512"
        >
            <path
            fill="currentColor"
            d="M448 80v352c0 26.5-21.5 48-48 48H154.4c9.8-16.4 22.4-40 27.4-59.3 3-11.5 15.3-58.4 15.3-58.4 8 15.3 31.4 28.2 56.3 28.2 74.1 0 127.4-68.1 127.4-152.7 0-81.1-66.2-141.8-151.4-141.8-106 0-162.2 71.1-162.2 148.6 0 36 19.2 80.8 49.8 95.1 4.7 2.2 7.1 1.2 8.2-3.3.8-3.4 5-20.1 6.8-27.8.6-2.5.3-4.6-1.7-7-10.1-12.3-18.3-34.9-18.3-56 0-54.2 41-106.6 110.9-106.6 60.3 0 102.6 41.1 102.6 99.9 0 66.4-33.5 112.4-77.2 112.4-24.1 0-42.1-19.9-36.4-44.4 6.9-29.2 20.3-60.7 20.3-81.8 0-53-75.5-45.7-75.5 25 0 21.7 7.3 36.5 7.3 36.5-31.4 132.8-36.1 134.5-29.6 192.6l2.2.8H48c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48h352c26.5 0 48 21.5 48 48z"
            />
        </svg>
        <HiddenText>Pixly Pinterest</HiddenText>
        </a>

        <div className="footer-link fbox-r jcfs aic">
            <svg 
                aria-hidden="true" focusable="false" onClick={() => state.methods.insertContactForm()}
                className={`f-icon svg-inline--fa fa-envelope fa-w-16 click`}
                role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path fill="currentColor" d="M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.7V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.6c0-5 5.7-7.8 9.7-4.7 22.4 17.4 52.1 39.5 154.1 113.6 21.1 15.4 56.7 47.8 92.2 47.6 35.7.3 72-32.8 92.3-47.6 102-74.1 131.6-96.3 154-113.7zM256 320c23.2.4 56.6-29.2 73.4-41.4 132.7-96.3 142.8-104.7 173.4-128.7 5.8-4.5 9.2-11.5 9.2-18.9v-19c0-26.5-21.5-48-48-48H48C21.5 64 0 85.5 0 112v19c0 7.4 3.4 14.3 9.2 18.9 30.6 23.9 40.7 32.4 173.4 128.7 16.8 12.2 50.2 41.8 73.4 41.4z"></path>
            </svg>
        </div>

    </div>
    )
}


export default Footer;