import React from 'react';
import { useState, useEffect } from "react";
import CKEditor from '@ckeditor/ckeditor5-react';
import BalloonEditor from '@ckeditor/ckeditor5-build-balloon';
// Render Froala Editor component.
export const MyEditor = (props) => {

    const [content, setContent] = useState(props.content || "");
    const [myeditor, setMyEditor] = useState(null);

    const changeHandler = (event, editor) => (setContent(editor.getData(), console.log("event",event,"editr", editor))) 
    console.log("content:" , content)

    function createMarkup() {
        return {__html: myeditor.getData()};
      }
    const InnerHtml = () => <div dangerouslySetInnerHTML={createMarkup()} />;
    const names = myeditor && BalloonEditor.builtinPlugins.map( plugin => plugin.pluginName );
    console.log("names:", names)
    return (
      <div>
        <CKEditor
            editor={ BalloonEditor }
            config={CKEDITOR_CONFIGS}
            data={content}
            onInit={ editor => {
                // You can store the "editor" and use when it is needed.
                setMyEditor(editor)
                console.log( 'Editor is ready to use!', editor );
            } }
            onChange={changeHandler}
        />
        <br/>
        {myeditor && <InnerHtml />}
      </div>
    );
  }
  const CKEDITOR_CONFIGS = {
    toolbar: [ 'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote' ],
    heading: {
        options: [
            { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
            { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
            { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
            { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
            { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' }
        ]
    }
}
/*
            toolbar:[
                "undo", "redo", "bold", "italic", 
                "blockQuote", "ckfinder", 
                "heading", "fontSize", "fontColor",
                "imageTextAlternative", "imageUpload", 
                "imageStyle:full", "imageStyle:side", 
                "indent", "outdent", "link", "numberedList", 
                "bulletedList", "mediaEmbed",]
    onChange={ ( event, editor ) => {
    const data = editor.getData();
    console.log( { event, editor, data } );
} }
*/