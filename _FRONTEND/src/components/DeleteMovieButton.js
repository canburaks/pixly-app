import React,  { useState }  from 'react'
import { REMOVE_MOVIE } from "../functions/mutations";
import {  Mutation } from "react-apollo";
import { Button, Icon, Modal} from 'semantic-ui-react'
import { PROFILE_LIGHT } from "../functions/gql";
import { myRefetch } from "../functions/query";

import  { print } from "../functions/lib"
import { toast } from 'react-toastify';

const DeleteMovieButton = (props) =>{
    const { liste, items } = props;
    const [isOpen, setOpen] = useState(false);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


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

    const closeAction = () =>{
        setLoading(false);
        setError("");
        setOpen(false);
    }
    return (
        <Mutation
        mutation={REMOVE_MOVIE} 
        variables={{ movieId:item.id, listeId:liste.id}}
        onCompleted={(data) => (print("delete movie mutation:", data), closeAction(),  infoNotify("Movie Successfully Deleted"))}
        onError={ error =>  (setLoading(false), setError(error.message.split("GraphQL error:")[1]))}
            >
            {
                (mutation, {refetchQueries}) => (
                    <Modal closeIcon
                        size="mini" 
                        open={isOpen} 
                        onClose={() => closeAction()}
                        trigger={
                            <Icon link
                                name="remove circle"
                                size="large" 
                                color="black"
                                onClick={() => setOpen(true)}
                            />}  
                        >
                    <Modal.Header>Delete Your List</Modal.Header>
                    <Modal.Content>
                      <p>Are you sure you want to delete your list</p>
                      <p className="error">{error}</p>
                    </Modal.Content>
                    <Modal.Actions>
                      <Button negative
                        disabled={loading}
                        content="No"
                        onClick={() => closeAction()}
                        />
                      <Button positive 
                        loading={loading}
                        icon='checkmark' 
                        labelPosition='right' 
                        content='Yes'
                        onClick={() => (setLoading(true), 
                            mutation(myRefetch)
                            
                            )}

                        />
                    </Modal.Actions>
                  </Modal>
                )
            }
        </Mutation>
    );
};
export default DeleteMovieButton;