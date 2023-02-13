import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { Navigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';

import styles from './Login.module.scss';
import { fetchRegister, fetchAuth, selectIsAuth } from "../../redux/slices/auth";
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from "react-hook-form";

export const Registration = () => {
  const dispatch = useDispatch();

  const isAuth = useSelector(selectIsAuth);

  const { register, handleSubmit, setError, formState: { errors, isValid } } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    }, mode: 'onChange'
  });

  const onSubmit = async (values) => {
    const data = await dispatch(fetchRegister(values));
    if(!data.payload) {
        return alert("Register failed");
    }
    if('token' in data.payload) {
      window.localStorage.setItem('token', data.payload.token);
    }
  } 

  if(isAuth) {
    return (<Navigate to='/' />);
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Create account
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField 
            className={styles.field}
            label="Full name"
            error={Boolean(errors.fullName?.message)}
            helperText={errors.fullName?.message}
            {...register('fullName', {required: 'Full name is requred'})}
            fullWidth />
        <TextField type='email'
            className={styles.field}
            label="E-Mail"
            error={Boolean(errors.email?.message)}
            helperText={errors.email?.message}
            {...register('email', {required: 'Email is requred'})}
            fullWidth />
        <TextField type='password'
            className={styles.field} 
            label="Password" fullWidth
            error={Boolean(errors.password?.message)}
            helperText={errors.password?.message}
            {...register('password', {required: 'Password is requred'})} />
        <Button disabled={!isValid} type='submit' size="large" variant="contained" fullWidth>
          Register
        </Button>
      </form>
    </Paper>
  );
};
