import React from "react";
import { useEffect, useState, useRef, useContext } from "react";
import { Link, withRouter } from "react-router-dom";

import { Mutation } from 'react-apollo'

import { logout } from "../../functions/form";
import { LOGOUT_MUTATION } from "../../functions/mutations";


import { useAuthCheck } from "../../functions/hooks";

import {  SearchBox} from "cbs-react-components"


import { movieAutoComplete } from "../../functions/grec";
import { GlobalContext } from "../../";
import { AuthForm, ForgetForm } from "../../forms/AuthForm"
import { motion, useCycle } from "framer-motion";
import { useDimensions,  Navigation } from "./Elements";


import "./NavBar.css"


export const NavBar = props => {
    const { username, history, isAuthenticated, logoutDispatcher } = props;

    const authStatus = useAuthCheck()

    const state = useContext(GlobalContext)


	const Brand = () => (
            <svg width="80" height="35" viewBox="0 0 45 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.624 7.532C8.5 7.532 9.292 7.736 10 8.144C10.708 8.552 11.26 9.116 11.656 9.836C12.064 10.556 12.268 11.378 12.268 12.302C12.268 13.226 12.064 14.054 11.656 14.786C11.26 15.506 10.708 16.07 10 16.478C9.292 16.874 8.5 17.072 7.624 17.072C6.796 17.072 6.046 16.88 5.374 16.496C4.702 16.1 4.18 15.554 3.808 14.858V20.492H2.908V7.604H3.772V9.818C4.144 9.098 4.666 8.54 5.338 8.144C6.022 7.736 6.784 7.532 7.624 7.532ZM7.57 16.262C8.29 16.262 8.938 16.094 9.514 15.758C10.09 15.422 10.54 14.954 10.864 14.354C11.2 13.754 11.368 13.07 11.368 12.302C11.368 11.534 11.2 10.85 10.864 10.25C10.54 9.65 10.09 9.182 9.514 8.846C8.938 8.51 8.29 8.342 7.57 8.342C6.85 8.342 6.202 8.51 5.626 8.846C5.062 9.182 4.612 9.65 4.276 10.25C3.952 10.85 3.79 11.534 3.79 12.302C3.79 13.07 3.952 13.754 4.276 14.354C4.612 14.954 5.062 15.422 5.626 15.758C6.202 16.094 6.85 16.262 7.57 16.262Z" fill="#F0F0F0"/>
                <path d="M14.908 7.604H15.808V17H14.908V7.604ZM15.358 5.318C15.154 5.318 14.98 5.252 14.836 5.12C14.692 4.976 14.62 4.802 14.62 4.598C14.62 4.394 14.692 4.22 14.836 4.076C14.98 3.932 15.154 3.86 15.358 3.86C15.562 3.86 15.736 3.932 15.88 4.076C16.024 4.208 16.096 4.376 16.096 4.58C16.096 4.784 16.024 4.958 15.88 5.102C15.736 5.246 15.562 5.318 15.358 5.318Z" fill="#F0F0F0"/>
                <path d="M25.884 17L22.662 12.806L19.44 17H18.414L22.14 12.158L18.612 7.604H19.638L22.662 11.51L25.686 7.604H26.694L23.166 12.158L26.946 17H25.884Z" fill="#F0F0F0" fillOpacity="0.9"/>
                <path d="M29.908 3.644H30.808V17H29.908V3.644Z" fill="#F0F0F0" fillOpacity="0.75"/>
                <path d="M42.45 7.604L37.626 18.278C37.266 19.106 36.846 19.694 36.366 20.042C35.898 20.39 35.34 20.564 34.692 20.564C34.26 20.564 33.852 20.492 33.468 20.348C33.096 20.204 32.778 19.994 32.514 19.718L32.964 19.034C33.444 19.526 34.026 19.772 34.71 19.772C35.166 19.772 35.556 19.646 35.88 19.394C36.204 19.142 36.504 18.71 36.78 18.098L37.284 16.964L33.054 7.604H34.008L37.77 16.01L41.532 7.604H42.45Z" fill="#F0F0F0" fillOpacity="0.6"/>
            </svg>
	)
    const SearchBoxTemp = (props) => (
        <SearchBox item={{ image: "poster", text: "name" }}
            query={movieAutoComplete}
            className="my-search-box"
            onClick={(value) => props.history.push(`/movie/${value.slug}`)}
            onSubmit={data => props.history.push(`/movies/search/${data.input}/1`)}
            placeholder=""
            animate
        />
    )
    const ProfilePageLinkTemplate = (props) => (
        <Link className="fbox-r jcc aic mar-x" to={`/${state.username}/dashboard`} rel="nofollow">
            <motion.svg width="24" height="24" whileHover={{ scale: 1.2 }}>
                <rect width="24" height="24" fill="none" rx="0" ry="0"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M17 7C17 9.76142 14.7614 12 12 12C9.23858 12 7 9.76142 7 7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7ZM11 13C6.58172 13 3 16.5817 3 21C3 21 6 22 12 22C18 22 21 21 21 21C21 16.5817 17.4183 13 13 13H11Z" fill="#ffffff"/>
            </motion.svg>
        </Link>
    )

    const LogoutLink = ({ mutation }) => (
        <Link to={"/"} title={"Sign Out"}  className="actions nav-item logout"
            onClick={async () => (await mutation())} title="Sign out"
            >
            Logout
        </Link>
    )
    return (
        <nav id="new-nav">
            <div className="brand-box nav-left pad-l-4x">
                <SideBar />
            </div>
            
            <div className="nav-pages nav-middle">
                <Link id="nav-directors" className="nav-page nav-item" to="/directors/1">Directors</Link>
                <Link id="nav-lists" className="nav-page nav-item" to="/collections" >Collections</Link>
                <Link id="nav-advance-search" className="nav-page nav-item" to="/advance-search" rel="nofollow">Search</Link>

            </div>
                {authStatus 
                    ?   <Mutation
                            mutation={LOGOUT_MUTATION}
                            onCompleted={() => (state.methods.logout())}
                        >{mutation => (
                            <div className="nav-actions nav-right">
                                <SearchBoxTemp {...props} />
                                <ProfilePageLinkTemplate  {...props} />

                                <LogoutLink mutation={mutation} />
                            </div>
                            )}
                        </Mutation>

                :   <div className="nav-actions nav-right">
                        <SearchBoxTemp {...props} />
                        <a className="actions nav-item login" rel="nofollow" onClick={() => state.methods.insertAuthForm("login")}>Sign In</a>
                    </div>
                }



        </nav>
    );
}




