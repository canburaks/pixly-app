import React, { useEffect, useState, useContext, useCallback, useMemo, useRef } from "react";
import { useQuery } from '@apollo/react-hooks';
import { COMPLEX_SEARCH } from "../functions/query"
import { GlobalContext } from "../";
import { makeStyles, fade } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ListItem from '@material-ui/core/ListItem';
import InputBase from '@material-ui/core/InputBase';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';


import { 
	FlexBox, NewLink, Box,LogoutIcon, LogoutMutation, Text,CloseIcon,
	CoverLink, SignupFormModal,MoviePosterCard, PlaceHolderCard, Grid,  Button,
	HomeIcon, UsersIcon, SearchIcon as SearchIconStyled, FourSquareIcon,
	SimilarMovieIcon, CameraIcon, LoginIcon, JoinIcon, FilmIcon
} from "../styled-components"
import { useAuthCheck, useValues, useOnClickOutside, useDebounce, useLocation, useWindowSize } from "../functions/hooks";

import { SimpleDialog } from "./Dialog"
import { Loading } from "./Loading"

import "./AppBar.css"
import { rgba } from "polished";

const drawerWidth = 240;
const useStyles = makeStyles(theme => ({
	  appbar:{
		background:"rgba(80,80,80, 0.7)"
	  },
	  listitem:{
        '&:hover': {
			backgroundColor: "rgba(180,180,180,0.4)",
		  },
	  },
      menuButton: {
        marginRight: theme.spacing(2),
      },
      title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
          display: 'block',
        },
      },
      search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
          backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(1),
        marginLeft: theme.spacing(1),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
          marginLeft: theme.spacing(3),
          width: 'auto',
        },
      },
      searchIcon: {
        width: theme.spacing(7),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      inputRoot: {
        color: 'inherit',
      },
      inputInput: {
        padding: theme.spacing(1, 1, 1, 7),
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
          width: "100%",
        },
      },
      sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
          display: 'flex',
        },
      },
      sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('sm')]: {
          display: 'none',
        },
      },
  hide: {
    display: 'none',
  },
  drawer: {
	width: drawerWidth,
	background:"rgba(80,80,80,0.8)",
    flexShrink: 0,
  },
  drawerPaper: {
	background:"transparent",
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
	justifyContent: 'flex-end',
  },
  drawercloseicon:{
	color:"#f1f1f1",
	backgroundColor: "rgba(255,255,255,0.3)",
	'&:hover': {
		backgroundColor: "rgba(255,255,255,0.7)",
	  },
  },
  divider:{
	  background:"rgba(255,255,255,0.15)"
  }
}));


