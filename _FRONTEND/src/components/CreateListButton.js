import React,  { useState }  from 'react'
import { CREATE_LIST } from "../functions/mutations";
import { PROFILE_LIGHT } from "../functions/gql";
import { myRefetch } from "../functions/query";

import {  Mutation } from "react-apollo";
import { Button, Header, Icon, Modal, Input, Form, TextArea, Label } from 'semantic-ui-react'
import  { print } from "../functions/lib"
import { toast } from 'react-toastify';

const CreateListButton = (props) =>{
    const { styles, refetch } = props;
    const [isOpen, setOpen] = useState(false);

    const [name, setName] = useState("");
    const [ summary, setSummary ] = useState("");

    const [ is_private, setPrivate ] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


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
    const closeAction = () =>{
        setName("");
        setSummary("");
        setLoading(false);
        setPrivate(false);
        setError("");
        setOpen(false);
    }
    return(
        <Mutation 
            mutation={CREATE_LIST} 
            variables={{ name, summary, public:!is_private }}
            onCompleted={ (data) => (print("create list mutation:", data), closeAction(), infoNotify("Successfully created"))}
            onError={ error =>  (setLoading(false), setError(error.message.split("GraphQL error:")[1]))}
                >
            {   mutation => (
                <Modal
                    open={isOpen}
                    closeOnDimmerClick
                    onClose={() => closeAction()}
                    trigger={ styles.text 
                        //for shorthand movie dropdown menu
                        ? <Label onClick={() => setOpen(!isOpen)}>
                            <Icon link
                                name={styles.name}
                                size={styles.size}
                                color={styles.color}
                                
                                />{styles.text}
                        </Label>
                        //for just icon
                        : <Icon link
                            name={styles.name}
                            size={styles.size}
                            color={styles.color}
                            onClick={() => setOpen(!isOpen)}
                            />
                        }>
                <Header icon='list ul' content='Create New List' />
                <Modal.Content>
                    <div className="fbox fc">
                    <Form >
                        <Form.Field required
                            id='form-create-list-name'
                            control={Input}
                            disabled={loading}
                            label='Name of the list'
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
                        {/*<Form.Checkbox toggle
                            id="form-create-list-private"
                            label={is_private ? "Private" : "Public"}
                            disabled={loading}
                            checked={is_private}
                            onChange={()  => setPrivate(!is_private) }
                        />*/}
                        <p className="error" >{error}</p>
                    </Form>

                    </div>
                </Modal.Content>
                <Modal.Actions>
                    <Button 
                        color='red'
                        content="Cancel"
                        onClick={() => closeAction()} 
                        disabled={loading}
                        />
                    <Button 
                        color='green'
                        content="Create List"
                        onClick={()=> (setLoading(true), mutation(myRefetch) )}
                        disabled={!isValid()}
                        loading={loading}
                        />
                    

                </Modal.Actions>
                </Modal>
                )
            }
        </Mutation>
    );
};

export default CreateListButton;