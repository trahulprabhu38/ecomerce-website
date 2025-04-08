import React from 'react';
import { Snackbar as MuiSnackbar, Alert } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { closeSnackbar } from '../redux/snackbarSlice';

const Snackbar = () => {
  const { open, message, severity } = useSelector((state) => state.snackbar);
  const dispatch = useDispatch();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(closeSnackbar());
  };

  return (
    <MuiSnackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </MuiSnackbar>
  );
};

export default Snackbar; 