export const SearchAppBar = (props) => {
	const location = useLocation()
	//Globals
	const classes = useStyles();
	const state = useContext(GlobalContext)
    const authStatus = useAuthCheck()

	//Search Bar
	const [ keywords, setKeywords ] = useState("")
	const ref = useRef()
	useOnClickOutside(ref, () => setKeywords(""));
	const debouncedkeywords = useDebounce(keywords, 500);


	const keywordsHandler = useCallback((e) => setKeywords(e.target.value), [keywords])
	const keywordsCleaner = useCallback(() => setKeywords(""))




	//Side Bar Status
	const [open, setOpen] = useState(false);
	
	
	// Right Dropdown
	const [anchorEl, setAnchorEl] = useState(null);
	const isMenuOpen = Boolean(anchorEl);

	// Signup Form Modal Status
	const [isJoinModalOpen, setJoinModal] = useState(false)
	const closeJoinModal = () => setJoinModal(false)

	const insertLoginForm = useCallback(() => state.methods.insertAuthForm("login"),[])
	const insertJoinForm = useCallback(() => setJoinModal(true),[])

	//Callback and Handlers of Navbar
    const handleProfileMenuOpen = event => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleMobileMenuClose = () => setMobileMoreAnchorEl(null);
    const handleMobileMenuOpen = event => setMobileMoreAnchorEl(event.currentTarget);
  
    const handleMenuClose = () => (setAnchorEl(null))
	
    const handleDrawerOpen = () => setOpen(true)
    const handleDrawerClose = () => setOpen(false)



	const menuId = 'primary-search-account-menu';

    const ProfileMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}>
				<AccountCircle />
				<Text>Profile</Text>
				<CoverLink link={`/${localStorage.getItem("USERNAME")}/dashboard`} />
			</MenuItem>
            <MenuItem onClick={handleMenuClose}>
				<LogoutIcon stroke={"#181818"} />
				<LogoutMutation>
					<Text>Logout</Text>
				</LogoutMutation>
			</MenuItem>
        </Menu>
	);

	const AnonymousMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={() => (insertLoginForm(), handleMenuClose())}>
				<LoginIcon  />
				<Text>Login</Text>
			</MenuItem>
            <MenuItem onClick={() => (setJoinModal(true),handleMenuClose())}>
				<JoinIcon  stroke={"#181818"}/>
				Join
			</MenuItem>
        </Menu>
	)

	const RıghtMenu = authStatus ? ProfileMenu : AnonymousMenu
  

	//console.log("props", props)
	useEffect(() => {
		if(open){
			setOpen(false)
		}
	}, [location])


	//console.log(screenSize)
    return (
        <FlexBox className={classes.grow}  position="relative" top={0} left={0} width="100%" id="mui-navbar">
            <AppBar position="static"  classes={{root:classes.appbar, colorDefault:"#000000"}}>
                <Toolbar>
					<Box display={["flex", "flex", "flex", 
						//"none"
						]}>
						<IconButton  mr={["8px"]} 
							edge="start"
							color="inherit"
							aria-label="open drawer"
							onClick={handleDrawerOpen}
						>
							<MenuIcon />
						</IconButton>
					</Box>
                   
				    <NewLink to="/" rel="nofollow" ><Brand /></NewLink>

                    <FlexBox display={["none", "none", "none", "flex"]} flexGrow={[0,0,0,1]} justifyContent="center" >
							<NewLink 
                                color="#f1f1f1 !important" title="Popular and Upcoming Movies"
                                link={"/popular-and-upcoming-movies"} fontSize={["10px", "10px", "12px", "14px"]} 
                                px={[1,1,2]} title="All Movie Collections" fontWeight="bold"
                            >
                                Movies
                            </NewLink>
							<NewLink 
                                color="#f1f1f1 !important" 
                                link={"/lists-of-films"} fontSize={["10px", "10px", "12px", "14px"]} 
                                px={[1,1,2]} title="List of Films Archive" fontWeight="bold"
                            >
                                Film Lists
                            </NewLink>
                            <NewLink 
                                color="#f1f1f1 !important" 
                                link={"/directors/1"} fontSize={["10px", "10px", "12px", "14px"]} 
                                px={[1,1,2]} title="Famous Directors and Their Favourite Films" fontWeight="bold"
                            >
                                Directors
                            </NewLink>
                            <NewLink 
                                color="#f1f1f1 !important" 
                                link={"/similar-movie-finder"} fontSize={["10px", "10px", "12px", "14px"]} 
                                px={[1,1,2]} title="Find Similar Movies" fontWeight="bold"
                            >
                                Similars
                            </NewLink>
                            <NewLink 
                                color="#f1f1f1 !important" 
                                link={"/advance-search"} fontSize={["10px", "10px", "12px", "14px"]} 
                                px={[1,1,2]} title="Browse Movie with Advance Options" fontWeight="bold"
                            >
                                Browse
                            </NewLink>
                        </FlexBox>

						{/* Search */}
						<FlexBox className={classes.search} flexGrow={[1,1,1,0]}>
							<div className={classes.searchIcon}>
								<SearchIcon />
							</div>
							<InputBase
								placeholder="Search…"
								classes={{
									root: classes.inputRoot,
									input: classes.inputInput,
								}}
								inputProps={{ 'aria-label': 'search' }}
								onChange={keywordsHandler}
								value={keywords}
							/>
						</FlexBox>			

                    {/* RIGHT PART*/}
                    <FlexBox>
                        <IconButton
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                    </FlexBox>

                </Toolbar>
            </AppBar>

            {/* DRAWER */}
			<SideBar 
				isOpen={open} 
				onClose={handleDrawerClose} 
				classes={classes} 
				authStatus={authStatus} 
				insertJoinForm={insertJoinForm}	
				insertLoginForm={insertLoginForm}		
			/>
        
		{/* -----------MODALS----------------------------- */}
		{/* Search Results Modal*/}
		{debouncedkeywords.length >2 && 
			<SearchQueryResult 
				keywords={debouncedkeywords} 
				cleaner={keywordsCleaner} 
			/>
			}

        {RıghtMenu}
		<SignupFormModal isOpen={isJoinModalOpen} closeModal={closeJoinModal}  />
      </FlexBox>
    );
  }


