import React, { useState, useEffect, useCallback, useMemo, useContext } from "react";
import ReactDOM from 'react-dom';
import { useMutation } from '@apollo/react-hooks';
import { GlobalContext } from "../../";
import { FACEBOOK_CONNECT, FACEBOOK_AUTHENTICATE } from "../mutations";
import { print } from "../lib"
import { LoginButton, Status, Initialize, useApi, FacebookContext, Facebook } from 'react-facebook';
import { ConnectButton, LogoutButton, AuthButton, production } from "./facebook-buttons"

import {  
	SimpleModal,FlexBox, GradientAnimationBox, Loading, Text,
	SignupForm
} from "../../styled-components"

export const FaceBookAuthentication = () => {
	const FB = window.FB
	const globalstate = useContext(GlobalContext)

    const [ fbData, setFbData ] = useState({})
    const [ authMutationResponse, setAuthMutationResponse ] = useState({})
    const [ isOpen, setOpenStatus ] = useState(null)


    const [facebookAuthenticate, { data, loading, error }] = useMutation(FACEBOOK_AUTHENTICATE, {
      onError:() => print("fbook authentication error"),
      onCompleted: (d) => setAuthMutationResponse(d)});
    
      
    const errorHandler   = useCallback((error) =>  console.log("error: ", error),[])
    const closeModal = useCallback(() => setOpenStatus(false),[])
    const openModal = useCallback(() => setOpenStatus(true),[])

    const authMutationHandler = useCallback((fbData) => {setFbData(fbData); facebookAuthenticate({variables:{data:JSON.stringify(fbData)}});}, [])
	
	//Reactive Values
	const avatarUrl = useMemo(() => (fbData.profile && fbData.profile.picture) ? fbData.profile.picture.data.url : null, [fbData.profile])
	const preFilledForm = useMemo(() => (authMutationResponse && authMutationResponse.form) ? JSON.parse(authMutationResponse.form): {}, [authMutationResponse.form])
	const afterResponseStatus = useMemo(() => (authMutationResponse && authMutationResponse.status) ? authMutationResponse.status : null, [authMutationResponse])
	const modalHeader = useMemo(() => {
		if (afterResponseStatus === "register") return "One Last Step"
		else if (afterResponseStatus === "login") return `Welcome`
		else return "Just a second ..."
	}, [afterResponseStatus])

	//print("modal status", isOpen)



    useEffect(() => {
      	//print("use effect success", data);
		// If response arrived from server 
		if (data && data.facebookAuthenticate){
			setOpenStatus(true)
			const serverResponse = data.facebookAuthenticate
			setAuthMutationResponse(serverResponse)


			//CASE: Login
			print("User now logging in0", serverResponse)
			if (serverResponse.success && serverResponse.status==="login") {
				print("User now logging in")
				const profile = serverResponse.user.profile
				globalstate.methods.login(profile)
			}
		}
    },[data])

	print("auth",fbData, authMutationResponse)
	print("after response status", afterResponseStatus)


    return(
      <>
        {(loading && fbData) && <Loading  text="loading"/>}
        
        <SimpleModal 
			isOpen={isOpen} closeModal={closeModal} header={modalHeader}
			bg="light" color="dark"  
			width={["90vw","90vw","80vw", "60vw"]} maxWidth={"400px"}
			minHeight="200px"
		>
          {console.log("modal content", isOpen)}
          <FlexBox flexDirection="column" alignItems="center" justifyContent="flex-start" width="100%" bg="light" zIndex={11}>


		  {afterResponseStatus !== "register" &&
		  	<Text >{authMutationResponse.message}</Text>}

			{afterResponseStatus === "register" && 
				<SignupForm 
					zIndex={11}
					focus="Password" 
					username={preFilledForm.username} 
					email={preFilledForm.email} 
					name={preFilledForm.name} 
					fbData={fbData}
					avatarUrl={avatarUrl}
				/>}

          </FlexBox>
        </SimpleModal>
        <AuthButton onCompleted={authMutationHandler} onError={errorHandler} />
      </>
    )
  }



