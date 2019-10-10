import React from "react";
import {  Mutation } from "react-apollo";
import { RATING_MUTATION } from "../functions/mutations";
import {  Row, Col } from 'react-flexbox-grid';
import {  Button, Message,TextArea, Modal, Header, Icon} from "semantic-ui-react";
import { DateToString, StringToDate, print } from "../functions/lib"
import { useState } from 'react';

import ReactStars from 'react-stars'
import DatePicker from "react-datepicker";
import { toast } from 'react-toastify';

import "react-datepicker/dist/react-datepicker.css";
var moment = require('moment');

const DiaryForm = (props) => {

    const styles={
        modalBox:{
            width:"60%"
        },
        labelStyle:{
            fontSize:16,
            fontWeight:"bold",
            marginRight:5
        },
        textFieldStyle:{
            height:"70%",
            overflow:"visible",
            width:"100%"
        }
    }
    const { item, button, open } = props;
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

            <Modal trigger={button} closeIcon>
                <Header content="Add your notes to your diary" />
                <Modal.Content>
                    <Row>
                        <Col xs={6} md={6} lg={6}>
                        <label style={styles.labelStyle} >Rating</label>
                        <ReactStars half value={rate}
                            size={20}
                            disabled={!edit}
                            style={ !edit ? {color:"grey"} : {color:"yellow"} } 
                            title={!edit ? "Please activate Edit" : "Rate and Save Please!"}
                            onChange={(value) => setRate(value) }
                        />
                        </Col>

                        <Col xs={6} md={6} lg={6}>
                        <label style={styles.labelStyle} >When you watched this movie?</label>
                        <DatePicker
                            dateFormat="yyyy/MM/dd"
                            selected={date}
                            onChange={(value) => (setDate(moment(value)._d)) }
                            />
                        </Col>
                        <Col xs={12} md={12} lg={12}>
                        <TextArea
                            style={styles.textFieldStyle}
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            type="text"
                            placeholder="notes"
                        />
                        </Col>

                        <Col xs={12} md={12} lg={12}>
                        <Mutation mutation={RATING_MUTATION}
                            variables={{ id, rate, date:moment(date).format("YYYY-MM-DD"), notes}}
                            onCompleted={(data) => (
                                setLoading(false),
                                setVisibility(false),
                                successNotify("Saved")
                                )}>
                            {mutation => 
                                <Button 
                                    inverted
                                    
                                    disabled={loading || rate===null || !visibility}
                                    color="green" 
                                    onClick={async() =>(
                                        await setLoading(true),
                                        print("Diary Mutation", date),
                                        print("Will be sent", moment(date).format("YYYY-MM-DD")),
                                        mutation()
                                    )}
                                    >
                                    <Icon name='checkmark' />
                                    Add to your Diary
                                </Button>
                                }
                        </Mutation>
                        </Col>
                    </Row>
                    
                </Modal.Content>
            </Modal>
        );
    };

export default DiaryForm;