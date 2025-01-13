import React from 'react';

type ErrorAlertProps = {
  message: string;
};

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message }) => (
  <div className="alert alert-danger mt-3 text-start" role="alert">
    {message}
  </div>
);

export default ErrorAlert;