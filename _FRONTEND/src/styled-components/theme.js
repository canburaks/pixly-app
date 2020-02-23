

/* ----------------------THEME----------------------------------- */
const breakpoints = ["370px",'480px', '736px', '980px', '1280px', "1581px", "2500px"]

// aliases
breakpoints.xs = breakpoints[0]
breakpoints.sm = breakpoints[1]
breakpoints.md = breakpoints[2]
breakpoints.lg = breakpoints[2]
breakpoints.xl = breakpoints[3]
breakpoints.xxl = breakpoints[4]
breakpoints.xxxl = breakpoints[5]
breakpoints.xxxxl = breakpoints[6]

const themes = {default:{}}

themes.default.fonts = {
	primary: 'Helvetica Neue, Helvetica, Roboto, sans-serif',
	header: "'Nunito', sans-serif",
	hammersmith:"'Hammersmith One', sans-serif",
	paragraph: "'Montserrat', sans-serif",
	quote: 'Georgia, serif',
	playfair: "'Playfair Display', serif",
	fira: 	"'Fira Sans', sans-serif",
	marker: "'Permanent Marker', cursive",
	lobster:"'Lobster Two', cursive",
	textme:"'Text Me One', sans-serif"
}

themes.default.fontSizes = {
	xxxs:8,
	xxs:10,
	xs:12,
	s:14,
	m:16,
	l:18,
	xl:22,
	xxl:26,
	xxxl:30,
	large:44,
	huge:64,
}

themes.default.colors = {
	black: '#000e1a',
	white: '#fff',
	light: "#f1f1f1",
	lightDark1: "#dadada",
	lightDark2: "#cacaca",
	dark:  "#181818",
	transparent:"transparent",

	blue:"#3437c7",
	blue2: "#3633CC",
	blue3:"#3D33CC",

	pink: "#fc2f70",
	
	accent1:  '#3437c7',
	accent2: "#f42c04",
	active: '#3437c7',

	green: "#30c5b1",
	shark: "#21292d",

	error:"#db2829",
	warning: "#f2c037",
	success: "#38ba45",
}



themes.default.space  = [0, 4, 8, 16, 32, 64, 128, 256, 512]
themes.default.sizes  = [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48,52]

themes.default.breakpoints  = breakpoints
themes.default.transitions  = {
	fast:"all 0.15s ease-in-out",
	medium:"all 0.35s ease-in-out",
	slow:"all 0.95s ease-in-out"

}


themes.default.shadows = {

	light:"0px 2px 4px rgba(255, 255, 255, 1)",
	dark: "-1px 1px 1px rgba(20, 20, 20, 0.87)",

	textDark: "-1px 2px 2px rgba(0, 0, 0, 0.8);",
	textGray:"-1px 2px 2px rgba(120, 120, 120, 0.8);",
	textLight:"-1px 2px 2px rgba(255, 255, 255, 0.8);",

	mini2: "2px 2px 4px -2px rgba(40,40,40, 0.45);",
	mini: "0px 2px 6px rgba(6, 28, 63, 0.15);",
	//small:"rgba(40, 40, 40, 0.45) 0px 1px 5px, " +
	//		"rgba(50, 50, 50, 0.05) 0px 1px 10px, " + 
	//		"rgba(60, 0, 100, 0.08) 0px 20px 30px",
	xxs: "0 4px 4px -4px rgba(40,40,40, 0.4)",
	xs: "8px 10px 9px -8px rgba(0, 0, 0, 0.37)",

	small: "8px 30px 29px -8px rgba(0, 0, 0, 0.37)",

	//hover: "0 20px 19px -2px rgba(0, 0, 0, 0.5)",

	medium:"0px 15px 29px -8px rgba(0, 0, 0, 0.67)",
	large: "0px 30px 69px 8px rgba(0, 0, 0, 0.77)",

	duo:"0px 10px 49px 8px rgba(0, 0, 0, 0.77), " + 
		"0 15px 30px -8px rgba(255,255,255, 0.07)", 


	mosaic: "8px 0px 9px -2px rgba(0, 0, 0, 0.57)",

	diffuse: "2px  1px 1px rgba(0,0,0,0.12), " + 
			 "-2px 2px 2px rgba(0,0,0,0.12), " + 
			 "0    4px 8px rgba(0,0,0,0.16), " + 
			 "0    8px 16px rgba(0,0,0,0.20);",

	diffuse2:"0 1px 1px rgba(0,0,0,0.08), " +
			"0 2px 2px rgba(0,0,0,0.12), " +
			"0 4px 4px rgba(0,0,0,0.16), " +
			"0 6px 6px rgba(0,0,0,0.20) " ,
	
	crew:"0 1px 1px rgba(0,0,0,0.08), " +
			"0 2px 2px rgba(0,0,0,0.12), " +
			"0 4px 4px rgba(0,0,0,0.16), " +
			"0 6px 6px rgba(0,0,0,0.20) " ,

	diffuse3:"0 1px 1px rgba(0,0,0,0.18), " +
			"0 2px 2px -4px rgba(0,0,0,0.20), " +
			"0 3px 4px -4px rgba(0,0,0,0.24), " +
			"0 4px 6px -4px rgba(0,0,0,0.26) " ,


	latest:"0 6.8px 17.5px rgba(0, 0, 0, 0.07), " +
		   "0 54px 140px rgba(0, 0, 0, 0.035)",

	hover: "0 12px 16px -4px rgba(0,0,0, 0.7)",
	crewHover: "0 12px 16px -6px rgba(0,0,0, 0.15)",
	soft:"0px 20px 40px rgba(0, 0, 0, 0.15)",

	minicard:"0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
	//hover:  "0 1px 1px   rgba(0, 0, 0,   0.22), " +
	//		"0 2px 2px   rgba(0, 0, 0,   0.22), " + 
	//		"0 4px 4px   rgba(0, 0, 0,   0.22), " + 
	//		"0 8px 8px   rgba(0, 0, 0, 0.22), " + 
	//		"0 16px 16px rgba(0, 0, 0, 0.22), " + 
	//		"0 32px 32px rgba(0, 0, 255, 0.12)" 
}
themes.default.shadows.card = themes.default.shadows.diffuse2

