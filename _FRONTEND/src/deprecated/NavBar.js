import React, { useState, useContext } from "react";
import { Link, Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { Mutation } from 'react-apollo'

import { logout } from "../functions/form";
import { LOGOUT_MUTATION } from "../functions/mutations";

import SearchBar from "./forms/Search"
import { print } from "../functions/lib"
import { useAuthCheck } from "../functions/hooks";

import { NavBar as NB, NavLink, SearchBox, CircularProgress, Dropdown, Popup } from "cbs-react-components"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt, faSignInAlt, faUser, faHome } from '@fortawesome/free-solid-svg-icons'


import "./NavBar.css";

import { movieAutoComplete } from "../functions/grec";
import { GlobalContext } from "../App";
import { AuthForm, ForgetForm } from "../forms/AuthForm"

const NavBar = props => {
	const { username, history, isAuthenticated, logoutDispatcher } = props;
	const authStatus = useAuthCheck()

	const [search, setSearch] = useState("");
	const state = useContext(GlobalContext)
	let points = state.points;


	//Updating Points
	//const [points, setPoints] = useState(state.points);
	//const dispatchPoints = (value) => setPoints(value)
	//pointObserver.subscribe(dispatchPoints)
	//if have more than 40 make it mod 20 
	function calculateProgressbarMax(points){
		if (points<40) return 40
		else{
			const mod20 = points % 20;
			if (mod20===0) return points + 20
			else return points + ( 20 - mod20)
		}
	}
	const progressbarMaxValue = calculateProgressbarMax(points)
	const progressbarTooltip = (points)=>{
		if (points<40){
			return (
			<ul>
				<li>You have {points} points. Every rating is a point</li>
			</ul>)
		}
	}


	const logOut = () => {
		props.history.push("/")
		//await logoutDispatcher(async () => await sleep(2000));
		logout();
		//return <Redirect to="/" />;

	};

	const clickHandler = (movie) => props.history.push(`/movies/${movie.id}`)
	
	const Brand = () => (
		<p className="brand-pixly">
			pi
            <span className="brand-span-1">x</span>
			<span className="brand-span-2">l</span>
			<span className="brand-span-3">y</span>
		</p>
	)

	return (
		<NB fixed>
			<NavLink brand>
				<Link to="/"><Brand /></Link>
			</NavLink>

			<NavLink className="navbar-item-link">
				<Link to="/directors/all/1">Directors</Link>
			</NavLink>

			<NavLink className="navbar-item-link">
				<Link to="/lists/board">Lists</Link>
			</NavLink>

			<NavLink className="navbar-item-link" title="Recent Movies">
				<Link to="/movies/1">Movies</Link>
			</NavLink>
			{/*<NavLink className="navbar-item-link">
				<Link to="/discover/search/1">Search</Link>
	</NavLink>*/}
			
			{/*<NavLink className="navbar-item-link" right>
				{authStatus 
					? <Popup side="bottom" text={progressbarTooltip(points)}>
						<CircularProgress
							value={points}
							max={40}
							full={points > 40}
							size={40}
							strokeWidth={12}
							stroke={points > 40 ? "var(--active-color)" : "var(--color-orange)"}
							//spectrum={{start:215, stop:240}}
							baseStroke={"rgb(240, 240, 240)"}
							fill={"rgb(40, 40, 40)"}
							textColor={"rgb(255, 255, 255)"}
							fontSize={14}
							fontWeight={600}
							onlyvalue
							/>
						</Popup>
					: <div></div>	
				}
			</NavLink>*/}
			<NavLink className={!authStatus ? "navbar-item-link" : "hidden"} right title="Login" >
				{!authStatus
					? <FontAwesomeIcon icon={faSignInAlt} size={"sm"} className="nav-icon-drop f-icon" 
							onClick={() => state.methods.insertAuthForm("login")} />
					: <div className="hidden"></div>
				}
			</NavLink>
			<NavLink className="navbar-item-link" right>
				{authStatus
					? <Mutation
						mutation={LOGOUT_MUTATION}
						onCompleted={() => (state.methods.logout())}
					>{mutation => (
						<Link to={"/"} title={"Sign Out"} onClick={async () => (await mutation())} title="Sign out">
							<FontAwesomeIcon icon={faSignOutAlt} size={"sm"} className="nav-icon-drop f-icon" />
							</Link>)}
					</Mutation>

					: <div></div>
				}
			</NavLink>

			<NavLink className="navbar-item-link" search>
				<SearchBox
					item={{ image: "poster", text: "name" }}
					query={movieAutoComplete}
					className="my-search-box"
					onClick={(value) => props.history.push(`/movie/${value.id}`)}
					onSubmit={data => props.history.push(`/movies/search/${data.input}/1`)}
					animate
					/>
			</NavLink>

		</NB>
	);
}

const mapStateToProps = state => {
	return {
		isAuthenticated: state.auth.isAuthenticated,
		username: state.auth.username,
		points: state.client.points
	};
};

const mapDispatchToProps = dispatch => {
	return {
		logoutDispatcher: () => dispatch({ type: "LOGOUT_SUCCESSFUL" })
	};
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(NavBar)
);