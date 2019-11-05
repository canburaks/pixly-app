import React, { useState } from "react";
import {  styled, Button, ImageButton, Image } from "../../styled-components"
import {  typography, color, space, shadow, layout, border, background, flexbox, position } from 'styled-system'
import { LoginButton } from 'react-facebook';
import { Initialize } from 'react-facebook';


export const AuthButton = (props) => (
  	<FbookAuthButton  
		width={"auto"}
		mx={[1]} p={0} 
		scope="email"
		{...props}
	>
        <FacebookContinueSvg />
    </FbookAuthButton>
)
export const ConnectButton = (props) => (
    <FbookAuthButton  
        width={"auto"}
        mx={[1]} p={0} 
        scope="email"
        {...props}
    >
        <FacebookConnectSvg />
    </FbookAuthButton>
)
export const LogoutButton = (props) => (
    <Button 
        bg="transparent" 
        width={"auto"}
        mx={[1]} p={0}
        {...props}
    >   
        <FacebookLogoutSvg />
    </Button>
)

export const Init = ({Child ,...props}) =>(
    <Initialize>
    {({isReady, api }) => {
        console.log("init", isReady, api)
        console.log("initialize fb script", window.FB)
        if (isReady !== true) return <div></div>
    }}
        <Child {...props} />
    </Initialize>
)