themes.default.gradients = {
	bottomdark:{
		colors: ["rgba(255,255,255, 0.01) 0%", "rgba(255,255,255, 0.01) 50%","rgba(0,0,0, 0.37) 100%"],
		direction: "to bottom",
		fallback: "rgba(0,0,0, 0.1)",
	},
	blue:{
		colors: ["rgba(0,116,217,1) 0%", "rgba(0,65,122,1) 100%"],
		direction: "to bottom",
		fallback: "rgba(0,116,217,1)",
	},
	navy:{
		colors: ["rgba(0,32,63,1) 0%", "rgba(0,10,20,1) 100%"],
		direction: "to bottom",
		fallback: "rgba(0,32,63,1)",
	},
	teal:{
		colors: ["rgba(57,204,204,1) 0%", "rgba(34,122,122,1) 100%"],
		direction: "to bottom",
		fallback: "rgba(57,204,204,1)",
	},
	lime:{
		colors: ["rgba(1,255,111,1) 0%", "rgba(2,163,72,1) 100%"],
		direction: "to bottom",
		fallback: "rgba(1,255,111,1)",
	},
	yellow:{
		colors: ["rgba(255,221,0,1) 0%", "rgba(184,147,0,1) 100%"],
		direction: "to bottom",
		fallback: "rgba(255,221,0,1)",
	},
	orange:{
		colors: ["rgba(255,133,27,1) 0%", "rgba(255,80,27,1) 100%"],
		direction: "to bottom",
		fallback: "rgba(255,133,27,1)",
	},
	red:{
		colors: ["rgba(246,46,36,1) 0%", "rgba(255,54,121,1) 100%"],
		direction: "to bottom",
		fallback: "rgba(246,46,36,1)",
	},
	fuschia:{
		colors: ["rgba(240,18,188,1) 0%", "rgba(163,11,128,1) 100%"],
		direction: "to bottom",
		fallback: "rgba(240,18,188,1)",
	},
	purple:{
		colors: ["rgba(176,13,201,1) 0%", "rgba(107,7,122,1) 100%"],
		direction: "to bottom",
		fallback: "rgba(176,13,201,1)",
	},
	maroon:{
		colors: ["rgba(204,31,115,1) 0%", "rgba(133,20,75,1) 100%"],
		direction: "to bottom",
		fallback: "rgba(204,31,115,1)",
	},
	pinkish:{
		colors: ["#FF4B2B 0%", "#FF416C 100%"],
		direction: "to bottom",
		fallback: "#FF416C",
	},
	blueish:{
		colors: ["#3437c7 0%", "#4b55e1 100%"],
		direction: "to bottom",
		fallback: "#3437c7",
	},
	purplish:{
		colors: ["#ed145b 0%", "#7b31f4 100%"],
		direction: "to bottom",
		fallback: "#7b31f4",
	},
	sun:{
		colors: ["#FCCF31 10%", "#F55555 100%"],
		direction: "to bottom",
		fallback: "#F55555",
	},
}
export default themes