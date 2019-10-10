import React, {useState} from "react";
import { Mutation } from "react-apollo";
import  { IMAGE_UPLOAD } from "../functions/mutations"
import { Icon, Message } from 'semantic-ui-react'


const UploadAvatar = ({refetch}) =>{
    const [errorMessage, setErrorMessage] = useState(null)
    const [successMessage, setSuccessMessage] = useState(null)
    //after mutation disabled input element
    const [ disabled, setDisabled ] = useState(false)

    //development: make it false for upload 
    const prevent = false;

    const MessageSetter = (loading)=>{
        if (loading){
            return <Message icon={<Icon name='circle notched' loading />} content={"Just one second"} size="mini"/>
        }
        else if(errorMessage && !successMessage){
            return <Message error content={errorMessage} size="mini"/>
        }
        else if (successMessage){
            return <Message positive content={successMessage} size="mini"/>
        }
    }

    function checkFile(file){
        console.log(file)
        //check content type
        if(!file.type.includes("image")){
            setErrorMessage("You should provide valid image")
            return false
        }
        console.log(file.type.split("/")[1])
        //Check file type only (jpg, jpeg, png) allowed
        if(file.type.split("/")[1]!="jpg" && file.type.split("/")[1]!="jpeg" && file.type.split("/")[1]!="png"){
            setErrorMessage("You can only upload jpg or png image")
            return false
        }
        //File size limit
        if(file.size>3500000){
            setErrorMessage("You can't upload a picture with size more than 3MB")
            return false
        }

        return true

    }
    return(
        <Mutation mutation={IMAGE_UPLOAD}
            onError={e => console.log("error", e)}
            onCompleted={d => d.uploadAvatar.success===true 
                ? (setSuccessMessage("You Image was saved"), refetch(), setTimeout(() => setSuccessMessage(null), 2000), setDisabled(true) ) : 
                (setErrorMessage("Error, please try again later"), setDisabled(true))  
            }
            >
            {(mutate, {loading}) => (
                <div style={{width:"100%"}} className="fbox-c fw jcfs aic">
                    <input aria-label="File browser example"
                        type="file" 
                        className="frm-file-input w100"
                        disabled={disabled}
                        onChange={ ({ target: {validity, files: [file]} }) => (
                        (validity.valid && checkFile(file) && !prevent )
                            && mutate({variables: { file} }) )
                        }/>
                    {MessageSetter(loading)}
                </div>
            )}
        </Mutation>
    )
}

export default UploadAvatar;
//                onChange={ ({ target: {validity, files: [file]} }) => validity.valid && mutate({ variables: { file, username:localStorage.getItem("USERNAME") } }) }