/* MENU TOGGLE */

const Path = props => (
    <motion.path
        fill="transparent"
        strokeWidth="3"
        stroke="hsl(0, 0%, 18%)"
        strokeLinecap="round"
        {...props}
    />
);

export const MenuToggle = ({ toggle }) => (
    <button onClick={toggle}>
        <svg width="23" height="23" viewBox="0 0 23 23">
            <Path
                variants={{
                closed: { d: "M 2 2.5 L 20 2.5" },
                open: { d: "M 3 16.5 L 17 2.5" }
                }}
            />
            <Path
                d="M 2 9.423 L 20 9.423"
                variants={{
                closed: { opacity: 1 },
                open: { opacity: 0 }
                }}
                transition={{ duration: 0.1 }}
            />
            <Path
                variants={{
                closed: { d: "M 2 16.346 L 20 16.346" },
                open: { d: "M 3 2.5 L 17 16.346" }
                }}
            />
        </svg>
    </button>
);

export const SideBar = props => {
    const state = useContext(GlobalContext)
    const isOpen = state.isLeftPanelOpen
    const toggleOpen = state.methods.toggleLeftPanel


    const containerRef = useRef(null);
    const { height } = useDimensions(containerRef);

    console.log("sidebar", height)

    return(
        <motion.nav
            initial={false}
            animate={isOpen ? "open" : "closed"}
            custom={height}
            ref={containerRef}
            id="side-nav"
        >
            <motion.div className="background" variants={sidebar} />
                <Navigation />
            <MenuToggle toggle={() => toggleOpen()} />
        </motion.nav>
    )
}
const sidebar = {
    open: (height = 1000) => ({
        clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
        transition: {
            type: "spring",
            stiffness: 20,
            restDelta: 2
        }
    }),
    closed: {
        clipPath: "circle(30px at 40px 40px)",
        transition: {
            delay: 0.5,
            type: "spring",
            stiffness: 400,
            damping: 40
        }
    }
};


/*

*/
