import React from "react";
import { useDispatch, useSelector } from 'react-redux'
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";


import styles from "./Login.module.scss";
import { Password } from "@mui/icons-material";
import { fetchAuth, selectIsAuth } from "../../redux/slices/auth";

export const Login = () => {

  const dispatch = useDispatch();

  const isAuth = useSelector(selectIsAuth);

  const { register, handleSubmit, setError, formState: { errors, isValid } } = useForm({
    defaultValues: {
      email: "",
      password: "",
    }, mode: 'onChange'
  })

  const onSubmit = async (values) => {
    const data = await dispatch(fetchAuth(values));
    if(!data.payload) {
        return alert("Login failed");
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
        Login
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}> 
        <TextField
          type='email'
          className={styles.field}
          label="E-Mail"
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          {...register('email', {required: 'Email is requred'})}
          fullWidth
        />
        <TextField 
          type='password'
          className={styles.field} 
          label="Password" fullWidth
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register('password', {required: 'Password is requred'})}
          />
        <Button type='submit' size="large" variant="contained" fullWidth>
          Login
        </Button>
      </form>
    </Paper>
  );
};
