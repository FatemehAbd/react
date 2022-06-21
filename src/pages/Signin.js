import React from "react";

import { useState, useRef } from "react";
import { usernameIsValid, passwordIsValid } from "../components/Cntrls";
import { supabase } from "../supabaseClient";
import { Navigate } from "react-router-dom";
import { connect } from "react-redux";
import {
  Button,
  Input,
  Form,
  Label,
  FormGroup,
  Spinner,
  Container,
  Alert,
} from "reactstrap";

import "../styles/sign.css";

const Signin = (props) => {
  const [formState, setFormState] = useState({
    username: "",
    usrnmeErrorMessage: "error",
    password: "",
    pswErrorMessage: "error",
    userAuthenticated: false,
    message: "",
  });

  const [isLoading, setLoading] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [path, setPath] = useState("");

  const userNRef = useRef(null);
  const pswRef = useRef(null);

  const usernameChangeHandler = () => {
    let isValid = false;
    userNRef.current && userNRef.current.value
      ? (isValid = usernameIsValid(userNRef.current.value))
      : (isValid = false);

    if (isValid) {
      setFormState({
        ...formState,
        username: userNRef.current.value,
        usrnmeErrorMessage: "",
      });
    } else {
      setFormState({
        ...formState,
        username: "",
        usrnmeErrorMessage: "error",
      });
    }
  };

  const passwordChangeHandler = () => {
    let isValid = false;
    pswRef.current && pswRef.current.value
      ? (isValid = passwordIsValid(pswRef.current.value))
      : (isValid = false);
    if (isValid)
      setFormState({
        ...formState,
        password: pswRef.current.value,
        pswErrorMessage: "",
      });
    else
      setFormState({
        ...formState,
        psw: "",
        pswErrorMessage: "error",
      });
  };

  async function getData(data) {
    await supabase
      .from("user_info")
      .select(
        `username,
            password`
      )
      .match({
        username: `${data.username}`,
        password: `${data.password}`,
      })
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          if (response.data.length) {
            setFormState({
              ...formState,
              userAuthenticated: true,
            });
            props.setAuth(data.username);
          } else
            setFormState({
              ...formState,
              userAuthenticated: false,
              message: (
                <Alert color="danger">username or password is wrong</Alert>
              ),
            });
        } else
          setFormState({
            ...formState,
            userAuthenticated: false,
            message: <Alert color="danger">something went wrong</Alert>,
          });
      })
      .catch(() => {
        setFormState({
          ...formState,
          userAuthenticated: false,
          message: <Alert color="danger">something went wrong</Alert>,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const clickHandler = (e) => {
    e.preventDefault();
    setClicked(true);
    if (formState.usrnmeErrorMessage || formState.pswErrorMessage)
      setFormState({
        ...formState,
        message: (
          <Alert color="danger">Please fill out the form correctly</Alert>
        ),
      });
    else {
      setLoading(true);
      getData({
        username: formState.username,
        password: formState.password,
      });
    }
  };

  const signupClickHandler = (e) => {
    e.preventDefault();
    setPath(<Navigate to="/signup" />);
  };

  return (
    <div className="container">
      <h1>sign in</h1>
      <Container className="form">
        <Form>
          <FormGroup>
            <Label for="username">Username</Label>
            {clicked && formState.usrnmeErrorMessage ? (
              <Input
                id="username"
                placeholder="username"
                onChange={usernameChangeHandler}
                type="text"
                innerRef={userNRef}
                required
                invalid
              />
            ) : (
              <Input
                id="username"
                placeholder="username"
                onChange={usernameChangeHandler}
                type="text"
                innerRef={userNRef}
                required
              />
            )}
            <small>*required</small>
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            {clicked && formState.pswErrorMessage ? (
              <Input
                id="password"
                placeholder="password"
                type="password"
                onChange={passwordChangeHandler}
                innerRef={pswRef}
                required
                invalid
              />
            ) : (
              <Input
                id="password"
                placeholder="password"
                type="password"
                onChange={passwordChangeHandler}
                innerRef={pswRef}
                required
              />
            )}
            <small>
              *at least 8 characters and just letters,numbers and _ (required)
            </small>
          </FormGroup>

          <Button onClick={clickHandler} color="success" block>
            Sign in
          </Button>
          <br />
          <Label for="signup-button">New on Testest?</Label>
          <Button
            id="signup-button"
            color="info"
            block
            onClick={signupClickHandler}
          >
            Sign up
          </Button>
          <br />
          {!isLoading && formState.message}
          {isLoading && <Spinner color="success">Loading...</Spinner>}
          {formState.userAuthenticated && <Navigate to="/main-page" />}
        </Form>
      </Container>
      {path}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    ...state,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setAuth: (username) =>
      dispatch({
        type: "SET_AUTHENTICATED",
        username: username,
      }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Signin);
