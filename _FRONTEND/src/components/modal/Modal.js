import React from 'react'
import { Icon } from 'semantic-ui-react'

import "./Modal.css"

const Modal = (props) =>{
    const { isOpen } = props; 
    const switcher = props.onOff ? props.onOff : props.switcher;
    console.log("modal is", isOpen)
    return(
        <div>
            {isOpen 
            ?   <div className="custom-modal-container" disabled={!isOpen} >
                    <Icon name="close" size="large" circular inverted
                            className="modal-close-icon" 
                            onClick={() => switcher()}
                            />
                    <div className="custom-modal-inner-container">
                        <div className="custom-modal-inner-flexbox" >
                            {props.children}
                        </div>
                    </div>
                </div>
            :   <div></div>
            }
        </div>

    )
}

export default Modal;