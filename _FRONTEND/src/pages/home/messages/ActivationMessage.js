import React from "react";
import { useState } from "react";
import { RESEND_REGISTRATION_MAIL, CHECK_VERIFICATION } from "../../../functions/mutations";
import { Mutation } from 'react-apollo'
import { InboxIcon, SendIcon } from "../../../assets/f-icons"
import { MessageBox } from "../../../components/MessageBox"

export const ActivationMessage = (props) => {
    const {status = false} = props;

    const [currentStatus, setCurrentStatus] = useState(status)
    //console.log("current status", currentStatus)

    const [response, setResponse] = useState(null)


    const image = response === null
                    ? <InboxIcon styles={{width:64, height:64}} className="no-click" />
                    : <SendIcon styles={{width:64, height:64}} className="no-click t-active" />

    if (currentStatus === true) return <div className="hidden"></div>
    return (
        <MessageBox
            header="Inactive Account"
            text="It looks like you did not activate your account. Please check your mailbox."
            image={image}
            content={
                    <div>
                        {response === null &&
                            <Mutation variables={{ username: localStorage.getItem("USERNAME") }}
                                mutation={RESEND_REGISTRATION_MAIL}
                                onCompleted={data => (console.log("resend", data), setResponse(data.resendMail.message))}
                                onError={e => (console.log(e.message), setResponse(e.message))}
                            >
                                {mutation => (
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
            }
        />
    )
}

