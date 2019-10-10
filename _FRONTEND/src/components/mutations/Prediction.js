import React, { useState }  from "react";
import {  Mutation } from "react-apollo";
import { PREDICTION_MUTATION } from "../../functions/mutations";

const predictionCheckMessage = (item) =>{
    if(item.viewerPoints>39 && item.viewerRating==null) return "Predict this movie for me" 
    else if(item.viewerRating>0) return "You  have already rated"
    else if(item.viewerPoints<40) return "You should at least 40 ratings"
}

const Prediction = (props) =>{
    const { item, setResult,loading, setLoading  } = props;
    const [ canPredict, setCanPredict ] = useState((item.viewerPoints>39 && item.viewerRating==null) ? true : false)



const onCompletedQuery = (data) =>{
    setLoading();
    setResult(data.prediction.prediction);
    setCanPredict(false);

}
    return(
        <Mutation mutation={PREDICTION_MUTATION} 
            variables={{id:item.id}} onCompleted={(data) => onCompletedQuery(data)} >
            {mutation=>(
                <div title={predictionCheckMessage(item)} style={(loading || !canPredict) ? {backgroundColor: "rgba(255, 255, 255, 0.4",pointerEvents:"none" } :  {cursor:"pointer"}} >
                    <div onClick={canPredict ? () => (mutation(), setLoading()) : null } >
                        {props.children}
                    </div>
                
                </div>
            )}
        </Mutation>
    );
};




export default Prediction;

/*
        <div title={predictionCheckMessage()}>
            <div style={ !canPredict ? {pointerEvents:"none"} : null} onClick={() => setSkip(false)}>

            {canPredict && 
            <Query query={PREDICTION} variables={{id:item.id}} skip={skip} 
                onCompleted={(data) => setResult(data.prediction)}
                onError={e => setResult(e)}
                >
                {
                    ({loading, data, error}) =>{
                        print("skip",skip)
                        if (loading) {
                            return <div></div>
                        }
                        print("skip",skip)
                        console.log("Prediction Query data:");
                        console.log(data)
                        console.log(error)

                        return(
                            <div></div>
                            )
                        }
                    }
            </Query>
            }

            
                    {props.children}
            </div>    
        </div>

        <ApolloConsumer>
            {client =>(
                <div title={predictionCheckMessage()}>
                <div title={predictionCheckMessage()} style={ !canPredict ? {pointerEvents:"none"} : null}
                    onClick={async () => {
                            const { data } = await client.query({
                                query: PREDICTION,
                                variables: { id: item.id }})
                            setResult(data.prediction.toString());
                            }}>
                    
                        {props.children}
                    </div>
                </div>
                )}
        </ApolloConsumer>

const Prediction = (props) =>{
    const { item, state, setState, setStatus, setResult  } = props;
    function check(){
        if(item.viewerPoints>39 && item.viewerRating==null){
            return true
        }
        return false
    }
    const canPredict = check();
    const predictionCheckMessage = () =>{
        if(item.viewerPoints>39 && item.viewerRating==null){
            return "Predict this movie for me" 
        }
        else if(item.viewerRating>0){
            return "You  have already rated"
        }
        else if(item.viewerPoints<40){
            return "You should at least 40 ratings"
        }
    }
    const onCompletedQuery = (data) =>{
        console.log("completed")
        console.log(data)
        setResult(data.prediction);
        setStatus("completed")
        setState(false);
    }
    
    return(
        <div title={predictionCheckMessage()}>
            {props.children}

            {!canPredict
            ?   <div></div>
            
            
            :(state===true) && 
            <Query query={PREDICTION} variables={{id:item.id}} skip={!state}
                    onCompleted={(data) => onCompletedQuery(data) }
                    >
            {
                ({data}) =>{
                    console.log("Prediction Query data:");
                    console.log(data)
                    return(
                        <div></div>
                    )
                }
            }
            </Query>
            }
        </div>

    );
};

*/