export const facebook = () => {
	const FB = window.FB
    const [api, handleApi] = useApi()

	const [ isLogged, setIsLogged ] = useState(false)


    const [ fbData, setFbData ] = useState({})


    // MUTATIONS
    const [facebookConnect, { data }] = useMutation(FACEBOOK_CONNECT, {
        onError:() => print("fbook mutation error"),
        onCompleted: (data) => (print("fbook mutation success", data), setLoginStatus(data.facebookConnect.success))
    });


    // Callback functions
    const setLoginStatus = useCallback((bool) => bool !== isLogged ? setIsLogged(bool) : null,[isLogged])
    const setFbStatus    = useCallback((status) => ((status==="connected") !== isLogged) ? setIsLogged(status==="connected") : null,[isLogged] )
    const checkFbStatus  = useCallback(async () => {if(api){const r = await api.getLoginStatus(); setFbStatus(r.status)}}, [api])

  	//handlers
    const cleanHandler   = useCallback(() => {setIsLogged(false); setFbData(null);},[])
    const logoutHandler  = useCallback(async () => {if(api){api.logout(l => print("l",l))}; cleanHandler()},[])
    const errorHandler   = useCallback((error) =>  console.log("error: ", error),[])

	  
    const connectSuccessHandler = useCallback((r) =>  {const newData= {...r};print(newData);  facebookConnect({variables:{data:JSON.stringify(newData)}}); setFbData(newData);},[])	



    const Login = useCallback(() => <ConnectButton onCompleted={connectSuccessHandler} onError={errorHandler} />)
    const Logout = useCallback(() => <LogoutButton onClick={logoutHandler} />)
    const Function = useCallback(() => <button >status</button>)
    const Connect = isLogged ? Logout : Login

    const store = {
        //Logout:() => <LogoutButton onClick={logoutHandler}/>,
        Logout,
        Login,
        Connect,
        Function,
        Auth: FaceBookAuthentication,
        data:fbData
    }
    //checkFbStatus()
    //const fbSubscribe = async () => {if(api){api.subscribe("auth.authResponseChange", r => console.log("subscribe response", r),true);}}
    //fbSubscribe()
    useEffect(() => {
		if (FB){FB.getLoginStatus(function(response) {
			//console.log("resp",response)
			if (response.status === "connected" && isLogged === false){
				setIsLogged(true);
			}
			else if (response.status !== "connected" && isLogged === true){
				setIsLogged(false)
			}   
		});}
    },[FB])
    return store
}