const FacebookContinueSvg = (props) => (
    <SvgFb width={233} height={30} fill="none" {...props}>
    <path
      d="M16.738 28.5l-2.116-27H218c7.456 0 13.5 6.044 13.5 13.5s-6.044 13.5-13.5 13.5H16.738z"
      stroke="#3a67af"
      fill="#3a67af"
      strokeWidth={3}
      className="fb-svg-border"
    />
    <path
      d="M48.702 16.685c-.077 1.07-.474 1.914-1.19 2.529-.71.615-1.649.923-2.816.923-1.276 0-2.28-.429-3.014-1.285-.73-.862-1.094-2.042-1.094-3.542v-.608c0-.957.169-1.8.506-2.53.337-.728.818-1.287 1.442-1.674.629-.392 1.358-.588 2.188-.588 1.148 0 2.073.308 2.775.923s1.107 1.479 1.217 2.59h-2.051c-.05-.642-.23-1.107-.54-1.394-.305-.291-.772-.437-1.401-.437-.684 0-1.197.246-1.538.738-.338.488-.51 1.246-.52 2.276v.752c0 1.076.162 1.862.485 2.359.328.497.843.745 1.545.745.634 0 1.105-.144 1.415-.43.315-.292.495-.741.54-1.347h2.051zm1.61-.452c0-.733.14-1.387.423-1.962a3.108 3.108 0 011.217-1.333c.533-.314 1.15-.471 1.853-.471.998 0 1.811.305 2.44.916.633.61.987 1.44 1.06 2.488l.013.506c0 1.135-.317 2.046-.95 2.734-.633.684-1.483 1.026-2.55 1.026-1.066 0-1.918-.342-2.556-1.026-.634-.683-.95-1.613-.95-2.789v-.089zm1.975.144c0 .702.132 1.24.396 1.613.265.37.643.554 1.135.554.479 0 .852-.182 1.121-.547.27-.37.404-.957.404-1.764 0-.688-.135-1.221-.404-1.6-.269-.378-.647-.567-1.134-.567-.484 0-.857.19-1.122.568-.264.373-.396.954-.396 1.743zm8.766-3.773l.062.854c.529-.66 1.237-.991 2.126-.991.784 0 1.367.23 1.75.69.383.46.579 1.149.588 2.065V20h-1.976v-4.73c0-.42-.091-.723-.273-.91-.183-.191-.486-.287-.91-.287-.555 0-.972.237-1.25.711V20h-1.976v-7.396h1.86zm9.095-1.819v1.818h1.265v1.45h-1.265v3.691c0 .274.052.47.157.588s.305.178.602.178c.218 0 .412-.016.58-.048v1.497a4.067 4.067 0 01-1.196.178c-1.385 0-2.091-.7-2.119-2.099v-3.985h-1.08v-1.45h1.08v-1.818h1.976zM75.298 20h-1.982v-7.396h1.982V20zm-2.099-9.31c0-.297.098-.54.294-.732.2-.191.472-.287.814-.287.337 0 .606.096.806.287.201.191.301.435.301.732 0 .3-.102.546-.307.738-.2.191-.467.287-.8.287s-.602-.096-.807-.287a.975.975 0 01-.3-.738zm6.251 1.914l.062.854c.528-.66 1.237-.991 2.126-.991.783 0 1.367.23 1.75.69.382.46.578 1.149.588 2.065V20H82v-4.73c0-.42-.091-.723-.273-.91-.183-.191-.486-.287-.91-.287-.556 0-.973.237-1.25.711V20H77.59v-7.396h1.86zm11.16 6.644c-.488.593-1.163.889-2.024.889-.793 0-1.4-.228-1.819-.684-.414-.456-.626-1.123-.635-2.003v-4.846h1.975v4.778c0 .77.351 1.155 1.053 1.155.67 0 1.13-.232 1.38-.697v-5.236h1.983V20h-1.86l-.054-.752zm7.508.889c-1.085 0-1.969-.333-2.653-.998-.679-.666-1.018-1.552-1.018-2.66v-.19c0-.744.143-1.407.43-1.99a3.142 3.142 0 011.217-1.354c.529-.319 1.13-.478 1.805-.478 1.012 0 1.807.319 2.386.957.583.638.875 1.543.875 2.714v.806h-4.71c.064.483.255.87.574 1.162.324.292.732.438 1.224.438.76 0 1.355-.276 1.784-.827l.971 1.087a3 3 0 01-1.204.984 3.98 3.98 0 01-1.681.349zm-.226-6.07c-.392 0-.71.132-.957.396-.241.264-.396.643-.465 1.135h2.748v-.158c-.009-.437-.127-.774-.355-1.011-.228-.242-.552-.363-.97-.363zm15.715 3.247l.97-4.71h1.908L114.598 20h-1.654l-1.402-4.655L110.141 20h-1.648l-1.886-7.396h1.907l.964 4.703 1.353-4.703h1.429l1.347 4.71zM120.254 20h-1.983v-7.396h1.983V20zm-2.099-9.31c0-.297.098-.54.294-.732.201-.191.472-.287.814-.287.337 0 .606.096.806.287a.966.966 0 01.301.732c0 .3-.102.546-.308.738-.2.191-.467.287-.799.287-.333 0-.602-.096-.807-.287a.977.977 0 01-.301-.738zm6.798.095v1.819h1.265v1.449h-1.265v3.691c0 .274.052.47.157.588.105.119.305.178.602.178.218 0 .412-.016.581-.048v1.497a4.07 4.07 0 01-1.197.178c-1.385 0-2.091-.7-2.119-2.099v-3.985h-1.08v-1.45h1.08v-1.818h1.976zm4.993 2.625c.524-.629 1.183-.943 1.975-.943 1.605 0 2.418.932 2.441 2.796V20h-1.976v-4.683c0-.423-.091-.736-.273-.936-.182-.205-.485-.308-.909-.308-.579 0-.998.223-1.258.67V20h-1.976V9.5h1.976v3.91zm16.911 2.523h-3.938V20h-2.051v-9.953h6.481v1.661h-4.43v2.57h3.938v1.655zM153.162 20a2.198 2.198 0 01-.198-.663c-.479.533-1.101.8-1.866.8-.725 0-1.327-.21-1.805-.63a2.027 2.027 0 01-.711-1.585c0-.784.289-1.385.868-1.805.584-.42 1.424-.631 2.523-.636h.909v-.423c0-.342-.089-.616-.267-.82-.173-.206-.449-.308-.827-.308-.333 0-.595.08-.786.239-.187.16-.28.378-.28.656h-1.976c0-.428.132-.825.397-1.19.264-.364.638-.649 1.121-.854a4.046 4.046 0 011.627-.314c.911 0 1.633.23 2.167.69.537.456.806 1.098.806 1.928v3.206c.005.702.103 1.233.294 1.593V20h-1.996zm-1.634-1.374c.292 0 .561-.064.807-.191.246-.133.428-.308.547-.527v-1.271h-.738c-.989 0-1.516.342-1.58 1.025l-.006.116a.79.79 0 00.259.609c.174.16.411.239.711.239zm8.63-.082c.365 0 .661-.1.889-.3.228-.201.346-.468.355-.8h1.853a2.562 2.562 0 01-.41 1.38 2.733 2.733 0 01-1.108.97c-.465.229-.98.343-1.545.343-1.057 0-1.891-.335-2.502-1.005-.61-.675-.916-1.604-.916-2.79v-.13c0-1.138.303-2.048.909-2.727.607-.679 1.438-1.018 2.496-1.018.925 0 1.665.264 2.221.793.561.524.846 1.223.855 2.098h-1.853c-.009-.382-.127-.692-.355-.93-.228-.24-.529-.362-.903-.362-.46 0-.809.169-1.046.506-.232.333-.348.875-.348 1.627v.205c0 .761.116 1.308.348 1.64.233.334.586.5 1.06.5zm8.329 1.593c-1.085 0-1.969-.333-2.652-.998-.679-.666-1.019-1.552-1.019-2.66v-.19c0-.744.144-1.407.431-1.99a3.14 3.14 0 011.216-1.354c.529-.319 1.131-.478 1.805-.478 1.012 0 1.807.319 2.386.957.583.638.875 1.543.875 2.714v.806h-4.71c.064.483.255.87.574 1.162.324.292.732.438 1.224.438.761 0 1.356-.276 1.784-.827l.971 1.087c-.297.419-.698.747-1.203.984a3.983 3.983 0 01-1.682.349zm-.226-6.07c-.392 0-.711.132-.957.396-.241.264-.396.643-.465 1.135h2.749v-.158c-.01-.437-.128-.774-.356-1.011-.228-.242-.551-.363-.971-.363zm11.761 2.303c0 1.185-.253 2.11-.759 2.775-.506.661-1.212.992-2.119.992-.802 0-1.442-.308-1.921-.923l-.089.786h-1.777V9.5h1.975v3.767c.456-.534 1.055-.8 1.798-.8.903 0 1.609.333 2.119.998.515.66.773 1.593.773 2.796v.11zm-1.976-.143c0-.748-.118-1.292-.355-1.634-.237-.347-.59-.52-1.06-.52-.629 0-1.062.258-1.299.773v2.919c.242.52.679.779 1.313.779.638 0 1.057-.314 1.258-.943.095-.301.143-.76.143-1.374zm3.592.006c0-.733.141-1.387.424-1.962a3.104 3.104 0 011.217-1.333c.533-.314 1.15-.471 1.852-.471.998 0 1.812.305 2.44.916.634.61.987 1.44 1.06 2.488l.014.506c0 1.135-.317 2.046-.95 2.734-.634.684-1.484 1.026-2.55 1.026-1.067 0-1.919-.342-2.557-1.026-.633-.683-.95-1.613-.95-2.789v-.089zm1.975.144c0 .702.133 1.24.397 1.613.264.37.643.554 1.135.554.478 0 .852-.182 1.121-.547.269-.37.403-.957.403-1.764 0-.688-.134-1.221-.403-1.6-.269-.378-.647-.567-1.135-.567-.483 0-.857.19-1.121.568-.264.373-.397.954-.397 1.743zm6.641-.144c0-.733.141-1.387.424-1.962a3.104 3.104 0 011.217-1.333c.533-.314 1.15-.471 1.852-.471.998 0 1.812.305 2.441.916.633.61.986 1.44 1.059 2.488l.014.506c0 1.135-.317 2.046-.95 2.734-.634.684-1.484 1.026-2.55 1.026-1.067 0-1.919-.342-2.557-1.026-.633-.683-.95-1.613-.95-2.789v-.089zm1.975.144c0 .702.133 1.24.397 1.613.264.37.643.554 1.135.554.478 0 .852-.182 1.121-.547.269-.37.403-.957.403-1.764 0-.688-.134-1.221-.403-1.6-.269-.378-.647-.567-1.135-.567-.483 0-.857.19-1.121.568-.264.373-.397.954-.397 1.743zm9.635.656l-.711.711V20h-1.975V9.5h1.975v5.817l.383-.492 1.893-2.222h2.373l-2.673 3.083L206.034 20h-2.27l-1.9-2.967z"
      fill="#FFFFFF"
      className="fb-svg-text"
    />
    <path
      d="M29.286 15c0-8.284-6.557-15-14.643-15C6.556 0 0 6.716 0 15c0 7.486 5.354 13.692 12.355 14.819V19.337H8.636V15h3.72v-3.305c0-3.76 2.186-5.837 5.53-5.837 1.602 0 3.278.293 3.278.293v3.691h-1.847c-1.818 0-2.386 1.156-2.386 2.344V15h4.06l-.648 4.337H16.93v10.482c7-1.125 12.355-7.33 12.355-14.819z"
      fill="#3a67af"
      className="fb-svg-logo"
    />
    <path className="fb-svg-f-letter"
      d="M20.343 19.337L20.99 15h-4.06v-2.814c0-1.185.566-2.344 2.386-2.344h1.847V6.151s-1.676-.293-3.278-.293c-3.344 0-5.53 2.075-5.53 5.837V15h-3.72v4.337h3.72v10.482c.745.12 1.509.181 2.287.181h2.143l.145-10.663h3.412z"
      fill="#FEFEFE"
    />
  </SvgFb>
)

