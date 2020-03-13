import React from "react";
import { useState, useContext, useCallback, useMemo} from "react";
import { withRouter } from "react-router-dom";
import useForm from "react-hook-form";
import { Mutation, useQuery, useMutation} from "react-apollo";
import gql from "graphql-tag";
import { RESEND_REGISTRATION_MAIL, PROFILE_MUTATION, IMAGE_UPLOAD } from "../../functions/mutations";

import { rgaPageView, Head, HomePageFeedAd, print,FeedMobileCollectionAd, MidPageAd,
    useAuthCheck, useWindowSize, facebook, countries
} from "../../functions"
import { GlobalContext } from "../../";
import { GlobeIcon, HomeIcon, SettingsIcon } from "../../assets/f-icons"


//import { MessageBox } from "../../components/MessageBox"
import {ActivationMessage} from "./messages/ActivationMessage"
import { RecommendationsInfo } from "./messages/RecommendationsInfo"
//import { MiniMovieCard } from "../../styled-components"

import "../pages.css"

import { 
    ListCard, DirectorCard, CoverCard , HeaderMini, FlexBox, MovieCoverCard, Stats,
    ImageCard, Grid, ElementListContainer, MovieCoverBox,
    Menu, MenuItem, PageContainer, ContentContainer, Image, Loading, Error,
    ProfileCoverPanel,PlaceIcon, MessageBox,NewestCollectionCard,
    Input, Form
} from "../../styled-components"



const ProfileInfoForm = props => {
	const state = useContext(GlobalContext);

	return (
		<Mutation
			mutation={PROFILE_MUTATION}
			onCompleted={data => (
				console.log("completed"), state.methods.toggleModal()
			)}
		>
			{mutation => (
				<ProfileForm
					{...props}
					onSubmit={qv => mutation({ variables: { ...qv } })}
				/>
			)}
		</Mutation>
	);
};

const SettingsPage = props => {

    const Fb = facebook()
	const state = useContext(GlobalContext);
    const { register, handleSubmit, errors } = useForm();
    const [updateProfile, { data }] = useMutation(PROFILE_MUTATION, {onCompleted(data){ completedCallback(data)}});


    const profile = props.data.persona.profile
    const refetch = props.refetch

    const mutate = (qv) => updateProfile({ variables: { ...qv } })

	const completedCallback = (data) => {
		console.log("profile updated", data)
	}

	const onSubmit = data => {
		const qv = {};
		qv.name = data["Full Name"];
		qv.bio = data["Bio"];
		qv.country = data["Country"];
		qv.username = profile.username;
		//console.log("profile info mutation qv: ", qv)
		mutate(qv);
	};

	return (
        <PageContainer alignItems="center">
            <Form
                onSubmit={handleSubmit(onSubmit)}
                className="frm-form profile-info-form"
            >
                <div className="fbox-r jcc aic t-bold t-center bor-b-color-dark bor-b-w2">
                    Update Profile
                </div>
                <div className="frm-box mar-t-4x">
                    <label className="frm-label">Avatar</label>
                    <div className="fbox-r jcfs aic w100 mar-b-4x">
                        <Image src={profile.avatar} width={"80px"} height={"80px"} borderRadius="100%" />
                        <UploadAvatar refetch={refetch} />
                    </div>
                </div>

                <div className="frm-box">
                    <label className="frm-label">Name</label>
                    <Input
                        className="frm-item"
                        defaultValue={profile.name}
                        type="text"
                        placeholder="Full Name"
                        name="Full Name"
                        ref={register({ maxLength: 40 })}
                    />
                </div>

                <div className="frm-box">
                    <label className="frm-label">Bio</label>
                    <Input
                        className="frm-item"
                        name="Bio"
                        type="text"
                        ref={register({ maxLength: 140 })}
                        defaultValue={profile.bio}
                    />
                </div>

                <div className="frm-box">
                    <label className="frm-label">Country</label>
                    <select
                        className="frm-select frm-item"
                        name="Country"
                        ref={register}
                        defaultValue={
                            profile.country && profile.country[1]
                        }
                    >
                        {Object.keys(countries).map(c => (
                            <option value={c} key={c}>
                                {countries[c]}
                            </option>
                        ))}
                    </select>
                </div>
                <Input className="frm-item info-submit" type="submit" />

                <FlexBox justifyContent="center" alignItems="center" className="fb-cont-box">
                    <Fb.Connect />
                </FlexBox>
            </Form>
        </PageContainer>
	);
};

const UploadAvatar = ({refetch}) =>{
    const [errorMessage, setErrorMessage] = useState(null)
    const [successMessage, setSuccessMessage] = useState(null)
    //after mutation disabled input element
    const [ disabled, setDisabled ] = useState(false)

    //development: make it false for upload 
    const prevent = false;
    
    const Message = (props) =>(
        <div>{props.content}</div>
    )
    
    const MessageSetter = (loading)=>{
        if (loading){
            return <Message  content={"Just one second"} size="mini"/>
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



export const SettingsPageQuery = () => {
    const { loading, error, data, refetch } = useQuery(PERSONA_MINI, { variables:{username:localStorage.getItem("USERNAME")}})
    console.log("query", data)
    if (loading) return <Loading />
    if (error) return <Error />
    if (data) return <SettingsPage data={data} refetch={refetch}/>
};

const PERSONA_MINI = gql`
query persona($username:String!){
    persona(username:$username){
        profile{
            username,
            name,
            bio,
            country,
            points,
            active,
            avatar,
            isSelf,
            mailSubsStatus,
            cognitoVerified,
            cognitoRegistered,
            shouldChangePassword,
        }   
    }
}
`
