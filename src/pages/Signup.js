import React from "react";
import { useState, useRef } from "react";
import {
  usernameIsValid,
  passwordIsValid,
  emailIsValid,
} from "../components/Cntrls";
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

const Signup = (props) => {
  const [formState, setFormState] = useState({
    userId: Math.floor(Math.random() * 100000000),
    username: "",
    usrnmeErrorMessage: "error",
    password: "",
    pswErrorMessage: "error",
    email: "",
    emailErrorMessage: "error",
    sentSuccessfully: false,
    message: "",
  });
  const [isLoading, setLoading] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [path, setPath] = useState("");

  const userNRef = useRef(null);
  const pswRef = useRef(null);
  const emailRef = useRef(null);

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

  const emailChangeHandler = () => {
    let isValid = false;
    emailRef.current && emailRef.current.value
      ? (isValid = emailIsValid(emailRef.current.value))
      : (isValid = false);

    if (!isValid)
      setFormState({
        ...formState,
        email: "",
        emailErrorMessage: "error",
      });
    else
      setFormState({
        ...formState,
        email: emailRef.current.value,
        emailErrorMessage: "",
      });
  };

  async function sendData(data) {
    await supabase
      .from("user_info")
      .insert({
        id: formState.userId,
        username: data.username,
        password: data.password,
        email: data.email,
      })
      .then((response) => {
        if (response.status === 409 && response.error.code === "23505")
          setFormState({
            ...formState,
            sentSuccessfully: false,
            message: (
              <Alert color="danger">username or email already exists</Alert>
            ),
          });
        else if (response.status === 200 || response.status === 201) {
          setFormState({
            ...formState,
            sentSuccessfully: true,
          });
          props.setAuth(formState.username);
        } else
          setFormState({
            ...formState,
            sentSuccessfully: false,
            message: <Alert color="danger">something went wrong</Alert>,
          });
      })
      .catch(() => {
        setFormState({
          ...formState,
          sentSuccessfully: false,
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
    if (
      formState.usrnmeErrorMessage ||
      formState.pswErrorMessage ||
      formState.emailErrorMessage
    )
      setFormState({
        ...formState,
        message: (
          <Alert color="danger">Please fill out the form correctly</Alert>
        ),
      });
    else {
      setLoading(true);
      sendData({
        username: formState.username,
        password: formState.password,
        email: formState.email,
      });
    }
  };

  const signinClickHandler = (e) => {
    e.preventDefault();
    setPath(<Navigate to="/signin" />);
  };

  return (
    <div className="container">
      <h1>sign up</h1>
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
          <FormGroup>
            <Label for="email">Email</Label>
            {clicked && formState.emailErrorMessage ? (
              <Input
                id="email"
                placeholder="email"
                type="email"
                onChange={emailChangeHandler}
                innerRef={emailRef}
                required
                invalid
              />
            ) : (
              <Input
                id="email"
                placeholder="email"
                type="email"
                onChange={emailChangeHandler}
                innerRef={emailRef}
                required
              />
            )}

            <small>*required</small>
          </FormGroup>
          <Button onClick={clickHandler} color="info" block>
            Sign up
          </Button>
          <br />
          <Label for="signin-button">Already have an account?</Label>
          <Button
            id="signin-button"
            color="success"
            block
            onClick={signinClickHandler}
          >
            Sign in
          </Button>
          <br />
          {!isLoading && formState.message}
          {isLoading && <Spinner color="success">Loading...</Spinner>}
          {formState.sentSuccessfully && <Navigate to="/main-page" />}
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

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
