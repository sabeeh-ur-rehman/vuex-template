'use client'

import { useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CustomTextField from '@core/components/mui/TextField';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { apiClient } from '@/utils/apiClient';

interface FormData {
  newPassword: string;
  confirm: string;
}

const ResetPasswordView = () => {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get('token');
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [error, setError] = useState('');

  const onSubmit = async (data: FormData) => {
    if (data.newPassword !== data.confirm) {
      setError('Passwords do not match');
      return;
    }
    try {
      await apiClient.post('/auth/password/confirm', { token, newPassword: data.newPassword });
      router.push('/login');
    } catch {
      setError('Invalid or expired token');
    }
  };

  return (
    <div className='flex flex-col items-center justify-center bs-full gap-6 p-6'>
      <Typography variant='h4'>Reset Password</Typography>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4 w-full max-w-sm'>
        <CustomTextField label='New Password' type='password' {...register('newPassword', { required: true })} />
        <CustomTextField label='Confirm Password' type='password' {...register('confirm', { required: true })} />
        {error && <Typography color='error'>{error}</Typography>}
        <Button type='submit' variant='contained'>Reset Password</Button>
      </form>
    </div>
  );
};

export default ResetPasswordView;
