import { Fragment, useState, useEffect, forwardRef } from "react";

/** Socket.IO */
import io from 'socket.io-client'

/** Material UI */
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import theme from '../src-material-ui/themeHomePage';
import { SnackbarProvider, useSnackbar } from 'notistack';

/** Next-Auth */
import { getProviders, signIn, signOut, useSession, getSession } from 'next-auth/react'
import { getCsrfToken } from "next-auth/react"
import { useRouter } from 'next/router';

/** Header */
import Navigator from '../components/main/Navigator';
import AvatarFunctionalV1 from '../components/main/header/AvatarFunctionalV1';
import AppBarFunctionalV2 from '../components/main/header/AppBarFunctionalV2';
import LoaderComponent from '../components/main/LoaderComponent';
import Avatar from '@mui/material/Avatar';
import Feed from '@mui/icons-material/Feed';
import UploadFile from '@mui/icons-material/UploadFile'
import Edit from '@mui/icons-material/Edit';


/** Body */
import AppBarFunctionalV1 from '../components/main/AppBarFunctionalV1';
import DataFormWithHeader  from '../components/main/bodyComponents/dataForm/DataFormWithHeader';
import Profile from '../components/main/bodyComponents/profile/Profile';
import UploadImages from '../components/main/bodyComponents/uploadImage/UploadImages'
import UploadImagesV2 from '../components/main/bodyComponents/uploadImageV2/UploadImages'
import DataAndImageWithHeader from '../components/main/bodyComponents/dataAndImage/DataAndImageWithHeader'
import TableSortWithHeader from '../components/main/bodyComponents/table/TableSortWithHeader'
import TableSortWithPaper from '../components/main/bodyComponents/table/TableSortWithPaper'
import TableSortWithPaperPrueba from '../components/main/bodyComponents/table/TableSortWithPaperPrueba'

/* 
[{"id":1,"fullName":"Juan Romay","email":"mail@email.com","mobile":"+11234567891","city":"Miami","permissions":[{"category":"menor","read":true,"write":false},{"category":"juvenil","read":true,"write":false}],"gender":"male","departmentId":"1","hireDate":"2022-07-27T23:55:28.437Z","isPermanent":false},{"id":2,"permissions":[{"category":"menor","read":true,"write":false},{"category":"juvenil","read":true,"write":false}],"fullName":"Marga","email":"marga29cr@gmail.com","mobile":"33243242434","city":"City","gender":"female","departmentId":"2","hireDate":"2022-07-27T23:55:28.437Z","isPermanent":false},{"id":3,"permissions":[{"category":"menor","read":true,"write":false},{"category":"juvenil","read":true,"write":false}],"fullName":"Maria Romay","email":"rcmarjose31@gmail.com","mobile":"7161117444","city":"Cityyy","gender":"female","departmentId":"2","hireDate":"2022-07-27T23:55:28.437Z","isPermanent":true},{"id":4,"permissions":[{"category":"menor","read":true,"write":false},{"category":"juvenil","read":true,"write":false}],"fullName":"Aura","email":"auraq@email.com","mobile":"1112133131323","city":"City","gender":"female","departmentId":"3","hireDate":"2022-07-28T00:14:47.659Z","isPermanent":false},{"id":5,"permissions":[{"category":"menor","read":true,"write":false},{"category":"juvenil","read":true,"write":false}],"fullName":"Zuli","email":"zuli@email.com","mobile":"9809830948394","city":"City","gender":"female","departmentId":"4","hireDate":"2022-07-28T00:14:47.659Z","isPermanent":false},{"id":6,"permissions":[{"category":"menor","read":true,"write":false},{"category":"juvenil","read":true,"write":false}],"fullName":"L","email":"lmail@mail.com","mobile":"2133243423432","city":"Merida","gender":"female","departmentId":"1","hireDate":"2022-07-29T07:14:02.354Z","isPermanent":false}]
*/

/** Utils */
import { getAccountData } from '../lib/utils';
import axios from 'axios'

let socket = false;
// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps(context) {
  let session = await getSession(context)
  
  if (!session) {
    console.log("User not logged in")
    return {
      redirect: {
        permanent: false,
        destination: `${process.env.BASE_URL}/auth/signin`,
      }
    };
  }

  if (!session.user.verified) {
    console.log("User not verified")

    return {
      redirect: {
        permanent: false,
        destination: `${process.env.BASE_URL}/auth/verify/${session.user._id}`,
      }
    };
  }

  try {   
    let account = await getAccountData( session.user._id)
    
    return {
      props: {
        account
      },
    }  
  }
  catch (error) {
    console.log(error)
    return {
      redirect: {
        permanent: false,
        destination: `${process.env.BASE_URL}/admin/error`,
      }
    };
  }
}
const drawerWidth = 256;

const headCells = [
  { id: 'permissions', label: 'Permissions', disableSorting: true },
  { id: 'fullName', label: 'Name' },
  { id: 'email', label: 'Email Address', align: "right" },
  { id: 'mobile', label: 'Mobile', align: "right" },
  { id: 'option', label: 'Option', disableSorting: true, align: "right" },
]