const FacebookConnectSvg = (props) => (
    <SvgFb width={114} height={30} fill="none" {...props}>
    <path
      d="M16.905 28.5l-.384-27H99c7.456 0 13.5 6.044 13.5 13.5S106.456 28.5 99 28.5H16.906z"
      stroke="#3a67af"
      fill="#3a67af"
      strokeWidth={3}
      className="fb-svg-border"
    />
    <path
      d="M48.702 16.685c-.077 1.07-.474 1.914-1.19 2.529-.71.615-1.649.923-2.816.923-1.276 0-2.28-.429-3.014-1.285-.73-.862-1.094-2.042-1.094-3.542v-.608c0-.957.169-1.8.506-2.53.337-.728.818-1.287 1.442-1.674.629-.392 1.358-.588 2.188-.588 1.148 0 2.073.308 2.775.923s1.107 1.479 1.217 2.59h-2.051c-.05-.642-.23-1.107-.54-1.394-.305-.291-.772-.437-1.401-.437-.684 0-1.197.246-1.538.738-.338.488-.51 1.246-.52 2.276v.752c0 1.076.162 1.862.485 2.359.328.497.843.745 1.545.745.634 0 1.105-.144 1.415-.43.315-.292.495-.741.54-1.347h2.051zm1.61-.452c0-.733.14-1.387.423-1.962a3.108 3.108 0 011.217-1.333c.533-.314 1.15-.471 1.853-.471.998 0 1.811.305 2.44.916.633.61.987 1.44 1.06 2.488l.013.506c0 1.135-.317 2.046-.95 2.734-.633.684-1.483 1.026-2.55 1.026-1.066 0-1.918-.342-2.556-1.026-.634-.683-.95-1.613-.95-2.789v-.089zm1.975.144c0 .702.132 1.24.396 1.613.265.37.643.554 1.135.554.479 0 .852-.182 1.121-.547.27-.37.404-.957.404-1.764 0-.688-.135-1.221-.404-1.6-.269-.378-.647-.567-1.134-.567-.484 0-.857.19-1.122.568-.264.373-.396.954-.396 1.743zm8.766-3.773l.062.854c.529-.66 1.237-.991 2.126-.991.784 0 1.367.23 1.75.69.383.46.579 1.149.588 2.065V20h-1.976v-4.73c0-.42-.091-.723-.273-.91-.183-.191-.486-.287-.91-.287-.555 0-.972.237-1.25.711V20h-1.976v-7.396h1.86zm8.548 0l.062.854c.528-.66 1.237-.991 2.126-.991.783 0 1.367.23 1.75.69.382.46.578 1.149.587 2.065V20h-1.975v-4.73c0-.42-.091-.723-.274-.91-.182-.191-.485-.287-.909-.287-.556 0-.973.237-1.25.711V20h-1.976v-7.396H69.6zm10.134 7.533c-1.085 0-1.97-.333-2.653-.998-.679-.666-1.018-1.552-1.018-2.66v-.19c0-.744.143-1.407.43-1.99a3.142 3.142 0 011.217-1.354c.529-.319 1.13-.478 1.805-.478 1.012 0 1.807.319 2.386.957.583.638.875 1.542.875 2.714v.806h-4.71c.063.483.255.87.574 1.162.323.292.731.438 1.224.438.76 0 1.355-.276 1.784-.827l.97 1.087a2.99 2.99 0 01-1.203.984 3.98 3.98 0 01-1.681.349zm-.226-6.07c-.392 0-.711.132-.957.396-.242.264-.396.642-.465 1.135h2.748v-.158c-.009-.437-.127-.774-.355-1.011-.228-.242-.552-.363-.971-.363zm8.172 4.477c.364 0 .66-.1.888-.3.228-.201.347-.468.356-.8h1.852a2.55 2.55 0 01-.41 1.38 2.735 2.735 0 01-1.107.97c-.465.229-.98.343-1.545.343-1.057 0-1.891-.335-2.502-1.005-.61-.675-.916-1.604-.916-2.79v-.13c0-1.138.303-2.048.91-2.727.605-.679 1.437-1.018 2.494-1.018.925 0 1.666.264 2.222.793.56.524.845 1.223.854 2.098h-1.852c-.01-.382-.128-.692-.356-.93-.228-.24-.528-.362-.902-.362-.46 0-.809.169-1.046.506-.232.333-.348.875-.348 1.627v.205c0 .761.116 1.308.348 1.64.233.334.586.5 1.06.5zm7.29-7.759v1.818h1.264v1.45h-1.264v3.691c0 .274.052.47.157.588.105.118.305.178.601.178.219 0 .413-.016.581-.048v1.497a4.067 4.067 0 01-1.196.178c-1.385 0-2.092-.7-2.12-2.099v-3.985h-1.08v-1.45h1.08v-1.818h1.977z"
      fill="#FFFFFF"
      className="fb-svg-text"
    />
    <path
      d="M29.286 15c0-8.284-6.557-15-14.643-15C6.556 0 0 6.716 0 15c0 7.486 5.354 13.692 12.355 14.819V19.337H8.636V15h3.72v-3.305c0-3.76 2.186-5.837 5.53-5.837 1.602 0 3.278.293 3.278.293v3.691h-1.847c-1.818 0-2.386 1.156-2.386 2.344V15h4.06l-.648 4.337H16.93v10.482c7-1.125 12.355-7.33 12.355-14.819z"
      fill="#3a67af"
      className="fb-svg-logo"
    />
    <path className="fb-svg-f-letter"
      d="M20.343 19.337L20.99 15h-4.06v-2.814c0-1.185.566-2.344 2.386-2.344h1.847V6.151s-1.676-.293-3.278-.293c-3.344 0-5.53 2.075-5.53 5.837V15h-3.72v4.337h3.72v10.482c.745.12 1.509.181 2.287.181h2.143l.145-10.663h3.412z"
      fill="#FEFEFE"
    />
  </SvgFb>
)
const FacebookLogoutSvg = (props) => (
    <SvgFb width={114} height={30} fill="none" {...props}>
    <path
      d="M18.11 28.5l-1.523-27H99c7.456 0 13.5 6.044 13.5 13.5S106.456 28.5 99 28.5H18.11z"
      stroke="#3a67af"
      fill="#3a67af"
      strokeWidth={3}
      className="fb-svg-border"
    />
    <path
      d="M42.94 17.352h4.354V19h-6.405V9.047h2.05v8.305zm5.8-2.119c0-.733.14-1.387.423-1.962a3.108 3.108 0 011.217-1.333c.533-.314 1.15-.471 1.852-.471.998 0 1.812.305 2.44.916.634.61.987 1.44 1.06 2.488l.014.506c0 1.135-.317 2.046-.95 2.734-.634.684-1.484 1.026-2.55 1.026-1.067 0-1.919-.342-2.557-1.026-.633-.683-.95-1.613-.95-2.789v-.089zm1.975.144c0 .702.132 1.24.396 1.613.265.37.643.554 1.135.554.478 0 .852-.182 1.121-.547.269-.37.403-.957.403-1.764 0-.688-.134-1.221-.403-1.6-.269-.378-.647-.567-1.135-.567-.483 0-.857.19-1.12.568-.265.373-.397.954-.397 1.743zm6.66-.13c0-1.135.27-2.048.807-2.741.542-.693 1.272-1.04 2.188-1.04.81 0 1.442.279 1.893.835l.082-.697h1.791v7.15c0 .647-.148 1.21-.444 1.688a2.81 2.81 0 01-1.237 1.094c-.533.25-1.158.376-1.873.376a4.02 4.02 0 01-1.586-.328c-.515-.214-.905-.492-1.17-.834l.876-1.203c.492.551 1.089.827 1.79.827.525 0 .933-.141 1.224-.424.292-.278.438-.674.438-1.19v-.396c-.456.515-1.055.773-1.798.773-.889 0-1.609-.347-2.16-1.04-.547-.697-.82-1.62-.82-2.768v-.082zm1.976.144c0 .67.135 1.196.403 1.579.27.378.639.567 1.108.567.601 0 1.032-.226 1.292-.677v-3.11c-.264-.451-.69-.677-1.278-.677a1.3 1.3 0 00-1.121.581c-.27.388-.404.966-.404 1.737zm6.702-.158c0-.733.141-1.387.424-1.962a3.108 3.108 0 011.217-1.333c.533-.314 1.15-.471 1.852-.471.998 0 1.812.305 2.44.916.634.61.987 1.44 1.06 2.488l.014.506c0 1.135-.317 2.046-.95 2.734-.634.684-1.484 1.026-2.55 1.026-1.066 0-1.919-.342-2.557-1.026-.633-.683-.95-1.613-.95-2.789v-.089zm1.976.144c0 .702.132 1.24.396 1.613.265.37.643.554 1.135.554.478 0 .852-.182 1.121-.547.269-.37.403-.957.403-1.764 0-.688-.134-1.221-.403-1.6-.269-.378-.647-.567-1.135-.567-.483 0-.857.19-1.12.568-.265.373-.397.954-.397 1.743zm11.377 2.871c-.487.592-1.162.889-2.023.889-.793 0-1.4-.228-1.818-.684-.415-.456-.627-1.123-.636-2.003v-4.847h1.976v4.779c0 .77.35 1.155 1.052 1.155.67 0 1.13-.232 1.381-.697v-5.236h1.983V19h-1.86l-.055-.752zm6.47-8.463v1.818h1.265v1.45h-1.265v3.691c0 .274.052.47.157.588s.306.178.602.178c.219 0 .412-.016.58-.048v1.497a4.066 4.066 0 01-1.195.178c-1.386 0-2.092-.7-2.12-2.099v-3.985h-1.08v-1.45h1.08V9.786h1.976z"
      fill="#FFFFFF"
      className="fb-svg-text"
    />
    <path
      d="M29.286 15c0-8.284-6.557-15-14.643-15C6.556 0 0 6.716 0 15c0 7.486 5.354 13.692 12.355 14.819V19.337H8.636V15h3.72v-3.305c0-3.76 2.186-5.837 5.53-5.837 1.602 0 3.278.293 3.278.293v3.691h-1.847c-1.818 0-2.386 1.156-2.386 2.344V15h4.06l-.648 4.337H16.93v10.482c7-1.125 12.355-7.33 12.355-14.819z"
      fill="#3a67af"
      className="fb-svg-logo"
    />
    <path className="fb-svg-f-letter"
      d="M20.343 19.337L20.99 15h-4.06v-2.814c0-1.185.566-2.344 2.386-2.344h1.847V6.151s-1.676-.293-3.278-.293c-3.344 0-5.53 2.075-5.53 5.837V15h-3.72v4.337h3.72v10.482c.745.12 1.509.181 2.287.181h2.143l.145-10.663h3.412z"
      fill="#FEFEFE"
    />
  </SvgFb>
)

