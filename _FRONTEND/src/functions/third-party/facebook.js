import React, { useState, useEffect, useCallback, useMemo, useContext } from "react";
import ReactDOM from 'react-dom';
import { useMutation } from '@apollo/react-hooks';
import { GlobalContext } from "../../";
import { FACEBOOK_CONNECT, FACEBOOK_AUTHENTICATE } from "../mutations";
import { print } from "../lib"
import { LoginButton, Status, Initialize, useApi, FacebookContext, Facebook } from 'react-facebook';
import { ConnectButton, LogoutButton, AuthButton } from "./facebook-buttons"


export const facebook = () => {
    const [api, handleApi] = useApi()
    const globalstate = useContext(GlobalContext)

    //console.log("api", api)
    //const api = () => console.log("api")
    const [facebookConnect, { data }] = useMutation(FACEBOOK_CONNECT, {
        onError:() => print("fbook mutation error"),
        onCompleted: (data) => (print("fbook mutation success", data), setLoginStatus(data.facebookConnect.success))
    });
    const [facebookAuthenticate, { authData }] = useMutation(FACEBOOK_AUTHENTICATE, {
      onError:() => print("fbook authentication error"),
      onCompleted: (data) => {
		  print("fbook authentication success", data); 
		  globalstate.methods.login(data.facebookAuthenticate.user.profile)
		}
  });


    const [ isLogged, setIsLogged ] = useState(false)
    const [ fbData, setFbData ] = useState({})

    //const profile = useMemo(() => fbData ? fbData.profile : null,[fbData])
    const Auth = useCallback(() => <AuthButton onCompleted={authSuccessHandler} onError={errorHandler}  />)
    const Login = useCallback(() => <ConnectButton onCompleted={connectSuccessHandler} onError={errorHandler} />)
    const Logout = useCallback(() => <LogoutButton onClick={logoutHandler} />)
    const Status = useCallback(() => <button onClick={checkFbStatus}>status</button>)
    const Connect = isLogged ? Logout : Login
    
    const setLoginStatus = useCallback((bool) => bool !== isLogged ? setIsLogged(bool) : null,[isLogged])
    const setFbStatus    = useCallback((status) => ((status==="connected") !== isLogged) ? setIsLogged(status==="connected") : null,[isLogged] )
    const checkFbStatus  = useCallback(async () => {if(api){const r = await api.getLoginStatus(); setFbStatus(r.status)}}, [api])

    const cleanHandler   = useCallback(() => {setIsLogged(false); setFbData(null);},[])
    const logoutHandler  = useCallback(async () => {if(api){api.logout(l => print("l",l))}; cleanHandler()},[])
    const errorHandler   = useCallback((error) =>  console.log("error: ", error),[])

    //const logoutHandler = () => {api.logout()}

    const connectSuccessHandler = useCallback((r) =>  {const newData= {...r};print(newData);  facebookConnect({variables:{data:JSON.stringify(newData)}}); setFbData(newData);},[])
    const authSuccessHandler = useCallback((r) =>  {const newData= {...r};print(newData);  facebookAuthenticate({variables:{data:JSON.stringify(newData)}}); setFbData(newData);},[])

    //print("facebook", isLogged,fbData )

    const store = {
        //Logout:() => <LogoutButton onClick={logoutHandler}/>,
        Logout,
        Login,
        Connect,
        Status,
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