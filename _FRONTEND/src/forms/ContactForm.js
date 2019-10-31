import React, { useEffect, useState, useContext } from "react";
import gql from "graphql-tag";
import { Mutation } from 'react-apollo'
import { emailValidator, passwordValidator, usernameValidator } from "../functions/form"
//import { Input} from "cbs-react-components"
import { EnvelopeIcon, WarningIcon, InfoIcon, SuccessIcon } from "../assets/f-icons"
import { Input } from "../styled-components"

import { GlobalContext } from "../";

const ContactForm = (props) =>{
    const elements = {
        name: "",
        email: "",
        message: "",
    }
    
    const state = useContext(GlobalContext)
    const [ name, setName ] = useState("")
    const [ email, setEmail ] = useState("")
    const [ message, setMessage ] = useState("")
    const [ errors, setErrors ] = useState(elements)

    const [ formError, setFormError ] = useState("")

    const [ loading, setLoading ] = useState(false)
    const [ showForm, setShowForm ] = useState(true)
    const [ status, setStatus ] = useState(false)


    function updateLocalErrors(value) {
        const newErrors = { ...errors, ...value }
        if (errors[Object.keys(value)[0]] !== Object.values(value)[0]) {
            setErrors(newErrors)
        }
    }
    const styles = {
        form:{
            backgroundColor:"var(--color-light)",
            padding:"32px 16px",
            borderRadius:16,
        }
    }
    function responseIcon() {
        if (status === true) return <SuccessIcon className="form-response-icon success-icon" />
        else if (status === false) return <WarningIcon className="form-response-icon warning-icon" />
    }

    function mutationCompleteHandler(data) {
        setLoading(false)
        const result = data.contactMutation;
        //console.log("mutation completed:", result)
        setShowForm(false)
        setFormError(result.message)
        if (result.status === true) setStatus(true)

    }
    function mutationErrorHandler(error) {
        //console.log("mutation error: ", error)
        setLoading(false)
        setFormError(error.message)
    }


    function formValidation() {
        //Check Empty inputs
        if (name.length === 0 || message.length === 0 || email.length === 0 ){
            setFormError(`You didn't fill all places. `)
            return false
        }
        //Check errors on inputs
        const errorMessages = Object.values(errors).filter(em => em.length > 0)
        if ( errorMessages.length > 0 ){
            setFormError(errorMessages[0])
            return false
        }
        else{
            setFormError("")
            return true
        }
    }
    function submitHandler(mutation) {
        const isValid = formValidation()
        if (isValid) {
            //props.dispatchValues(values)
            setLoading(true)
            mutation()
        }
    }


    console.log(name, email, message)
    return(
        <div className="contact-form" style={styles.form}>

        {showForm && 
            <div>
            <Input
                label={"Name"}
                type="text"
                placeholder={"Your Name"}
                getValue={(e) => setName(e)}
                getError={e => updateLocalErrors({name:e})}
                validation={e => e.length>4}
                validationMessage={"Please enter a valid name"}
            />
            <Input
                label={"email"}
                type="email"
                placeholder={"John@maildomain.com"}
                getValue={(e) => setEmail(e)}
                getError={e => updateLocalErrors({ email: e })}
                validation={emailValidator}
                validationMessage={"Please enter a valid mail adress."}
            />

            <textarea 
                rows="4" cols="50"
                placeholder="Your Message"
                required
                maxLength="4000"
                onChange={e => setMessage(e.target.value)}
            
            >
                {message}
            </textarea>
            
            <p className="form-validation">{formError}</p>
            
            <Mutation
                mutation={CONTACT_MUTATION}
                variables={{ name, message, email}}
                onCompleted={data => mutationCompleteHandler(data)}
                onError={(e) => mutationErrorHandler(e)}
            >
                {mutation => (
                    <button
                        className="btn primary w100 xs"
                        onClick={() => submitHandler(mutation)}
                    >
                        SEND YOUR MESSAGE
                    </button>
                )}
            </Mutation>
            </div>}

            {!showForm && 
                <div className="fbox-c jcfs aic">
                    {responseIcon()}
                    <p className="t-color-dark" >{formError}</p>
                    <button
                        className="btn primary w100 xs"
                        onClick={() => state.methods.toggleModal()}
                    >
                        CLOSE 
                    </button>
                </div>
            }

        </div>
    )
}

const CONTACT_MUTATION = gql`
  mutation contactMutation($name:String!,  $email:String, $message:String){
    contactMutation(name:$name, email:$email, message:$message){
        status, message
    }
  }
`

export default ContactForm;