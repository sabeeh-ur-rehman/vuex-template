'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LoginSchema } from '@/server/validation/auth';
import { useAuth } from '@/@core/contexts/authContext';

type FormValues = z.infer<typeof LoginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors }, setError } = useForm<FormValues>({ resolver: zodResolver(LoginSchema) });

  const onSubmit = async (data: FormValues) => {
    try {
      await login(data);
    } catch (e) {
      setError('root', { message: 'Invalid credentials' });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <input {...register('tenantCode')} placeholder="Tenant Code" />
      {errors.tenantCode && <span>{errors.tenantCode.message}</span>}
      <input {...register('email')} placeholder="Email" />
      {errors.email && <span>{errors.email.message}</span>}
      <input type="password" {...register('password')} placeholder="Password" />
      {errors.password && <span>{errors.password.message}</span>}
      {errors.root && <span>{errors.root.message}</span>}
      <button type="submit">Login</button>
    </form>
  );
}
