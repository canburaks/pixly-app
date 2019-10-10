import React,  { useState }  from 'react'
import { CREATE_LIST, ADD_MOVIES } from "../../functions/mutations";
import { withRouter } from "react-router-dom";


import {  Mutation } from "react-apollo";
import { Button, Icon, Progress} from 'semantic-ui-react'

import { refetchList } from "../../functions/query";
import Search from "./Search"

import "./Form.css"




const NewListForm = (props) =>{
    
    var array = []
    const {  switcher } = props;
    const initialId = props.initialMovieId ? [props.initialMovieId] : [];
    
    const [name, setName] = useState("");
    const [ summary, setSummary ] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [ step, setStep ] = useState(1)
    const [newListId, setNewListId ] = useState(null)
    const [movieIds, setMovieIds] = useState(initialId);
    const [ movies, setMovies ] = useState([]);
    //const [myLists, updateLists] = useLocal()



    const isValid = () =>{
        if (step===1 
            && name.length>1 
            && name.length<100 
            && summary.length>1 
            && summary.length<500){
                return true
            }
        else if(step==2 &&  movieIds.length>0 && newListId!=null ){
            return true
        }
        else return false
    }

    const nextStep = (data) =>{
        if(step===1){
            setStep(2);
            setNewListId(data.createList.liste.id)
            setLoading(false);
            setError("");
        }
        else if(step===2){
            setLoading(false);
            setStep(3)
        }
    }
    const selectMovie = (movie) => {
        const selected = [...movies]
        selected.push(movie)
        setMovies(array.uniq(selected))
        const ids = array.uniq(selected).map(m => m.id)
        setMovieIds(ids)
    }
    const dropMovie = (movie) =>{
        const selected = movies.filter(m => m.id!=movie.id)
        setMovies(array.uniq(selected))
        const ids = array.uniq(selected).map(m => m.id)
        setMovieIds(ids)
    }
    const stepText = () =>{
        if (step===1) return "CREATE NEW LIST"
        else if(step===2) return "ADD MOVIES"
        else if(step===3) return "SUCCESSFUL"
    }
    const primaryButtonText = () =>{
        if (step===1) return "CREATE"
        else if(step===2) return "ADD MOVIES"
        else if(step===3) return "GO TO LIST"
    }
    const secondaryButtonText = () =>{
        if (step===1) return "CANCEL"
        else if(step===2) return "LATER"
        else if(step===3) return "CLOSE"
    }
    const renderElement = ()=>{
        if (step===1){
            return(
                <div className="form-text-info" >
                    <div className="form-row">
                        <h1 className="form-row-label">Name<span className="char-num" >{100-name.length}</span></h1>
                        <input  className="form-row-input form-input" value={name} required type="text"
                            placeholder="Unique name of the list" maxLength={100}
                            onChange={e =>  setName(e.target.value) }
                            />
                    </div>
                    <div className="form-row">
                        <h1 className="form-row-label">Description<span className="char-num" >{500-summary.length}</span></h1>
                        <input  className="form-row-input form-input" value={summary} required type="text"
                            placeholder={'Description of the list'} maxLength={500}
                            onChange={e =>  setSummary(e.target.value) }
                            />
                    </div>
                </div>
            )}
        else if (step===2){
            return (
            <div style={{width:"100%"}}>

                <Search bring={8} clickHandler={selectMovie} />
                <div className="movies-container">
                    {movies.length>0 
                    && movies.map(movie => (
                        <div className="movie-item-container" key={movie.id}>
                            <Icon name="close" size="small" circular inverted 
                                className="form-item-close-icon" 
                                title="Delete Movie"
                                onClick={() => dropMovie(movie)}
                                />
                            <img src={movie.poster} key={movie.id} className="movie-item-image" />
                        </div>
                    )) 
                    }
                </div>
            </div>
            )
        }
        else if (step===3){
            return (
            <div className="form-success">
                <Icon name="check" color="green" size="huge"/>
                <h4 style={{color:"white"}}>LIST SUCCESSFULLY CREATED </h4>
            </div>)
        }
    }
    
    const stepMutation = () =>{
        if (step===1) return {mutation:CREATE_LIST, variables:{ name, summary}}
        else if(step===2) return {mutation:ADD_MOVIES, variables:{ movieIds,listeId:newListId}}
    }
    
    return(
    
        <div className="form-main-container">
        <div className="form-row-step">
            <h2>{stepText()}</h2>
        </div>
        <Progress value={step} total={3} color={step < 3 ? "blue" : "green"} id="progress-bar" progress="ratio" inverted/>
        {renderElement()}
            <div className="form-row-buttons">
                <Button 
                    onClick={() => switcher()}
                    disabled={loading}
                    color="grey">
                    {secondaryButtonText()}
                </Button>
                {step<=2 
                ?   <Mutation 
                        mutation={stepMutation().mutation} 
                        variables={stepMutation().variables}
                        onCompleted={ (data) => (nextStep(data))}
                        onError={ error =>  (setLoading(false), setError(error.message.split("GraphQL error:")[1]))}
                        >
                        {mutation => 
                            <Button 
                                color='green'
                                onClick={()=> (setLoading(true), mutation(refetchList) )}
                                disabled={!isValid()}
                                loading={loading}
                                >{primaryButtonText()}<Icon name="arrow right" /></Button>
                            }
                    </Mutation>
                :   <Button 
                        color='green'
                        onClick={()=> (props.history.push(`/lists/${newListId}/1`))}
                        >
                        {primaryButtonText()}<Icon name="arrow right" />
                        </Button>
                }
                </div>
        </div>
    );
};

//export default withRouter(NewListForm);