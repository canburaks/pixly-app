import React, { useState } from "react";
import { Mutation } from "react-apollo";
import  { PROFILE_MUTATION } from "../../functions/mutations"
import { Button, Icon, Form, Message } from 'semantic-ui-react'

import CountryWidget from "./CountryWidget"
import  UploadAvatar  from "../mutations/UploadAvatar"
import  { print } from "../../functions/lib"

const ProfileUpdateForm = ({refetch, setEdit,profile}) =>{
    const [ name, setName ] = useState(profile.name ? profile.name : "")
    const [ bio, setBio ] = useState(profile.bio ? profile.bio : "")
    const [ country, setCountry ] = useState(profile.country ? profile.country[1] : null)
    //after mutation disabled input element
    const [ disabled, setDisabled ] = useState(false)

    const [errorMessage, setErrorMessage] = useState(null)
    const [successMessage, setSuccessMessage] = useState(null)

    const username = localStorage.getItem("USERNAME")


    const MessageSetter = (loading)=>{
        if (loading) return <Message icon={<Icon name='circle notched' loading />} content={"Just one second"} size="small"/>
        else if (successMessage) return <Message positive content={successMessage} size="small"/>
        else if(errorMessage) return <Message error content={errorMessage} size="small"/>
    }
    const onComplete = (data) =>{
        print("Mutation result", data)
        setSuccessMessage("Your settings saved. You can close the form")
        setTimeout(()=>setDisabled(true),2000)
    }
    const onError = (e) =>{
        print("Mutation result", e)
        setErrorMessage("We are not currently performing your request. Please try again later.")
        setTimeout(()=>setDisabled(true),2000)

    }
    const styles = {
        box:{ borderRadius: 10, padding: 15, position: "relative", backgroundColor:"var(--color-light)" },
        form: { marginBottom: 20 }
    }
    return(
        <div style={{ backgroundColor:"var(--color-dark)", borderRadius:8}} >
        <Mutation 
            mutation={PROFILE_MUTATION} variables={{username, bio, country, name}}  
            onCompleted={d => onComplete(d)} onError={e => onError(e.message)}
            >
        {(mutation, {loading})=>{
            return(
            <div className="bgc-light" style={styles.box}>
                <Form>
                    <Form.Field style={styles.form}>
                        <label>Profile Picture</label>
                        <UploadAvatar refetch={refetch}  />
                        </Form.Field>
                </Form>

                <Form loading={loading}>
                    <Form.Field>
                        <label>Name<span style={{color:"rgba(76, 76, 76, 0.5)", fontSize:10, marginLeft:5}}>{name.length>30 && `(${40 - name.length})` }</span></label>
                        <input disabled={disabled} placeholder='Name' maxLength={40} onChange={e => setName(e.target.value)} value={name} />
                    </Form.Field>
                    <Form.Field>
                        <label>Bio<span style={{color:"rgba(76, 76, 76, 0.5)", fontSize:10, marginLeft:5}}>({140 - bio.length})</span></label>
                        <input disabled={disabled} placeholder='Bio' maxLength={140} onChange={e => setBio(e.target.value)} value={bio} />
                    </Form.Field>

                    <Form.Field className="pad-bt-4x" style={{marginBottom:20}}>
                        <label>Country</label>
                        <CountryWidget value={country} valueSetter={(c) => setCountry(c)} disabled={disabled}/>
                    </Form.Field>
                    {MessageSetter(loading)}

                    <Button 
                        className="mar-t-2x"
                        color='teal' 
                        type="submit" 
                        loading={loading} 
                        onClick={() => mutation(refetch)} 
                        disabled={disabled} >Update</Button>
                </Form>
            </div>
        )}}
        </Mutation>
        </div>
        );
}

export default ProfileUpdateForm;
