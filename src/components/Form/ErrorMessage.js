import React from 'react';
import { ErrorMessage as FormErrorMessage } from 'formik';
import { Typography } from '@mui/material';

const ErrorMessage = ({ name }) => (
  <FormErrorMessage name={name} component="div">
    {errorMessage => (
      <Typography variant="caption" color="error">
        {errorMessage}
      </Typography>
    )}
  </FormErrorMessage>
);

export default ErrorMessage;