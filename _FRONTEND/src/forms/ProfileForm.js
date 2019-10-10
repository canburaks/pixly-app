import React, { useState } from "react";
import { Mutation } from "react-apollo";
import { PROFILE_MUTATION } from "../functions/mutations"
import { Button, Icon, Form, Message } from 'semantic-ui-react'

//import UploadAvatar from "../mutations/UploadAvatar"

const ProfileForm = ({ refetch, setEdit, profile }) => {
    const elements = {
        username: localStorage.getItem("USERNAME"),
        //name: profile.name ? profile.name : "",
        //bio: profile.bio ? profile.bio : "",
        //country: profile.country ? profile.country[1] :  "",
    }

    const [values, setValues] = useState(elements)
    const [errors, setErrors] = useState(elements)
    const [formError, setFormError] = useState("")

    

    function formValidation() {
        //Check errors on inputs
        const errorMessages = Object.values(errors).filter(em => em.length > 0)
        if (errorMessages && errorMessages.length > 0) {
            setFormError(errorMessages[0])
            return false
        }
        else {
            setFormError("")
            return true
        }
    }
    function submitHandler(mutation) {
        const isValid = formValidation()
        if (isValid) mutation(values)
    }


    function updateLocalValues(value) {
        const newValues = { ...values, ...value }
        if (values[Object.keys(value)[0]] !== Object.values(value)[0]) {
            setValues(newValues)
        }
    }

    function updateLocalErrors(value) {
        const newErrors = { ...errors, ...value }
        if (errors[Object.keys(value)[0]] !== Object.values(value)[0]) {
            setErrors(newErrors)
        }
    }

    return (
        <div className="form-main-box" >

        </div>
    );
}

export default ProfileForm;
