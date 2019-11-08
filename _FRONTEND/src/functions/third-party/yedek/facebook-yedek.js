import React, { useState, useEffect, useCallback, useMemo, useContext } from "react";
import ReactDOM from 'react-dom';
import { useMutation } from '@apollo/react-hooks';
import { GlobalContext } from "../../";
import { FACEBOOK_CONNECT, FACEBOOK_AUTHENTICATE } from "../mutations";
import { print } from "../lib"
import { LoginButton, Status, Initialize, useApi, FacebookContext, Facebook } from 'react-facebook';
import { ConnectButton, LogoutButton, AuthButton } from "./facebook-buttons"

import {  SimpleModal,FlexBox, GradientAnimationBox, Loading, Text } from "../../styled-components"



export const facebook = () => {
    const [api, handleApi] = useApi()
    const globalstate = useContext(GlobalContext)

	const [ isLogged, setIsLogged ] = useState(false)
	const [ isModalOpen, setModalStatus ] = useState(false)
	const [ authMutationResponse, setAuthMutationResponse ] = useState({})

    const [ fbData, setFbData ] = useState({})


    // MUTATIONS
    const [facebookConnect, { data }] = useMutation(FACEBOOK_CONNECT, {
        onError:() => print("fbook mutation error"),
        onCompleted: (data) => (print("fbook mutation success", data), setLoginStatus(data.facebookConnect.success))
    });
    const [facebookAuthenticate, { data:authData, loading, error }] = useMutation(FACEBOOK_AUTHENTICATE, {
		onError:() => print("fbook authentication error"),
		onCompleted: (data) => authMutationOnComplete(data) });



    // Callback functions
    const setLoginStatus = useCallback((bool) => bool !== isLogged ? setIsLogged(bool) : null,[isLogged])
    const setFbStatus    = useCallback((status) => ((status==="connected") !== isLogged) ? setIsLogged(status==="connected") : null,[isLogged] )
    const checkFbStatus  = useCallback(async () => {if(api){const r = await api.getLoginStatus(); setFbStatus(r.status)}}, [api])

  	//handlers
    const cleanHandler   = useCallback(() => {setIsLogged(false); setFbData(null);},[])
    const logoutHandler  = useCallback(async () => {if(api){api.logout(l => print("l",l))}; cleanHandler()},[])
    const errorHandler   = useCallback((error) =>  console.log("error: ", error),[])
  	const closeModal = () => setModalStatus(false)
	const openModal = () => setModalStatus(true)
	  
    const connectSuccessHandler = useCallback((r) =>  {const newData= {...r};print(newData);  facebookConnect({variables:{data:JSON.stringify(newData)}}); setFbData(newData);},[])	
	const authMutationHandler = (fbData) => {print("auth mutation handler", fbData); facebookAuthenticate({variables:{data:JSON.stringify(fbData)}});}
  	const authMutationOnComplete = (data) => {
		print("fbook  auth mutations success", data.facebookAuthenticate);
		setAuthMutationResponse(data.facebookAuthenticate)
		openModal()
	  }
    print("facebook", isLogged,isModalOpen, fbData, authMutationResponse )



    // Render Elements
    const Auth = () => (
		<>
			{loading && <Loading  text="loading"/>}
			<SimpleModal isOpen={isModalOpen} closeModal={closeModal} bg="light" color="dark"  width="40vw" minHeight="200px">
				<FlexBox flexDirection="column" alignItems="center" justifyContent="flex-start" width="100%">
					<Text >{authMutationResponse.message}</Text>
					{error && <Text color="red">{error.message}</Text>}
				</FlexBox>
			</SimpleModal>
			<AuthButton onCompleted={authMutationHandler} onError={errorHandler} />
		</>
	)
    const Login = useCallback(() => <ConnectButton onCompleted={connectSuccessHandler} onError={errorHandler} />)
    const Logout = useCallback(() => <LogoutButton onClick={logoutHandler} />)
    const Function = useCallback(() => <button onClick={openModal}>status</button>)
    const Connect = isLogged ? Logout : Login

    const store = {
        //Logout:() => <LogoutButton onClick={logoutHandler}/>,
        Logout,
        Login,
        Connect,
        Function,
        Auth,
        data:fbData
    }
    //checkFbStatus()
    //const fbSubscribe = async () => {if(api){api.subscribe("auth.authResponseChange", r => console.log("subscribe response", r),true);}}
    //fbSubscribe()
    useEffect(() => {
        checkFbStatus()
        //fbSubscribe()
        //const FB = window.FB
        //console.log("useEffect ")
    },[api])
    return store
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