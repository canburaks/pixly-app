import React from "react";
import { Tooltip } from 'react-tippy';
import 'react-tippy/dist/tippy.css'


const Tips = (props) =>{
    const { title, position, trigger, disabled, stickyDuration } = props;
    //const comp = (props) => <Component {...props} />
    return(
        <Tooltip
            // options
            {...props}
            title={title}
            position={position}
            trigger={trigger}
            disabled={disabled}
            
            >
            {props.children}
    </Tooltip>
        );
}
export default Tips;