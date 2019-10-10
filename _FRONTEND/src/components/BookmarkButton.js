import React from 'react'
import { BOOKMARK_MUTATION } from "../functions/mutations";
import { useState } from 'react';
import {  Mutation } from "react-apollo";
import { Button, Icon } from 'semantic-ui-react'

const BookmarkButton = (props) =>{
    const { item,  size=1, buttonSize } = props;
    const [bookmark, setBookmark] = useState(item.isBookmarked);
    // follow object fot return data for mutation: person, liste, topic
    
    {/*const styles = {
        button:{
            marginTop:  2*size,
            marginBottom: 5* size, 
            height: 25*size, 
            width:"80%", 
            fontWeight:"bold", 
            fontSize:   10*size,
            borderRadius:10,
            color:"#e64a19"
        }
    };*/}

    return(
        <Mutation 
            mutation={BOOKMARK_MUTATION} 
            variables={{ id:item.id }} 
            onCompleted={(data) => 
                setBookmark(data.bookmark.movie.isBookmarked)}
                >
            {   mutation => (
                    <Button
                        fluid basic inverted
                        color="red"
                        content={bookmark ? "Remove Bookmark" : "Add to Bookmarks"}
                        onClick={mutation}
                        icon={
                            <Icon 
                                name="bookmark"
                                size={buttonSize ? buttonSize : "large"}
                                color={bookmark ? "red" : "grey"}
                                style={{float:"left"}}    
                                />}
                    />
                )}
        </Mutation>
    );
};

export default BookmarkButton;