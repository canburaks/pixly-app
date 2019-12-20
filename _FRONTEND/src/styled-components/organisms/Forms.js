import React from "react";
import { useMemo, useState,useCallback, useEffect } from 'react';
import {  useWindowSize, useValues, print } from "../../functions" 
import useForm from "react-hook-form";
import { useMutation } from "react-apollo";

import { passwordValidator, facebook } from "../../functions"
import { 
    Box, Text, NewLink, TopPanelBackElement, TopPanelCoverElement,
    DirectorLink, DirectorLinks,FlexBox, TagText,
    LikeMutation,BookmarkMutation, RatingMutation, FollowMutation,
    UsersIcon, EyeIcon,UserIcon,
    Input, Form,FormInput,  ActionButton, SignupMutation
} from "../index"
import { SimpleModal } from "../elements";

export const SignupForm = (props) => {
    const { register, handleSubmit, errors, getValues, formState, watch, triggerValidation, validate } = useForm();
    const [ validFormData, setFormData ] = useState(null)

    //const watchPassword = watch("Password")
    //const isPasswrowdValid = useMemo( async () => await triggerValidation("Password", watchPassword))
    //console.log("watch", watchPassword, isPasswrowdValid)
    //triggerValidation("Password", watchPassword)


	const onSubmit = (data) => {
        const qv = {};
        if (props.avatarUrl) qv.avatarUrl = props.avatarUrl
        if (props.fbData) qv.fbData = JSON.stringify(props.fbData)
		qv.name = data["Name"];
		qv.username = data["Username"];
        qv.email = data["Email"];
        qv.password = data["Password"];
		//console.log("profile info mutation qv: ", qv)
        print("signup form submit data",qv);
        setFormData(qv)
    };

    const checkRePassword = useCallback((rePassword) => rePassword === getValues().Password || "Passwords doesn't match.", [])
    //print("props", props)
    //print("signup form errors:", errors)
    //print("signup form state:", formState)
    //print("get-set", getValues())
    //          06301987Cbs
    return(
        <Form onSubmit={handleSubmit(onSubmit)} p={[2]} zIndex={20}>
            <FormInput 
                name={"Name"}
                defaultValue={props.name || ""}
                placeholder={"Your Full Name"}
                formRef={register({ required: "Name can not be empty", maxLength: 40 })}
                error={errors.Name && errors.Name.message}
                status={props.name ? "success" : null}
            />
            <FormInput 
                name={"Username"}
                defaultValue={props.username || ""}
                placeholder={"Your Unique Username"}
				formRef={register({
                        required: "Username can only contains alphanumeric characters, hyphen and underline",
                        maxLength: 16,
                        pattern: /^[a-zA-Z0-9]+([a-zA-Z0-9](_|-| )[a-zA-Z0-9])*[a-zA-Z0-9]+$/i
                    })}
                error={errors.Username && errors.Username.message}
                status={props.username ? "success" : null}
                />

            <FormInput 
                name={"Email"}
                type="email"
                defaultValue={props.email || ""}
                placeholder={"Your email adress for verification."}
				formRef={register({
                        required: "Please enter a valid mail adress",
                        minLength: 4,
                        maxLength: 40,
                        pattern: /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
                    })}
                error={errors.Email && errors.Email.message}
                status={props.email ? "success" : null}
                />
            <FormInput 
                name={"Password"}
                type="password"
                defaultValue={""}
                autoFocus={props.focus === "Password"}
                autoComplete="new-password"
                placeholder={"Min. 8 alhanumeric,uppercase and lowercase "}
				formRef={register({
    					required: "Minimum 8 alhanumeric,uppercase and lowercase chars.",
    					minLength: 8,
    					maxLength: 18,
                        validate: value => passwordValidator(value) || "Minimum 8 alhanumeric,uppercase and lowercase chars."
    					//pattern: ({
                        //    pattern:/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,18}$/i,
                        //    message:"Minimum 8 alhanumeric,uppercase and lowercase chars."
                        //})
    				})}
                error={errors.Password && errors.Password.message}
                />
            <FormInput 
                name="Re-Password"
                type="password"
                defaultValue=""
                autoComplete="new-password"
                placeholder="Password Again"
				formRef={register({
                        required: true,
    					minLength: 8,
    					maxLength: 18,
                        validate: checkRePassword
    				})}
                error={errors["Re-Password"] && errors["Re-Password"].message}
                />
            <SignupMutation 
                data={validFormData}
                alignSelf="center"
            />

        </Form>
    )
}

export const SignupFormModal = (props) => {
	const [isFbLoaded, setFbLoaded] = useState(false)
	const Fb = facebook()
    return (
    <SimpleModal 
        isOpen={props.isOpen} closeModal={props.closeModal} 
        width={["90vw","90vw","80vw", "60vw"]} maxWidth={"400px"}
        bg="light" color="dark" zIndex={100} over
    >
        <SignupForm {...props} />
        <Fb.Auth dispatchLoadedSignal={setFbLoaded}/>

    </SimpleModal>
)}