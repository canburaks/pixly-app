import React from "react";
import { Link } from "react-router-dom";

import "./TagBox.css"

export const Tag = ({ tag }) => <p className="cbs-tag" >{tag.name}</p>;

export const TagBox = ({ tags }) => (
    <div className="cbs-tag-box">
        {tags.map((t,i) => <Tag tag={t} key={t + i} />)}
    </div>
)


export const PersonTag = (props) =>(
    <Link to={`/person/${props.person.slug}`}  rel="nofollow">
        <div className="tag tag-box-container tag-person" title={props.person.name}>
            <p className={!props.size ? "t-xs op90" : "op90"} style={props.size && { fontSize: props.size }}>{props.person.name}</p>
        </div>
    </Link>
)

/*
export const TagBox = ({tag, size}) => {
    return(
        <div className={tag.type === "genre" ? "tag tag-box-container tag-genre" : "tag tag-box-container tag-other"}>
            <p className={!size ? "t-xs op90" : "op90"} style={size && {fontSize:size}}>{tag.name}</p>
        </div>
    );
};
*/