import React from 'react';
import { useState, useCallback } from "react"
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { 
	FlexBox, NewLink, Box,LogoutIcon, LogoutMutation, Text,CloseIcon,
	CoverLink, SignupFormModal,MoviePosterCard, PlaceHolderCard, Grid,  Button,
	HomeIcon, UsersIcon, SearchIcon as SearchIconStyled, FourSquareIcon,
	SimilarMovieIcon, CameraIcon, LoginIcon, JoinIcon, FilmIcon,SubHeaderText
} from "../styled-components"

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  panel:{
      background:"#f1f1f1",
      boxShadow:"0 1px 1px rgba(0,0,0,0.08), " +
                "0 2px 2px rgba(0,0,0,0.12), " +
                "0 4px 4px rgba(0,0,0,0.16), " +
                "0 6px 6px rgba(0,0,0,0.20) "
  }
}));

export const ExpansionBox = React.memo(({isOpen=false, ...props}) => {
  const classes = useStyles();
  const [expanded,setExpanded] = useState(isOpen)
  const panelHandler = useCallback(() => setExpanded(!expanded),[expanded])
  console.log(isOpen)
  return (
    <Box width="100%" my={[3]}>
      <ExpansionPanel
        classes={{root:classes.panel}} 
        expanded={expanded} 
        onChange={panelHandler}
        >
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
            <Box display="flex" flexDirection="column">
                <SubHeaderText fontWeight="bold">{props.header}</SubHeaderText>
                <Text>{props.text}</Text>
            </Box>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          {props.children}
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </Box>
  );
},(p,n) => (p.expanded === n.expanded && p.header === n.header && p.isOpen === n.isOpen))