const headCellsPrueba = [
  { id: 'extra', label: '' },
  { id: 'storeLocation', label: 'Location' },
  { id: 'items', label: 'Items', align: "right", disableSorting: true },
  { id: 'purchaseMethod', label: 'Purchase Method', align: "right" },
  { id: 'couponUsed', label: 'Coupon Used', disableSorting: true, align: "right" },
]

async function fetchData(id) {
  let result = await axios({
    url: `${process.env.BACKEND_URL}/admin/${id}/get-users`,
    method: "GET",
    withCredentials: true,
  })
  console.log(result)
}

function HomePage({ props }) {
  
  const [listUsers, setListUsers] = useState()
  const [account, setAccount] = useState(props.account)
  /** For sockets use */
  const [isConnected, setIsConnected] = useState(false);
  /** For navigator bar responive */
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));

  /** Control tabs options */
  const [tabOption, setTabOption] = useState(0)
  const handleOptionAvatar = (newValue) => (e) => {
    setTabOption(newValue);
  };

  /** Control backdrop and alert */
  const [backdrop, setBackdrop] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  /** Socket implementation */
  useEffect( async () => {  
    if(!socket){
      let { user: { _id } } = await getSession()
      socket = io( process.env.BACKEND_URL, { 
        withCredentials: true,
        autoConnect: false,
        query: {
          _id
        }
      });
      socket.connect();

      socket.onAny((event, ...args) => {
        console.log(event, args);
      });
    
      socket.on('connect', () => {    
        setIsConnected(true);
      });
    
      socket.on('disconnect', () => {
        setIsConnected(false);
      });
        
      socket.on("alert_snackbar", ({ text, variant }) => {
        enqueueSnackbar(text, { variant });
      })

      socket.on("alert_backdrop", (msg) => {
        setBackdrop(msg)
      })

      socket.on("data_incoming", (data) => {
        setAccount(data)
      })

      socket.on("fail_upload", (fieldname) => {
        setAccount({
          ...account,
          [fieldname]: {
            error: 'fail_upload'
          }
        })
      })
      /** Admin list */
      socket.on("data_list_incoming", (arg, callback) => {
        const { _id, ...rest } = arg
        setListUsers((list) => {
          return {
            ...list,
            [_id]: {
              ...rest
            }
          }
        })
        callback(arg);
      });

      return () => {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('alert_snackbar');
        socket.off('alert_backdrop');
        socket.off('data_incoming');
        socket.off('data_list_incoming');
      };
    }
  }, [])

   /** Calls API Data */
   useEffect( async () => {  
    if (isConnected) {
      let { user: { _id } } = await getSession()
      fetchData(_id)
    }
  }, [isConnected])
  
  const moduleTabs = [
    {
      component: 
        <Profile
          onClickHandle={() => setTabOption(1)}
          name={account.firstName}
        />,
      title: "Profile",
      icon: <Avatar />,
    },
    {
      component: 
        <LoaderComponent />, 
      title: "Strategies",
      icon: <Edit fontSize="small" />,
    },
    {
      component: 
        <TableSortWithHeader
          
          headCells={headCells}
        />,
      title: "Table List with header",
    },
    {
      component: 
        <TableSortWithPaper
          
          headCells={headCells}
        />,
      title: "Table List without",
    },
    {
      component: 
        <TableSortWithPaperPrueba
          listUsers={listUsers}
          headCells={headCellsPrueba}
        />,
      title: "Table List many reg",
    },
  ]

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <CssBaseline />
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          {
            isSmUp ? null : (
              <Navigator
                PaperProps={{ style: { width: drawerWidth } }}
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                openFileFunc={()=>console.log("click")}
                downloadFunc={()=>console.log("click")}
                settingsFunc={()=>console.log("click")}
                logoutFunc={() => signOut()}
              />
            )
          }

          <Navigator
            PaperProps={{ style: { width: drawerWidth } }}
            sx={{ display: { sm: 'block', xs: 'none' } }}
            openFileFunc={()=>console.log("click")}
            downloadFunc={()=>console.log("click")}
            settingsFunc={()=>console.log("click")}
            logoutFunc={() => signOut()}
          />
        </Box>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/** Header */}
            <AppBarFunctionalV2 
              onDrawerToggle={handleDrawerToggle}
              avatarComponent={
                <AvatarFunctionalV1 
                  name={account.firstName ? account.firstName : "_"} 
                  clickMenu={handleOptionAvatar}
                  menuOptions={moduleTabs}
                  logoutFunc={() => signOut()}
                /> 
              }
            />
          {/** Body */}
            <AppBarFunctionalV1 
              valueMenu={tabOption}
              handleValueMenu={setTabOption}
              moduleTabs={moduleTabs}
            />
        </Box>
      </Box>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={backdrop}
        onClick={()=> {
          
          setBackdrop(false) }  }
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </ThemeProvider>
  );
}

export default function IntegrationNotistack(props) {
  return (
    <SnackbarProvider maxSnack={3}>
      <HomePage props={props} />
    </SnackbarProvider>
  );
}