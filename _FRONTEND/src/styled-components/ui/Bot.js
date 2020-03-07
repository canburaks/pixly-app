import React, { useCallback } from "react";
import { useContext, useState, useReducer, useEffect,useMemo } from "react";
import ChatBot from "react-simple-chatbot";
import { ThemeProvider } from "styled-components";
import { useMutation, useApolloClient } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { emailValidator } from "../../functions/form";
import { Box } from "../index"
// all available props
const theme = {
	background: "#f1f1f1",
	fontFamily: "Helvetica Neue",
	headerBgColor: "#3437c7",
	headerFontColor: "#fff",
	headerFontSize: "16px",
	botBubbleColor: "#3437c7",
	botFontColor: "#fff",
	userBubbleColor: "#fff",
	userFontColor: "#4a4a4a",
};

export const Bot = () => {
    const [success, setSuccess] = useState(null)
    const handleSuccess = useCallback(() => setSuccess(true),[])
    // Mutation
	
    //console.log("bot state: ",success, message, email)
	
    const floatingStyle = {left:32, border:"1px solid rgba(0,0,0,0.4)", boxShadow:"0 4px 8px rgba(0,0,0,0.35)"}
	const steps = useMemo(() => [
		{
			id: "1",
			message: "Hi, Feel free to write your message or feedback.",
			trigger: "message"
		},
		{
			id: "message",
			user: true,
			trigger:"3"
        },
		{
			id: "3",
			message: "What is your mail adress?",
			trigger: "email"
		},
		{
			id: "email",
            user: true,
            validator:emailValidator,
			trigger:"6"
        },
        {
            id: '6',
            component: <ContactMessageMutation setSuccess={handleSuccess} />,
            waitAction: true,
            trigger: 'final',
        },
		{
            id: "final",
            message:"Thanks, we received your message, if necessary we will contact you.",
			end:true
        },
		//{
		//	id: "success",
        //    message: "Thanks, we received your message, if necessary we will contact you.",
		//	end: true
        //},
        // Errors
		{
			id: "10",
			message: "Please enter a valid email address.",
			trigger: "3"
        },
		{
			id: "fail",
			message: "There is a problem occured. Please try again later. Thanks for your patience.",
			end:true
		},
	],[success])

	return (
		<ThemeProvider theme={theme}>
			<ChatBot steps={steps} floating floatingStyle={floatingStyle} />
		</ThemeProvider>
	);
};

const CONTACT_MUTATION = gql`
    mutation contactMutation($message: String, $email:String) {
        contactMutation(message:$message, email:$email) {
            status, message
        }
    }
`;


const ContactMessageMutation = (props) => {
    //console.log("props", props)

    const [contactMutation, { data, loading, error }] = useMutation(CONTACT_MUTATION, {
        onCompleted:(data) => props.triggerNextStep()
    });

    useEffect(()=>{
        contactMutation({variables:{message:props.steps.message.value, email:props.steps.email.value}})
    },[])

    const handleResponse = () => {
        if (loading) return "Sending..."
        if (error){
            //props.triggerNextStep()
            return "Error"
        }
        if (data){
            return ""
        }
        else {
            return ""
        }
    }

	return (
		<Box width={"100%"} height="auto">
			{handleResponse()}
		</Box>
)}
