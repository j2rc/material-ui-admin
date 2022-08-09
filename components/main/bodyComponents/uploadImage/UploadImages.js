import React, { useState, useEffect } from 'react'
import { getProviders, signIn, signOut, useSession, getSession } from 'next-auth/react'
import axios from 'axios'

/** Material UI */
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Grid from '@mui/material/Grid';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { Paper } from '@mui/material';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import PageHeader from "../bodyHeader/PageHeader";
import CardItem from "./components/CardItem";
import CardLoader from './components/CardLoader';
import Button from "../dataForm/components/Button";
import { useFormFile } from "./components/useFormFile";
import theme from "../../../../src-material-ui/themeBodyComponent"

export default function UploadImages(props) {
  let { account, setAccount, setBackdrop, setSnackbar } = props
  const { data: session, status } = useSession()
  let {
    files,
    setFiles,
    errors,
    setErrors,
    resetForm
  } = useFormFile();

  /* 
  useEffect(() => {
    setFiles({
      ...files,
      ...account
    })
  }, [account])
  */

  useEffect(() => {
    let images = {
      ...files,
      ...account      
    }

    let { image_1, image_2 } = images

    setFiles({
      image_1,
      image_2
    })
  }, [account])

  const validate = (fieldValues = files) => {
    let temp = {}
    /*
    if ('firstName' in fieldValues)
    fieldValues.firstName ? null : temp.firstName = "This field is required."
    if ('lastName' in fieldValues)
    fieldValues.lastName ? null : temp.lastName = "This field is required."
    if ('customized' in fieldValues)
    (fieldValues.customized.select && fieldValues.customized.input)  ? null : temp.customized = "This field is required." 
    if ('email' in fieldValues)
    temp.email = (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/).test(fieldValues.email) ? "" : "Email is not valid."
    if ('mobile' in fieldValues)
    fieldValues.mobile.length > 9 ? null : temp.mobile = "This field is required."
    if ('selectId' in fieldValues)
    fieldValues.selectId.length != 0 ? null : temp.selectId = "This field is required."
    */
    
    setErrors({
      ...temp
    })
    
    return temp
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let errs = validate();
    if (Object.keys(errs).length) return;
    
    setBackdrop(true)    

    try {
      const formData = new FormData();
        
      for (const key in files) {
        if ( !files[key].newFile ) {
          continue
        }
        formData.append(
          key,
          files[key].newFile
        )
      }

      axios({
        url: `${process.env.BACKEND_URL}/api/${session.user._id}/files`,
        method: "put",
        data: formData,
        headers: {
          'Authorization':`Bearer ${process.env.TOKEN_ACCESS}`
        },
        withCredentials: true,
      })
    } 
    catch (error) {
      console.error(error)
    }
  }
  
  console.log(files)
  return (
    <ThemeProvider theme={theme}>
      <PageHeader
        title="Upload Files"
        subTitle="With validation"
        icon={<CloudUploadIcon fontSize="large" />}
      />
      <Paper 
        sx={{
          margin: theme.spacing(2),
          padding: theme.spacing(1),
        }}
      >
        <Grid 
          container 
          justifyContent="space-around"
          align="center" 
          sx={{
            p: 2
          }}
        >
          <Grid p={2} item xs={12} md={6} key={"img1"} >
            <CardItem 
              title={"Image 1"} 
              name={"image_1"}
              file={files.image_1}
              setFiles={setFiles}
              setBackdrop={setBackdrop}             
            />  
          </Grid>

          <Grid p={2} item xs={12} md={6} key={"img2"} >
            <CardItem 
              title={"Image 2"}
              name={"image_2"}  
              file={files.image_2}
              setFiles={setFiles}      
              setBackdrop={setBackdrop}       
            />  
          </Grid>

          <Grid pt={3} item xs={12}>
            <div>
              <Button
                text="Submit" 
                onClick={handleSubmit}
              />
              <Button
                text="Reset"
                color="neutral"
                onClick={resetForm}
              />
            </div>
          </Grid>
        </Grid>
      </Paper>
    </ThemeProvider>
  ) 
}