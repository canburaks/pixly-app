import React,  { useState }  from 'react'
import { CREATE_LIST } from "../../functions/mutations";


import {  Mutation } from "react-apollo";
import { Button, Input, Form, TextArea, } from 'semantic-ui-react'
import FormModal from "../modal/FormModal"
import  { print } from "../../functions/lib"
import { toast } from 'react-toastify';
//import useLocalStorage from "react-use-localstorage";
//import { useLocal } from "../../functions/hooks"
import { refetchMe } from "../../functions/requests";

const CreateListButton = (props) =>{
    const { styles, refetch, switcher, isOpen } = props;
    
    const [name, setName] = useState("");
    const [ summary, setSummary ] = useState("");
    
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    //const [myLists, updateLists] = useLocal()


    const infoNotify = (text) =>toast.success(text, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
        hideProgressBar: true,
        newestOnTop: false,
        closeOnClick: true,
        rtl: false ,
        pauseOnVisibilityChange:true,
        pauseOnHover:true
    })

    const isValid = () =>{
        if (name.length>1 
            && name.length<100 
            && summary.length>1 
            && summary.length<500){
                return true
            }
        else return false
    }
    const closeAction = async (data) =>{
        print(" create list ",data.createList.profile)
        const updatedLists = data.createList.profile.lists;
        //localStorage.setItem("LISTS", JSON.stringify(updatedLists))
        //updateLists(updatedLists)
        //updateLists([...updatedLists])
        //updateLists(JSON.stringify(updatedLists));
        //update(data.createList.profile.lists)
        setName("");
        setSummary("");
        setLoading(false);
        setError("");
        switcher();
    }
    return(
        <FormModal isOpen={isOpen} switcher={() => switcher()}>
        <div style={{ height:"50vh", width:"100%", position:"asolute", backgroundColor:"silver", borderRadius:15, padding:"1vmin" }}>
            <div className="fbox fc jcc aic" style={{height:"100%", width:"100%"}} >
                <Form style={{width:"100%"}}>
                    <Form.Field required
                        id='form-create-list-name'
                        control={Input}
                        disabled={loading}
                        label='Name of the list. (List names should be unique)'
                        placeholder='Name of the list (max 100 chars.)'
                        error={name.length>=100}
                        onChange={e =>  setName(e.target.value) }
                    />
                    <Form.Field required
                        id='form-create-list-summary'
                        control={TextArea}
                        disabled={loading}
                        label='Description'
                        placeholder='Description of the list (max 500 chars.)'
                        error={summary.length>=500}
                        onChange={e =>  setSummary(e.target.value)}
                    />
                    <p className="error" >{error}</p>
                </Form>

            <div className="fbox fr jcc aic" style={{height:"20%", width:"80%"}} >
                <Button 
                    style={{ width:"50%" }}
                    onClick={() => switcher()}
                    disabled={loading}
                    color="red">
                    CANCEL
                </Button>
                
                <Mutation 
                    mutation={CREATE_LIST} 
                    variables={{ name, summary}}
                    onCompleted={ (data) => (closeAction(data), infoNotify("Successfully created"))}
                    onError={ error =>  (setLoading(false), setError(error.message.split("GraphQL error:")[1]))}
                    >
                    {mutation => 
                        <Button 
                            style={{ width:"50%" }}
                            color='green'
                            content="Save"
                            onClick={()=> (setLoading(true), mutation(refetchMe) )}
                            disabled={!isValid()}
                            loading={loading}
                            />
                        }
                </Mutation>
                </div>
                </div>

        </div>
    </FormModal>
    );
};

export default CreateListButton;