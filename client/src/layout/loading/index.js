import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { bcolors } from "../../colors"
export default function AuthLoading() {


  return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: bcolors.bluedark }}
        open={true}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
  );
}