const SideBar = ({classes, isOpen, onClose, authStatus, insertLoginForm, insertJoinForm}) => (
	<Drawer
		className={classes.drawer}
		variant="temporary"
		anchor="left"
		open={isOpen}
		onClose={onClose}
		classes={{paper: classes.drawerPaper}}
	>
		<div className={classes.drawerHeader}>
			<IconButton onClick={onClose} classes={{root:classes.drawercloseicon}}>
				<ChevronLeftIcon />
			</IconButton>
		</div>
		<Divider classes={{root:classes.divider}} />
		<List>
		{authStatus 
			?<ListItem classes={{root:classes.listitem}}>
				<HomeIcon fill={"#f1f1f1"} size={"18px"} />
				<Text color="light">Dashboard</Text>
				<CoverLink link={`/${localStorage.getItem("USERNAME")}/dashboard`} />
			</ListItem>

			:<ListItem classes={{root:classes.listitem}} button onClick={() => (onClose(), insertLoginForm())}>
				<LoginIcon stroke={"#f1f1f1"}  size={"18px"} />
				<Text color="light">Login</Text>
			</ListItem>
			}
			<ListItem classes={{root:classes.listitem}} button title="Popular and Upcoming Movies">
				<FilmIcon stroke={"#f1f1f1"} size={"18px"} />
				<Text color="light">Movies</Text>
				<CoverLink link={"/popular-and-upcoming-movies"} />
			</ListItem>
			<ListItem classes={{root:classes.listitem}} button>
				<CameraIcon stroke={"#f1f1f1"} size={"18px"} />
				<Text color="light">Directors</Text>
				<CoverLink link={"/directors/1"} />
			</ListItem>
			<ListItem classes={{root:classes.listitem}} button title="Find Similar Movies">
				<SimilarMovieIcon stroke={"#f1f1f1"}  size={"18px"} />
				<Text color="light">Similar Movie Finder</Text>
				<CoverLink link={"/similar-movie-finder"} />
			</ListItem>
			<ListItem classes={{root:classes.listitem}} button>
				<SearchIconStyled stroke={"#f1f1f1"} size={"18px"} />
				<Text color="light">Advance Search</Text>
				<CoverLink link={"/advance-search"} />
			</ListItem>
			<ListItem classes={{root:classes.listitem}} button>
				<UsersIcon stroke={"#f1f1f1"} size={"18px"} />
				<Text color="light">People</Text>
				<CoverLink link={"/people/1"} />
			</ListItem>

			<Divider classes={{root:classes.divider}} />
			
			<ListItem classes={{root:classes.listitem}} button>
				<FourSquareIcon  stroke={"#f1f1f1"}/>
				<NewLink link={"/lists-of-films"}>
					<Text color="light">Film Lists</Text>
				</NewLink>
			</ListItem>

			{[{text:"Arthouse Movies", link:"/topic/art-house"},
			{text:"Biography Movies", link:"/topic/historical-figures"},
			{text:"Controversial Movies", link:"/topic/controversial-films"},
			{text:"Cyberpunk Movies", link:"/topic/cyberpunk"},
			{text:"Gangster Movies", link:"/topic/gangster-films"},
			{text:"Thought-Provoking", link:"/topic/thought-provoking"},
			{text:"LGBTQ+ Movies", link:"/topic/lgbtq-plus-films"},
			{text:"Rom-Coms", link:"/topic/romantic-comedy-movies"},
			{text:"Mystery Movies", link:"/topic/mystery"}].map(liste => (
				<ListItem classes={{root:classes.listitem}} button key={"- " + liste.text}>
					<NewLink link={liste.link} title={`${liste.text}`}>
						<Text 
							fontSize={["12px", "12px", "12px", "14px"]} 
							pl={[4]} 
							color="light"
						>
							{liste.text}
						</Text>
					</NewLink>
				</ListItem>
			))
			}
		</List>

		<Divider classes={{root:classes.divider}} />
		{authStatus &&
			<ListItem classes={{root:classes.listitem}} button>
				<LogoutIcon stroke={"#f1f1f1"} />
				<LogoutMutation>
					<Text color="light">Logout</Text>
				</LogoutMutation>
			</ListItem>}

		{!authStatus && 
			<>
			<ListItem classes={{root:classes.listitem}} button onClick={() => (onClose(), insertJoinForm())}>
				<JoinIcon  stroke={"#f1f1f1"}/>
				<Text color="light">Join</Text>
			</ListItem>
			</>
		}

		<ListItem classes={{root:classes.listitem}} button>
			<NewLink link={"/blog"}>
				<Text color="light" fontWeight="bold">BLOG</Text>
			</NewLink>
		</ListItem>
		<Box minHeight={"40px"} minWidth="100%"></Box>
		</Drawer>
)


