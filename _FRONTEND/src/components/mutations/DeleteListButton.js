import React,  { useState }  from 'react'
import { DELETE_LIST } from "../../functions/mutations";
import { withRouter } from 'react-router-dom'

import {  Mutation } from "react-apollo";
import { Button, Icon } from 'semantic-ui-react'
import FormModal from "../modal/FormModal"
import { PROFILE_LIGHT } from "../../functions/gql";
import { refetchMe } from "../../functions/requests";
import  { print, setLocalStorage } from "../../functions/lib"
import { toast } from 'react-toastify';
//import { useLocal } from "../../functions/hooks"


const DeleteListButton = (props) =>{
    const { item, refetchVariables } = props;
    const [isOpen, setOpen] = useState(false);
    
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    
    //const [myLists,updateLists] = useLocal()
    
    const infoNotify = (text) =>toast(text, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
        hideProgressBar: true,
        newestOnTop: false,
        closeOnClick: true,
        rtl: false ,
        pauseOnVisibilityChange:true,
        pauseOnHover:true
    })

    const closeAction = (data) =>{
        //setLocalStorage("LISTS", data.deleteList.profile.lists);
        //updateLists(JSON.stringify(fetchedList));
        //console.log("delete list",JSON.parse(localStorage.getItem("lists")))
        //updateLists(data.deleteList.profile.lists)
        setLoading(false);
        setError("");
        setOpen(false);
        props.history.push(`/user/${item.owner.username}`);
    }
    return (
        <div>
            {isOpen
            ?   <FormModal isOpen={isOpen} switcher={()=>setOpen(!isOpen)}>
                    <div style={{ height:"40vh", width:"100%", position:"relative", backgroundColor:"silver", borderRadius:15, padding:"1vmin" }}>
                        <div className="fbox fc jcc aic">
                            <p style={{marginBottom:10,marginTop:10,fontSize:30}}>You are deleting your list. Are you sure?</p>
                            <p style={{marginBottom:10,marginTop:10,fontSize:20}}>This action can not be recover!!!</p>
                            <div className="fbox fr jcc aic">
                                <Button color="grey"
                                    disabled={loading}
                                    content="No"
                                    onClick={() => closeAction()}
                                    />
                                    <Mutation
                                        mutation={DELETE_LIST} 
                                        variables={{ id:item.id }}
                                        onCompleted={(data) => (closeAction(data),  infoNotify("Successfully deleted"))}
                                        onError={ error =>  (setLoading(false), setError(error.message.split("GraphQL error:")[1]))}
                                        >
                                        {mutation => (
                                            <Button negative 
                                                loading={loading}
                                                color="red"
                                                content='Yes'
                                                onClick={() => (setLoading(true), mutation(refetchMe))}
                                                />
                                        )}
                                    </Mutation>

                            </div>
                        </div>
                    </div>
                </FormModal>

            :   <Button negative 
                    content='DELETE'
                    color="red"
                    onClick={() => setOpen(true)}
                    />
            }
        </div>
    );
};
export default withRouter(DeleteListButton);