const FacebookLogoSvg = props => (
    <SvgFb width={41} height={42} fill="none" {...props}>
      <path
        d="M41 21C41 9.403 31.821 0 20.5 0S0 9.403 0 21c0 10.48 7.495 19.169 17.297 20.746V27.072h-5.206V21h5.206v-4.628c0-5.262 3.062-8.171 7.744-8.171 2.242 0 4.589.41 4.589.41v5.168h-2.586c-2.545 0-3.341 1.619-3.341 3.281V21h5.685l-.908 6.072h-4.777v14.674C33.505 40.172 41 31.484 41 21z"
        fill="#1977F3"
        className="fb-svg-logo"
      />
      <path className="fb-svg-f-letter"
        d="M28.48 27.072L29.388 21h-5.685v-3.94c0-1.66.793-3.28 3.341-3.28h2.586V8.61s-2.347-.41-4.59-.41c-4.681 0-7.743 2.906-7.743 8.171V21h-5.206v6.072h5.206v14.674c1.044.168 2.113.254 3.203.254h3l.203-14.928h4.777z"
        fill="#FEFEFE"
      />
    </SvgFb>
  )


const SvgFb = styled("svg")`
    cursor:pointer;
    path {
        transition: all 0.15s cubic-bezier(.42,0,1,1);
    }
    :hover {
        background-color:${props => props.hoverBg && props.hoverBg};
        color:${props => props.hoverColor && props.hoverColor};
        box-shadow:${props => props.hoverShadow && props.hoverShadow};
        border-color:${props => props.hoverBorderColor && props.hoverBorderColor}
    }
    :hover .fb-svg-logo,
    :hover .fb-svg-bg {
        fill:#1977F3
    }
    :hover .fb-svg-border{
        stroke:#0077ED;
        fill:#fff;
    }
    :hover .fb-svg-text{
        fill:#0077ED
    }
    :focus {
        outline: none;
    };
    ${color}
    ${space}
    ${shadow}
    ${layout}
    ${background}
    ${border}
    ${flexbox}
    ${position}
    ${typography}
`

  const FbookAuthButton = styled(LoginButton)`
  margin: 4px;
  box-sizing: border-box;
  border:0;
  cursor:pointer;
  background-color:transparent;
  :hover {
      background-color:${props => props.hoverBg && props.hoverBg};
      color:${props => props.hoverColor && props.hoverColor};
      box-shadow:${props => props.hoverShadow && props.hoverShadow};
      border-color:${props => props.hoverBorderColor && props.hoverBorderColor}
  }
  :focus {
      outline: none;
  };
  ${color}
  ${space}
  ${shadow}
  ${layout}
  ${background}
  ${border}
  ${flexbox}
  ${position}
  ${typography}
`


