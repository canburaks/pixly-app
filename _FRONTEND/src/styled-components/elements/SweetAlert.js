import React from "react";
import { useMemo, useCallback, useState, useEffect } from 'react';
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import { StyleSheetManager } from 'styled-components'

import { Text, Paragraph, 
        Image, ImageShim,ImagePlaceholder, //AspectRatioImage, 
        Box, AbsoluteBox, 
        NewLink, Input, Button, BubbleButton, Swa
} from "../"

import { TextSection } from "./TextSection"
import { useScrollPosition } from "../../functions/hooks"

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import SweetAlert from 'sweetalert2-react';
import "./Modal.css"


const MySwal = withReactContent(Swal)


//import SweetAlert from 'sweetalert2-react';
//import 'sweetalert2/src/sweetalert2.scss'


export const Modal = ({isOpen, children, closeModal, ...props}) => {
	const content = useMemo(() => renderToStaticMarkup(children),[])
	const closeHandler = () => {closeModal(); MySwal.close()}
	const options = {
		html: content,

		focusConfirm: false,
		allowOutsideClick:true,

		
		showConfirmButton:false,
		confirmButtonText: 'Confirm',
		onConfirm: closeHandler,

		showCancelButton:false,
		cancelButtonText: 'Cancel',
		onCancel: closeHandler,
		
		showCloseButton: false,
		closeButtonText: 'Close',
		onClose: closeHandler,

		customClass:{
			//container: 'sweet-modal-box',
			popup: 'sweet-modal-box',
			//header: 'header-class',
			//title: 'title-class',
			//closeButton: 'close-button-class',
			//icon: 'icon-class',
			//image: 'image-class',
			//content: 'sweet-modal-box',
			//input: 'input-class',
			//actions: 'actions-class',
			//confirmButton: 'confirm-button-class',
			//cancelButton: 'cancel-button-class',
			//footer: 'footer-class'	
		},
		...props
	  }
	useEffect(() => {
		console.log("isOpen", isOpen)
		if (isOpen !== null){
			(isOpen === true)  ? MySwal.fire(options) :  MySwal.close()
		}
	},[isOpen])

	return (
	<div></div>
)}

/*

export const Modal = ({children, isOpen=null, ...props}) => {
	const [isModalOpen, setModalOpen] = useState(isOpen)

	const content = useMemo(() => renderToStaticMarkup(children),[])
	const openModal = useCallback(() => setModalOpen(true),[])
	const closeModal = useCallback(() => setModalOpen(false),[])
	
	const options = {
		html: content,

		focusConfirm: false,
		allowOutsideClick:true,

		
		showConfirmButton:false,
		confirmButtonText: 'Confirm',
		onConfirm: closeModal,

		showCancelButton:false,
		cancelButtonText: 'Cancel',
		onCancel: closeModal,
		
		showCloseButton: false,
		closeButtonText: 'Close',
		onClose: closeModal,

		customClass:{
			//container: 'sweet-modal-box',
			popup: 'sweet-modal-box',
			//header: 'header-class',
			//title: 'title-class',
			//closeButton: 'close-button-class',
			//icon: 'icon-class',
			//image: 'image-class',
			//content: 'sweet-modal-box',
			//input: 'input-class',
			//actions: 'actions-class',
			//confirmButton: 'confirm-button-class',
			//cancelButton: 'cancel-button-class',
			//footer: 'footer-class'	
		},
		...props
	  }

	  useEffect(() => {
		  console.log("isModalOpen",isModalOpen)
			if (isOpen === null){
				(isModalOpen === true) ? MySwal.fire(options) :  MySwal.close()
			}
		},[isModalOpen])

	useEffect(() => {
		console.log("isOpen", isOpen)
		if (isOpen !== null){
			(isOpen === true)  ? MySwal.fire(options) :  MySwal.close()
		}
	},[isOpen])

	console.log("modal", MySwal.isVisible())
	return (
	<div></div>
)}


export const Modal = (props) => {
	const [isOpen, setOpen] = useState(false)
	const openModal = useCallback(() => setOpen(true),[])
	const closeModal = useCallback(() => setOpen(false),[])
	const children = renderToStaticMarkup(props.children)
	console.log(children)
	return (
	<BubbleButton bg="accent1" width={"80px"} height={"35px"} onClick={openModal}>
      <SweetAlert
        show={isOpen}
        title="Demo"
		html={children}
        text="SweetAlert in React"
		showConfirmButton={true}
		onConfirm={closeModal}
		onEscapeKey={closeModal}
      />
	</BubbleButton>
)}
*/