export const FaceBookAuthentication0 = () => {
	const globalstate = useContext(GlobalContext)

    const [ fbData, setFbData ] = useState({})
    const [ authMutationResponse, setAuthMutationResponse ] = useState({})
    const [ isOpen, setOpenStatus ] = useState(null)


    const [facebookAuthenticate, { data, loading, error }] = useMutation(FACEBOOK_AUTHENTICATE, {
      onError:() => print("fbook authentication error"),
      onCompleted: (d) => setAuthMutationResponse(d)});
    
      
    const errorHandler   = useCallback((error) =>  console.log("error: ", error),[])
    const closeModal = useCallback(() => setOpenStatus(false),[])
    const openModal = useCallback(() => setOpenStatus(true),[])

    const authMutationHandler = useCallback((fbData) => {setFbData(fbData); facebookAuthenticate({variables:{data:JSON.stringify(fbData)}});}, [])
	
	//Reactive Values
	const avatarUrl = useMemo(() => (fbData.profile && fbData.profile.picture) ? fbData.profile.picture.data.url : null, [fbData.profile])
	const preFilledForm = useMemo(() => (authMutationResponse && authMutationResponse.form) ? JSON.parse(authMutationResponse.form): {}, [authMutationResponse.form])
	const afterResponseStatus = useMemo(() => (authMutationResponse && authMutationResponse.status) ? authMutationResponse.status : null, [authMutationResponse])
	const modalHeader = useMemo(() => {
		if (afterResponseStatus === "register") return "One Last Step"
		else if (afterResponseStatus === "login") return `Welcome`
		else return "Just a second ..."
	}, [afterResponseStatus])

	//print("modal status", isOpen)



    useEffect(() => {
      	//print("use effect success", data);
		// If response arrived from server 
		if (data && data.facebookAuthenticate){
			setOpenStatus(true)
			const serverResponse = data.facebookAuthenticate
			setAuthMutationResponse(serverResponse)


			//CASE: Login
			print("User now logging in0", serverResponse)
			if (serverResponse.success && serverResponse.status==="login") {
				print("User now logging in")
				const profile = serverResponse.user.profile
				globalstate.methods.login(profile)
			}
		}
    },[data])

	print("auth",fbData, authMutationResponse)
	print("after response status", afterResponseStatus)


    return(
      <>
        {(loading && fbData) && <Loading  text="loading"/>}
        
        <SimpleModal 
			isOpen={isOpen} closeModal={closeModal} header={modalHeader}
			bg="light" color="dark"  
			width={["90vw","90vw","80vw", "60vw"]} maxWidth={"400px"}
			minHeight="200px"
		>
          {console.log("modal content", isOpen)}
          <FlexBox flexDirection="column" alignItems="center" justifyContent="flex-start" width="100%" bg="light" zIndex={11}>


		  {afterResponseStatus !== "register" &&
		  	<Text >{authMutationResponse.message}</Text>}

			{afterResponseStatus === "register" && 
				<SignupForm 
					zIndex={11}
					focus="Password" 
					username={preFilledForm.username} 
					email={preFilledForm.email} 
					name={preFilledForm.name} 
					fbData={fbData}
					avatarUrl={avatarUrl}
				/>}

          </FlexBox>
        </SimpleModal>
        <AuthButton onCompleted={authMutationHandler} onError={errorHandler} />
      </>
    )
  }

/*
export const FbookConnectButton = (props) =>{
    const initialStatus = isConnected()
    const [localstatus, setStatus] = useState(initialStatus)
    const [facebookMutation, { data }] = useMutation(FACEBOOK_CONNECT, {
        onError:() => print("fbook mutation error"),
        onCompleted: (data) => (print("fbook mutation success", data), setStatus(true))
    });
    function logoutHandler(){
        const FB = window.FB
        FB.logout((e) => {
                console.log("logout response", e)
                setStatus(false)
            }
        )
        setStatus(false)
    }


    const handleSuccess = (rawdata) => {
        print("rawdata", rawdata.profile)
        const data = JSON.stringify(rawdata)
        facebookMutation({variables:{data}})
    }
    const handleError = (error) => {
        console.log("error", error)
        if (localstatus === true) setStatus(false)
    }



    const Logout = () => (
        <Initialize>
          {({ isReady, api }) => {
            //api.ui(...) our custom async/await api
            // original FB api is available via window.FB
            if (isReady){
                return <CustomLogoutButton clickHandler={logoutHandler} />
            }
          }}
        </Initialize>
    )

    return (
        <Status>
          {({ loading, status }) => (
              !loading 

              ? (status === "unknown" || localstatus===false ) 
                ? <ConnectButton  /> 
                : (status === "connected" && <Logout />)

            : <div></div>
          )}
        </Status>
    )
}





/*
  async ui(options) {
    return this.process('ui', [options]);
  }

  async api(path, method = Method.GET, params = {}) {
    return this.process('api', [path, method, params]);
  }

  async login(opts = null) {
    return this.process('login', [], [opts]);
  }

  async logout() {
    return this.process('logout');
  }

  async getLoginStatus() {
    return this.process('getLoginStatus');
  }

  async getAuthResponse() {
    return this.process('getAuthResponse');
  }
*/