/*

const FacebookConnectSvg = (props) => (
    <svg width="202"  viewBox="0 0 202 38" fill="none" xmlns="http://www.w3.org/2000/svg" 
        style={{height:"auto", width:"100%"}} {...props}
        >
        <rect x="23" y="5" width="177.137" height="28" rx="7" fill="white" stroke="#2A426E" strokeWidth="2"/>
        <g filter="url(#filter0_d)">
        <rect x="5.51282" y="7" width="22.0513" height="27" fill="white"/>
        <path d="M29.533 4H3.54396C2.60404 4 1.70262 4.33865 1.038 4.94144C0.37338 5.54424 0 6.3618 0 7.21429L0 30.7857C0 31.6382 0.37338 32.4558 1.038 33.0586C1.70262 33.6614 2.60404 34 3.54396 34H13.6775V23.8007H9.02601V19H13.6775V15.3411C13.6775 11.1792 16.4093 8.88036 20.5933 8.88036C22.5972 8.88036 24.6925 9.20446 24.6925 9.20446V13.2893H22.3838C20.109 13.2893 19.3995 14.5696 19.3995 15.8828V19H24.4777L23.6655 23.8007H19.3995V34H29.533C30.4729 34 31.3743 33.6614 32.0389 33.0586C32.7035 32.4558 33.0769 31.6382 33.0769 30.7857V7.21429C33.0769 6.3618 32.7035 5.54424 32.0389 4.94144C31.3743 4.33865 30.4729 4 29.533 4Z" fill="#2A426E"/>
        </g>
        <path d="M53.7021 19.6846C53.6247 20.7555 53.2282 21.5986 52.5127 22.2139C51.8018 22.8291 50.863 23.1367 49.6963 23.1367C48.4202 23.1367 47.4154 22.7083 46.6816 21.8516C45.9525 20.9902 45.5879 19.8099 45.5879 18.3105V17.7021C45.5879 16.7451 45.7565 15.902 46.0938 15.1729C46.431 14.4437 46.9118 13.8854 47.5361 13.498C48.165 13.1061 48.8942 12.9102 49.7236 12.9102C50.8721 12.9102 51.7972 13.2178 52.499 13.833C53.2008 14.4482 53.6064 15.3118 53.7158 16.4238H51.665C51.6149 15.7812 51.4349 15.3164 51.125 15.0293C50.8197 14.7376 50.3525 14.5918 49.7236 14.5918C49.04 14.5918 48.5273 14.8379 48.1855 15.3301C47.8483 15.8177 47.6751 16.5765 47.666 17.6064V18.3584C47.666 19.4339 47.8278 20.2201 48.1514 20.7168C48.4795 21.2135 48.9945 21.4619 49.6963 21.4619C50.3298 21.4619 50.8014 21.3184 51.1113 21.0312C51.4258 20.7396 51.6058 20.2907 51.6514 19.6846H53.7021ZM63.9246 18.249C63.9246 19.2288 63.7514 20.0879 63.4051 20.8262C63.0587 21.5645 62.562 22.1341 61.9148 22.5352C61.2723 22.9362 60.534 23.1367 59.7 23.1367C58.8751 23.1367 58.1391 22.9385 57.492 22.542C56.8449 22.1455 56.3436 21.5804 55.9881 20.8467C55.6326 20.1084 55.4526 19.2607 55.448 18.3037V17.8115C55.448 16.8317 55.6235 15.9704 55.9744 15.2275C56.3299 14.4801 56.8289 13.9082 57.4715 13.5117C58.1186 13.1107 58.8569 12.9102 59.6863 12.9102C60.5158 12.9102 61.2518 13.1107 61.8943 13.5117C62.5415 13.9082 63.0405 14.4801 63.3914 15.2275C63.7469 15.9704 63.9246 16.8294 63.9246 17.8047V18.249ZM61.8465 17.7979C61.8465 16.7542 61.6596 15.9613 61.2859 15.4189C60.9122 14.8766 60.379 14.6055 59.6863 14.6055C58.9982 14.6055 58.4673 14.8743 58.0936 15.4121C57.7199 15.9453 57.5307 16.7292 57.5262 17.7637V18.249C57.5262 19.2653 57.713 20.0537 58.0867 20.6143C58.4604 21.1748 58.9982 21.4551 59.7 21.4551C60.3882 21.4551 60.9168 21.1862 61.2859 20.6484C61.6551 20.1061 61.8419 19.3177 61.8465 18.2832V17.7979ZM74.2086 23H72.1578L68.1656 16.4512V23H66.1148V13.0469H68.1656L72.1646 19.6094V13.0469H74.2086V23ZM84.7934 23H82.7426L78.7504 16.4512V23H76.6996V13.0469H78.7504L82.7494 19.6094V13.0469H84.7934V23ZM93.2727 18.6865H89.3352V21.3525H93.9562V23H87.2844V13.0469H93.9426V14.708H89.3352V17.0801H93.2727V18.6865ZM103.673 19.6846C103.595 20.7555 103.199 21.5986 102.483 22.2139C101.772 22.8291 100.834 23.1367 99.667 23.1367C98.391 23.1367 97.3861 22.7083 96.6523 21.8516C95.9232 20.9902 95.5586 19.8099 95.5586 18.3105V17.7021C95.5586 16.7451 95.7272 15.902 96.0645 15.1729C96.4017 14.4437 96.8825 13.8854 97.5068 13.498C98.1357 13.1061 98.8649 12.9102 99.6943 12.9102C100.843 12.9102 101.768 13.2178 102.47 13.833C103.172 14.4482 103.577 15.3118 103.687 16.4238H101.636C101.586 15.7812 101.406 15.3164 101.096 15.0293C100.79 14.7376 100.323 14.5918 99.6943 14.5918C99.0107 14.5918 98.498 14.8379 98.1562 15.3301C97.819 15.8177 97.6458 16.5765 97.6367 17.6064V18.3584C97.6367 19.4339 97.7985 20.2201 98.1221 20.7168C98.4502 21.2135 98.9652 21.4619 99.667 21.4619C100.3 21.4619 100.772 21.3184 101.082 21.0312C101.396 20.7396 101.576 20.2907 101.622 19.6846H103.673ZM113.007 14.708H109.958V23H107.907V14.708H104.899V13.0469H113.007V14.708ZM124.647 18.9326H120.709V23H118.659V13.0469H125.139V14.708H120.709V17.2783H124.647V18.9326ZM131.335 20.9492H127.739L127.056 23H124.875L128.58 13.0469H130.481L134.206 23H132.026L131.335 20.9492ZM128.293 19.2881H130.781L129.53 15.5625L128.293 19.2881ZM143.499 19.6846C143.422 20.7555 143.025 21.5986 142.31 22.2139C141.599 22.8291 140.66 23.1367 139.493 23.1367C138.217 23.1367 137.212 22.7083 136.479 21.8516C135.749 20.9902 135.385 19.8099 135.385 18.3105V17.7021C135.385 16.7451 135.553 15.902 135.891 15.1729C136.228 14.4437 136.709 13.8854 137.333 13.498C137.962 13.1061 138.691 12.9102 139.521 12.9102C140.669 12.9102 141.594 13.2178 142.296 13.833C142.998 14.4482 143.403 15.3118 143.513 16.4238H141.462C141.412 15.7812 141.232 15.3164 140.922 15.0293C140.617 14.7376 140.149 14.5918 139.521 14.5918C138.837 14.5918 138.324 14.8379 137.982 15.3301C137.645 15.8177 137.472 16.5765 137.463 17.6064V18.3584C137.463 19.4339 137.625 20.2201 137.948 20.7168C138.276 21.2135 138.791 21.4619 139.493 21.4619C140.127 21.4619 140.598 21.3184 140.908 21.0312C141.223 20.7396 141.403 20.2907 141.448 19.6846H143.499ZM151.534 18.6865H147.596V21.3525H152.218V23H145.546V13.0469H152.204V14.708H147.596V17.0801H151.534V18.6865ZM154.121 23V13.0469H157.607C158.815 13.0469 159.731 13.2793 160.355 13.7441C160.979 14.2044 161.292 14.8812 161.292 15.7744C161.292 16.262 161.166 16.6927 160.916 17.0664C160.665 17.4355 160.316 17.7067 159.87 17.8799C160.38 18.0075 160.781 18.265 161.073 18.6523C161.369 19.0397 161.517 19.5137 161.517 20.0742C161.517 21.0312 161.212 21.7559 160.601 22.248C159.99 22.7402 159.12 22.9909 157.99 23H154.121ZM156.171 18.666V21.3525H157.928C158.411 21.3525 158.787 21.2386 159.056 21.0107C159.33 20.7783 159.466 20.4593 159.466 20.0537C159.466 19.1423 158.995 18.6797 158.051 18.666H156.171ZM156.171 17.2168H157.689C158.724 17.1986 159.241 16.7861 159.241 15.9795C159.241 15.5283 159.109 15.2048 158.844 15.0088C158.585 14.8083 158.172 14.708 157.607 14.708H156.171V17.2168ZM171.938 18.249C171.938 19.2288 171.765 20.0879 171.418 20.8262C171.072 21.5645 170.575 22.1341 169.928 22.5352C169.286 22.9362 168.547 23.1367 167.713 23.1367C166.888 23.1367 166.152 22.9385 165.505 22.542C164.858 22.1455 164.357 21.5804 164.001 20.8467C163.646 20.1084 163.466 19.2607 163.461 18.3037V17.8115C163.461 16.8317 163.637 15.9704 163.988 15.2275C164.343 14.4801 164.842 13.9082 165.485 13.5117C166.132 13.1107 166.87 12.9102 167.7 12.9102C168.529 12.9102 169.265 13.1107 169.908 13.5117C170.555 13.9082 171.054 14.4801 171.405 15.2275C171.76 15.9704 171.938 16.8294 171.938 17.8047V18.249ZM169.86 17.7979C169.86 16.7542 169.673 15.9613 169.299 15.4189C168.926 14.8766 168.392 14.6055 167.7 14.6055C167.011 14.6055 166.481 14.8743 166.107 15.4121C165.733 15.9453 165.544 16.7292 165.539 17.7637V18.249C165.539 19.2653 165.726 20.0537 166.1 20.6143C166.474 21.1748 167.011 21.4551 167.713 21.4551C168.401 21.4551 168.93 21.1862 169.299 20.6484C169.668 20.1061 169.855 19.3177 169.86 18.2832V17.7979ZM182.304 18.249C182.304 19.2288 182.131 20.0879 181.784 20.8262C181.438 21.5645 180.941 22.1341 180.294 22.5352C179.652 22.9362 178.913 23.1367 178.079 23.1367C177.254 23.1367 176.518 22.9385 175.871 22.542C175.224 22.1455 174.723 21.5804 174.367 20.8467C174.012 20.1084 173.832 19.2607 173.827 18.3037V17.8115C173.827 16.8317 174.003 15.9704 174.354 15.2275C174.709 14.4801 175.208 13.9082 175.851 13.5117C176.498 13.1107 177.236 12.9102 178.066 12.9102C178.895 12.9102 179.631 13.1107 180.274 13.5117C180.921 13.9082 181.42 14.4801 181.771 15.2275C182.126 15.9704 182.304 16.8294 182.304 17.8047V18.249ZM180.226 17.7979C180.226 16.7542 180.039 15.9613 179.665 15.4189C179.292 14.8766 178.758 14.6055 178.066 14.6055C177.377 14.6055 176.847 14.8743 176.473 15.4121C176.099 15.9453 175.91 16.7292 175.905 17.7637V18.249C175.905 19.2653 176.092 20.0537 176.466 20.6143C176.84 21.1748 177.377 21.4551 178.079 21.4551C178.767 21.4551 179.296 21.1862 179.665 20.6484C180.034 20.1061 180.221 19.3177 180.226 18.2832V17.7979ZM187.611 19.0078L186.545 20.1562V23H184.494V13.0469H186.545V17.5586L187.447 16.3213L189.983 13.0469H192.506L188.972 17.4697L192.608 23H190.168L187.611 19.0078Z" fill="#2C2C2C"/>
        <defs>
        <filter id="filter0_d" x="0" y="0" width="41.0769" height="38" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
        <feOffset dx="4"/>
        <feGaussianBlur stdDeviation="2"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
        </filter>
        </defs>
    </svg>
)
const FacebookLogoutSvg = (props) => (
    <svg width="114" height="38" viewBox="0 0 114 38" fill="none" xmlns="http://www.w3.org/2000/svg" 
        style={{height:"auto", width:"100%"}} {...props}
        >
        <rect x="23" y="5" width="90" height="28" rx="7" fill="white" stroke="#2A426E" strokeWidth="2"/>
        <g filter="url(#filter0_d)">
        <rect x="5.51282" y="7" width="22.0513" height="27" fill="white"/>
        <path d="M29.533 4H3.54396C2.60404 4 1.70262 4.33865 1.038 4.94144C0.37338 5.54424 0 6.3618 0 7.21429L0 30.7857C0 31.6382 0.37338 32.4558 1.038 33.0586C1.70262 33.6614 2.60404 34 3.54396 34H13.6775V23.8007H9.02601V19H13.6775V15.3411C13.6775 11.1792 16.4093 8.88036 20.5933 8.88036C22.5972 8.88036 24.6925 9.20446 24.6925 9.20446V13.2893H22.3838C20.109 13.2893 19.3995 14.5696 19.3995 15.8828V19H24.4777L23.6655 23.8007H19.3995V34H29.533C30.4729 34 31.3743 33.6614 32.0389 33.0586C32.7035 32.4558 33.0769 31.6382 33.0769 30.7857V7.21429C33.0769 6.3618 32.7035 5.54424 32.0389 4.94144C31.3743 4.33865 30.4729 4 29.533 4Z" fill="#2A426E"/>
        </g>
        <path d="M47.9395 22.3525H52.2939V24H45.8887V14.0469H47.9395V22.3525ZM61.9148 19.249C61.9148 20.2288 61.7417 21.0879 61.3953 21.8262C61.049 22.5645 60.5522 23.1341 59.9051 23.5352C59.2625 23.9362 58.5242 24.1367 57.6902 24.1367C56.8654 24.1367 56.1294 23.9385 55.4822 23.542C54.8351 23.1455 54.3338 22.5804 53.9783 21.8467C53.6229 21.1084 53.4428 20.2607 53.4383 19.3037V18.8115C53.4383 17.8317 53.6137 16.9704 53.9646 16.2275C54.3201 15.4801 54.8191 14.9082 55.4617 14.5117C56.1089 14.1107 56.8471 13.9102 57.6766 13.9102C58.506 13.9102 59.242 14.1107 59.8846 14.5117C60.5317 14.9082 61.0307 15.4801 61.3816 16.2275C61.7371 16.9704 61.9148 17.8294 61.9148 18.8047V19.249ZM59.8367 18.7979C59.8367 17.7542 59.6499 16.9613 59.2762 16.4189C58.9025 15.8766 58.3693 15.6055 57.6766 15.6055C56.9884 15.6055 56.4575 15.8743 56.0838 16.4121C55.7101 16.9453 55.521 17.7292 55.5164 18.7637V19.249C55.5164 20.2653 55.7033 21.0537 56.077 21.6143C56.4507 22.1748 56.9884 22.4551 57.6902 22.4551C58.3784 22.4551 58.907 22.1862 59.2762 21.6484C59.6453 21.1061 59.8322 20.3177 59.8367 19.2832V18.7979ZM71.9801 22.7422C71.6109 23.1842 71.0891 23.5283 70.4146 23.7744C69.7402 24.016 68.9928 24.1367 68.1725 24.1367C67.3111 24.1367 66.5546 23.9499 65.9029 23.5762C65.2558 23.1979 64.7545 22.651 64.399 21.9355C64.0481 21.2201 63.8681 20.3792 63.859 19.4131V18.7363C63.859 17.7428 64.0253 16.8838 64.358 16.1592C64.6952 15.43 65.1783 14.874 65.8072 14.4912C66.4407 14.1038 67.1812 13.9102 68.0289 13.9102C69.2092 13.9102 70.1321 14.1927 70.7975 14.7578C71.4628 15.3184 71.857 16.1364 71.9801 17.2119H69.984C69.8928 16.6423 69.69 16.2253 69.3756 15.9609C69.0657 15.6966 68.6373 15.5645 68.0904 15.5645C67.3932 15.5645 66.8622 15.8265 66.4977 16.3506C66.1331 16.8747 65.9485 17.654 65.9439 18.6885V19.3242C65.9439 20.3678 66.1422 21.1562 66.5387 21.6895C66.9352 22.2227 67.5162 22.4893 68.2818 22.4893C69.052 22.4893 69.6012 22.3252 69.9293 21.9971V20.2812H68.0631V18.7705H71.9801V22.7422ZM82.5238 19.249C82.5238 20.2288 82.3507 21.0879 82.0043 21.8262C81.6579 22.5645 81.1612 23.1341 80.5141 23.5352C79.8715 23.9362 79.1332 24.1367 78.2992 24.1367C77.4743 24.1367 76.7383 23.9385 76.0912 23.542C75.4441 23.1455 74.9428 22.5804 74.5873 21.8467C74.2318 21.1084 74.0518 20.2607 74.0473 19.3037V18.8115C74.0473 17.8317 74.2227 16.9704 74.5736 16.2275C74.9291 15.4801 75.4281 14.9082 76.0707 14.5117C76.7178 14.1107 77.4561 13.9102 78.2855 13.9102C79.115 13.9102 79.851 14.1107 80.4936 14.5117C81.1407 14.9082 81.6397 15.4801 81.9906 16.2275C82.3461 16.9704 82.5238 17.8294 82.5238 18.8047V19.249ZM80.4457 18.7979C80.4457 17.7542 80.2589 16.9613 79.8852 16.4189C79.5115 15.8766 78.9783 15.6055 78.2855 15.6055C77.5974 15.6055 77.0665 15.8743 76.6928 16.4121C76.3191 16.9453 76.1299 17.7292 76.1254 18.7637V19.249C76.1254 20.2653 76.3122 21.0537 76.6859 21.6143C77.0596 22.1748 77.5974 22.4551 78.2992 22.4551C78.9874 22.4551 79.516 22.1862 79.8852 21.6484C80.2543 21.1061 80.4411 20.3177 80.4457 19.2832V18.7979ZM92.2473 14.0469V20.6025C92.2473 21.6917 91.9055 22.5531 91.2219 23.1865C90.5428 23.82 89.6132 24.1367 88.4328 24.1367C87.2707 24.1367 86.3479 23.8291 85.6643 23.2139C84.9807 22.5986 84.632 21.7533 84.6184 20.6777V14.0469H86.6691V20.6162C86.6691 21.2679 86.8241 21.7441 87.134 22.0449C87.4484 22.3411 87.8814 22.4893 88.4328 22.4893C89.5858 22.4893 90.1714 21.8831 90.1896 20.6709V14.0469H92.2473ZM102.121 15.708H99.0723V24H97.0215V15.708H94.0137V14.0469H102.121V15.708Z" fill="#2C2C2C"/>
        <defs>
        <filter id="filter0_d" x="0" y="0" width="41.0769" height="38" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
        <feOffset dx="4"/>
        <feGaussianBlur stdDeviation="2"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
        </filter>
        </defs>
    </svg>
)
*/