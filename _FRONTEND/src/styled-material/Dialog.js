import React, { useEffect, useState, useContext, useCallback, useMemo, useRef } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import { blue } from '@material-ui/core/colors';

import { compose, typography, color, space, shadow, layout, border, background, flexbox, position, system, grid } from 'styled-system'
import { styled } from "../styled-components"

const useStyles = makeStyles({
  root: {
		backgroundColor: "rgba(0,0,0,0.25)",
		color: "#f1f1f1",
	},
	paper: {
		backgroundColor: "#181818",
		color: "#f1f1f1",
		padding:"4px 8px",
		margin:0,
		maxWidth: "1000px"
	},

});



export const SimpleDialog = ({header, onClose, isOpen, ...props}) => {
	const classes = useStyles();

	const handleClose = (value) => onClose(value);
	//console.log(header, onClose, isOpen)

	return (
		<Dialog 
			classes={{
				root:classes.root,
				paper:classes.paper,
			}}
			aria-labelledby="simple-dialog-title" 
			open={isOpen}
			onClose={handleClose} 
			{...props}
		>
			{header && <DialogTitle id="simple-dialog-title">{header}</DialogTitle>}
			{props.children}
		</Dialog>
	);
}