const SearchQueryResult = React.memo(({keywords, cleaner}) => {
	const values = useValues([4,,4, 6,8,10])

	//Dialog Status
	const [open, setOpen] = useState(true);
	

    const { loading, data, error } = useQuery(COMPLEX_SEARCH, {variables:{page:1, keywords, first:(values*2 )- 1} });

    const MoreCard = () => <PlaceHolderCard text="Get More" link={"/advance-search"} state={{keywords}} title="Bring More" />
		
	const handleClose = () => (setOpen(false), cleaner());

	const ModalContent = ({ items, onClose, overitems }) => (
		<Grid 
			columns={[3,4,5,6,6,6, 8]}  
			py={"10px"} px="10px" 
			position="relative" 
			zIndex={100}
			width={"100%"}
			>
			{items.map( item => (
				<MoviePosterCard
					item={item}
					key={item.slug}
					ratio={1.6} 
					width={"100%"}
					fontSize="xs"
					onClick={onClose}
					zIndex={100}
				/>
				))}
			{overitems && <MoreCard />}
		</Grid>
	)

	useEffect(() => {
		if (keywords.length > 2 && open === false){
			setOpen(true)
		}
	},[keywords])
	if (loading) return <Loading />
	if (data) {
		//console.log(data)
        return (
            <SimpleDialog 
				onClose={handleClose} 
				isOpen={open} 
				header={`'${keywords}' Search:${data.complexSearch.quantity} ${data.complexSearch.quantity > 1 ? "movies " : "movie"} found`}
				fullWidth={true}
				maxWidth={"xl"}
			>
				<ModalContent 
					items={data.complexSearch.result} 
					overitems={data.complexSearch.quantity >= 18} 
					onClose={handleClose}
				/>
			</SimpleDialog>
        )}
    else return <div></div>
})  



const Brand = (props) => (
    <svg width={44} height={44} fill="none" {...props}>
    <title>Home Page</title>
    <circle cx={22} cy={22} r={22} fill="url(#prefix__paint0_angular)" />
    <circle cx={22} cy={22} r={20} fill="#000" />
    <path
      d="M10.92 17.52c.79 0 1.504.181 2.144.544.64.352 1.141.853 1.504 1.504.363.65.544 1.392.544 2.224 0 .843-.181 1.59-.544 2.24a3.888 3.888 0 01-1.504 1.52c-.63.352-1.344.528-2.144.528a4.092 4.092 0 01-1.856-.416 3.582 3.582 0 01-1.344-1.248v4.688H6.584v-11.52h1.088v1.664c.341-.555.79-.981 1.344-1.28.565-.299 1.2-.448 1.904-.448zm-.08 7.552c.587 0 1.12-.133 1.6-.4.48-.277.853-.667 1.12-1.168.277-.501.416-1.072.416-1.712 0-.64-.139-1.205-.416-1.696a2.883 2.883 0 00-1.12-1.168 3.14 3.14 0 00-1.6-.416c-.597 0-1.136.139-1.616.416-.47.277-.843.667-1.12 1.168-.267.49-.4 1.056-.4 1.696 0 .64.133 1.21.4 1.712.277.501.65.89 1.12 1.168.48.267 1.019.4 1.616.4zm6.028-7.488h1.136V26h-1.136v-8.416zm.576-1.84a.804.804 0 01-.592-.24.786.786 0 01-.24-.576c0-.213.08-.4.24-.56.16-.16.357-.24.592-.24.234 0 .432.08.592.24.16.15.24.33.24.544 0 .235-.08.432-.24.592a.804.804 0 01-.592.24zM25.964 26l-2.671-3.52L20.605 26h-1.28l3.328-4.32-3.168-4.096h1.28l2.528 3.296 2.528-3.296h1.248L23.9 21.68 27.26 26h-1.296zm2.628-11.872h1.136V26H28.59V14.128zM39.4 17.584l-4.208 9.424c-.341.79-.736 1.35-1.184 1.68-.448.33-.986.496-1.616.496-.405 0-.784-.064-1.136-.192a2.462 2.462 0 01-.912-.576l.528-.848c.427.427.939.64 1.536.64.384 0 .71-.107.976-.32.278-.213.534-.576.768-1.088l.368-.816-3.76-8.4h1.184l3.168 7.152 3.168-7.152h1.12z"
      fill="#fff"
    />
    <defs>
      <radialGradient
        id="prefix__paint0_angular"
        cx={0}
        cy={0}
        r={1}
        gradientUnits="userSpaceOnUse"
        gradientTransform="matrix(0 22 -22 0 22 22)"
      >
        <stop offset={0.104} stopColor="#3437C7" />
        <stop offset={0.24} stopColor="#3D33CC" />
        <stop offset={0.389} stopColor="#5606FF" />
        <stop offset={0.537} stopColor="#4900C0" />
        <stop offset={0.758} stopColor="#3B04AD" />
        <stop offset={0.93} stopColor="#0025A8" />
      </radialGradient>
    </defs>
  </svg>
)
