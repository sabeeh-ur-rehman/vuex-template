'use client'

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { SelfRegisterSchema } from '@/server/validation/auth';
import { useRouter } from 'next/navigation';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CustomTextField from '@core/components/mui/TextField';
import Link from '@components/Link';

type FormValues = z.infer<typeof SelfRegisterSchema>;

const RegisterView = () => {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors }, setError } = useForm<FormValues>({ resolver: zodResolver(SelfRegisterSchema) });

  const onSubmit = async (data: FormValues) => {
    const res = await fetch('/api/auth/self-register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      router.push('/login?registered=1');
    } else {
      const json = await res.json().catch(() => ({}));
      setError('root', { message: json.message || 'Registration failed' });
    }
  };

  return (
    <div className='flex flex-col items-center justify-center bs-full gap-6 p-6'>
      <Typography variant='h4'>Create Account</Typography>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4 w-full max-w-sm'>
        <CustomTextField label='Tenant Code' {...register('tenantCode')} error={!!errors.tenantCode} helperText={errors.tenantCode?.message} />
        <CustomTextField label='Name' {...register('name')} error={!!errors.name} helperText={errors.name?.message} />
        <CustomTextField label='Email' type='email' {...register('email')} error={!!errors.email} helperText={errors.email?.message} />
        <CustomTextField label='Password' type='password' {...register('password')} error={!!errors.password} helperText={errors.password?.message} />
        {errors.root && <Typography color='error'>{errors.root.message}</Typography>}
        <Button type='submit' variant='contained'>Register</Button>
        <Typography component={Link} href='/login' color='primary.main' className='text-center'>Back to login</Typography>
      </form>
    </div>
  );
};

export default RegisterView;
