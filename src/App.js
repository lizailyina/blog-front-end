import Container from "@mui/material/Container";
import { useDispatch, useSelector } from 'react-redux'
import React from "react";

import { Header } from "./components";
import { Routes, Route } from 'react-router-dom'
import { Home, FullPost, Registration, AddPost, Login } from "./pages";
import { fetchAuthMe, selectIsAuth } from "./redux/slices/auth";

function App() {

  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);

  React.useEffect(() => {
    dispatch(fetchAuthMe());
  }, [])

  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element = { <Home /> } />
          <Route path="/post/:id" element = { <FullPost /> } />
          <Route path="/post/:id/edit" element = { <AddPost /> } />
          <Route path="/add-post" element = { <AddPost /> } />
          <Route path="/login" element = { <Login /> } />
          <Route path="/register" element = { <Registration /> } />
        </Routes>
      </Container>
    </>
  );
}

export default App;
