'use client'

import { useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CustomTextField from '@core/components/mui/TextField';
import Link from '@components/Link';
import { useState } from 'react';
import { apiClient } from '@/utils/apiClient';

interface FormData {
  tenantCode: string;
  email: string;
}

const ForgotPasswordView = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [sent, setSent] = useState(false);

  const onSubmit = async (data: FormData) => {
    await apiClient.post('/auth/password/request', data);
    setSent(true);
  };

  return (
    <div className='flex flex-col items-center justify-center bs-full gap-6 p-6'>
      <Typography variant='h4'>Forgot Password</Typography>
      {sent ? (
        <Typography>If the email exists, a reset link was sent.</Typography>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4 w-full max-w-sm'>
          <CustomTextField label='Tenant Code' {...register('tenantCode', { required: true })} error={!!errors.tenantCode} />
          <CustomTextField label='Email' type='email' {...register('email', { required: true })} error={!!errors.email} />
          <Button type='submit' variant='contained'>Send Reset Link</Button>
        </form>
      )}
      <Typography component={Link} href='/login' color='primary.main' className='text-center'>Back to login</Typography>
    </div>
  );
};

export default ForgotPasswordView;
