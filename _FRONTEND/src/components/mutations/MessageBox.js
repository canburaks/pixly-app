import React from "react";
import { useState} from "react";
import { Menu, Message, Icon } from 'semantic-ui-react'
import { RESEND_REGISTRATION_MAIL, CHECK_VERIFICATION } from "../../functions/mutations";
import { Mutation } from 'react-apollo'
import { InboxIcon, SendIcon } from "../../assets/f-icons"


export const ActivationMessage = (props) =>{
    const {
        status=false, 
        header, 
        text 
    } = props;

    const [currentStatus, setCurrentStatus] = useState(status)
    //console.log("current status", currentStatus)

    const [ response, setResponse ] = useState(null)

    const styles={
        container:{
            width:"100%",
            maxHeight:150,
            border:"1px solid rgba(40,40,40, 0.4)",
            boxShadow:"1px 5px 8px -8px rgba(0,0,0, 0.9)",
            padding:"12px",
            margin:12
        },
        panel:{
            width:"25%",
            height:"100%"
        },
        icon:{
            width:64,
            height:64
        },
        sendIcon:{
            width: 64,
            height: 64
        }
    }


    if (currentStatus === true) return <div className="hidden"></div>
    return(
        <div className="fbox-r jcsb aic" style={styles.container}>
            <div className="fbox-c jcfs">
                {response === null &&<h6 className="t-color-dark t-bold mar-bt-2x">{header}</h6>}
                {response===null && <p className="t-color-dark">{text}</p> }
                {response !== null && <h6 className="t-color-dark t-bold mar-bt-2x">{response}</h6>}

                {response === null &&
                <Mutation variables={{username:localStorage.getItem("USERNAME")}}
                    mutation={RESEND_REGISTRATION_MAIL}
                    onCompleted={data => (console.log("resend", data), setResponse(data.resendMail.message)) }
                    onError={e => (console.log(e.message), setResponse(e.message)) }
                >
                    {mutation =>(
                        <p className="t-color-dark t-s">Did not get the mail? 
                            <span className="t-underline t-active click" onClick={mutation}> Resend Confirmation Mail</span>
                        </p>
                    )}
                </Mutation>}

                <Mutation variables={{ username: localStorage.getItem("USERNAME") }}
                    mutation={CHECK_VERIFICATION}
                    onCompleted={data => (console.log("check_Verification", data), setCurrentStatus(data.checkVerification.status))}
                    onError={e => (console.log(e.message), setResponse(e.message))}
                >
                    {mutation => (
                        <p className="t-color-dark t-s">Did you already verified?
                            <span className="t-underline t-active click" onClick={mutation}>Verified</span>
                        </p>
                    )}
                </Mutation>
            </div>

            <div className="fbox-c jcfs aic" style={styles.panel}>
                {response === null  
                ? <InboxIcon styles={styles.icon} className="no-click" />
                : <SendIcon styles={styles.icon} className="no-click t-active" />
                }
            </div>

        </div>
    )

}

