import React from 'react';
import { Navigate } from 'react-router-dom';

export default function OTPVerification() {
  return <Navigate to="/login" replace />;
}
