import React from 'react'
import { Icon } from 'semantic-ui-react'

import "./FormModal.css"

const Modal = (props) =>{
    const { isOpen, switcher, bgcolor  } = props; 
    return(
        <div className="zz">
            {isOpen 
            ?   <div className="custom-form-modal-container" style={bgcolor ? {backgroundColor:bgcolor} : null}>
                    <div className="custom-form-modal-inner-container">
                        <div className="custom-form-modal-inner-flexbox" >
                        <Icon name="close" size="large" circular inverted
                            className="form-modal-close-icon" 
                            onClick={() => switcher()}
                            />
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