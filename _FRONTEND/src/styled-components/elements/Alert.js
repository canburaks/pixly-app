import React from "react";
import { useMemo, useCallback } from 'react';

import { Text, Paragraph, 
        Image, ImageShim,ImagePlaceholder, //AspectRatioImage, 
        Box, AbsoluteBox, 
        NewLink, Input, Button, BubbleButton
} from "../atoms"

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

//import SweetAlert from 'sweetalert2-react';
//import 'sweetalert2/src/sweetalert2.scss'

const MySwal = withReactContent(Swal)

export const SweetAlert = () =>(
    MySwal.fire({
        title: <p>Hello World</p>,
        footer: 'Copyright 2018',
        onOpen: () => {
          // `MySwal` is a subclass of `Swal`
          //   with all the same instance & static methods
          MySwal.clickConfirm()
        }
      }).then(() => {
        return MySwal.fire(<p>Shorthand works too</p>)
      })
)
