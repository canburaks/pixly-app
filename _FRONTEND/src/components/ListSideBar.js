import React, { useState, useRef } from "react";
import { withRouter, Link } from "react-router-dom";

import { Button, Header, Icon, Image, Menu,  Segment,  Sidebar } from "semantic-ui-react";

const ListSideBar = props => {

	const { visible, content, close,linkName, link  } = props;

	//console.log("Sidebar props",props)
	//console.log("Sidebar content", content)

  	return (
		<Sidebar.Pushable as={"div"}>
			<Sidebar
				as={Menu}
				animation="push"
				icon="labeled"
				className="bor-r-w1 bor-color-light hauto"
				inverted
				vertical
				visible={visible}
				width="custom"
			>
				<div className="fbox-c jcfs aic hauto zin-50 pos-r">
					<div 
						onClick={close} 
						className="click box-shadow hover-t-underline t-color-light pos-a-tr  bgc-dark t-bold   pad-3x mar-t-3x mar-r-4x zin-100 bor-rad-circle">
						Close
					</div>

						{visible &&
							<div style={{ position: "absolute", bottom: "10vh" }}
								className="click box-shadow hover-t-underline t-color-light  bgc-dark t-bold   pad-4x mar-t-3x mar-l-4x zin-100 bor-rad-4x">
								<Link to={link}>
									{linkName}
								</Link>
							</div>}

					{/* CONTENT OF SIDEBAR WILL BE HERE */}
					<div className="sidebar-content w100 h100 ">
						{content}
					</div>



				</div>
			</Sidebar>

			<Sidebar.Pusher>
				{props.children}
			</Sidebar.Pusher>

		</Sidebar.Pushable>
  );
};

export default ListSideBar;
