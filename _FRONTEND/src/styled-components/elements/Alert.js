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

const B = () => (
  <Button borderRadius={"6px"}   mx={[2]}
  width={"120px"} height={"50px"} 
  bg={"accent1"} color={"light"}
  fontWeight="bold"
  hoverColor={"#3437c7"}
  hoverBg={"white"}
  hoverShadow="card"
  boxShadow="xs"
>
  Login
</Button>
)

export const SweetAlert = () =>(
    MySwal.fire({
      type: 'error',
      title: 'Oops...',
      text: 'Something went wrong!',
      footer: '<a href>Why do I have this issue?</a>',
      onOpen: () => {
        // `MySwal` is a subclass of `Swal`
        //   with all the same instance & static methods
        MySwal.clickConfirm()
      }
    }).then(() => {
      return MySwal.fire(
        <Box width={"80vw"} bg="black" height={"50vh"}>

        </Box>
      )
    })
)
