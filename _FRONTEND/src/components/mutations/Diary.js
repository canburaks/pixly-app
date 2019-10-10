import React from "react";
import {  Mutation } from "react-apollo";
import { RATING_MUTATION } from "../../functions/mutations";
import {  Button, TextArea } from "semantic-ui-react";
import {  print } from "../../functions/lib"
import { useState } from 'react';

import ReactStars from 'react-stars'
import DatePicker from "react-datepicker";
import { toast } from 'react-toastify';

import FormModal from "../modal/FormModal";

import "react-datepicker/dist/react-datepicker.css";
var moment = require('moment');

const Diary = (props) => {

    const styles={
        modalBox:{
            width:"60%"
        },
        labelStyle:{
            fontSize:"0.9em",
            fontWeight:"bold",
            marginRight:5
        },
        textFieldStyle:{
            height:"70%",
            overflow:"visible",
            width:"100%"
        }
    }
    const { item,isOpen, switcher } = props;
    const id = item.id

    // Create moment if date exist or create new one
    const momentDate = item.viewerRatingDate ? moment(item.viewerRatingDate) : moment()
    // Date for mutation
    const [date, setDate] = useState(momentDate._d) 
    // Date for showing on DatePicker
    const [notes, setNotes] = useState(item.viewerNotes || "")
    const [rate, setRate] = useState(item.viewerRating)
    const [loading, setLoading] = useState(false)
    const [visibility, setVisibility] = useState(true)
    const [edit, setEdit] = useState(true)
    //Modal status. For close after saving diary
    console.log(date, momentDate)
    const successNotify = (text) => toast.success(text, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
        hideProgressBar: false,
        newestOnTop: false,
        closeOnClick: true,
        rtl: false ,
        pauseOnVisibilityChange:true,
        pauseOnHover:true
    })

    return(

            <FormModal isOpen={isOpen} switcher={() => switcher()}>
                <div style={{ height:"50vh", width:"100%", position:"relative", backgroundColor:"silver", borderRadius:15, padding:"3vmin" }}>

                    <div className="fbox fr jcfs aic" style={{height:"30%", width:"100%"}} >
                        <div style={{width:"40%"}} >
                            <label style={styles.labelStyle} >Rating</label>
                            <ReactStars half value={rate}
                                size={20}
                                disabled={!edit}
                                style={ !edit ? {color:"grey"} : {color:"yellow"} } 
                                title={!edit ? "Please activate Edit" : "Rate and Save Please!"}
                                onChange={(value) => setRate(value) }
                            />
                        </div>

                        <div style={{width:"60%"}} >
                            <label style={styles.labelStyle} >When you watched this movie?</label>
                            <DatePicker
                                dateFormat="yyyy/MM/dd"
                                selected={date}
                                onChange={(value) => (setDate(moment(value)._d)) }
                                />
                        </div>
                    </div>

                    <div className="fbox fc jcfs aic" style={{height:"40%", width:"100%"}} >
                    <TextArea
                        style={styles.textFieldStyle}
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        type="text"
                        placeholder="notes"
                    />
                    </div>

                    <div className="fbox fr jcse aic" style={{height:"10%", width:"100%"}} >
                        <Button 
                            style={{ width:"50%" }}
                            onClick={() => switcher()}
                            disabled={loading || rate===null || !visibility}
                            color="red">
                            CANCEL
                        </Button>
                        
                        <Mutation mutation={RATING_MUTATION}
                            variables={{ id, rate, date:moment(date).format("YYYY-MM-DD"), notes}}
                            onCompleted={(data) => (
                                console.log(data),
                                setLoading(false),
                                setVisibility(false),
                                successNotify("Saved"),
                                switcher()
                                )}>
                            {mutation => 
                                <Button 
                                    style={{ width:"50%" }}
                                    disabled={loading || rate===null || !visibility}
                                    color="green" 
                                    onClick={async() =>(
                                        await setLoading(true),
                                        print("Diary Mutation", date),
                                        print("Will be sent", moment(date).format("YYYY-MM-DD")),
                                        mutation()
                                    )}
                                    >
                                    SAVE
                                </Button>
                                }
                        </Mutation>

                        </div>

                </div>
            </FormModal>
        );
    };

export default Diary;