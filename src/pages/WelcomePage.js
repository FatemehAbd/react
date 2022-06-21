import React, { useState } from "react";
import { Navigate } from "react-router";
import { Button, Container } from "reactstrap";
const WelcomePage = () => {
  const [path, setPath] = useState("");

  const signupClickHandler = (e) => {
    e.preventDefault();
    setPath(<Navigate to="signup" />);
  };

  const signinClickHandler = (e) => {
    e.preventDefault();
    setPath(<Navigate to="signin" />);
  };

  return (
    <>
      <h1 className="page1">
        <span role="img" aria-label="sparkles">
          ✨
        </span>
        Welcome To Testest Social Media App
        <span role="img" aria-label="sparkles">
          ✨
        </span>
      </h1>
      <Container>
        <Button color="info" block onClick={signupClickHandler}>
          sign up
        </Button>
        <Button color="success" block onClick={signinClickHandler}>
          sign in
        </Button>
        {path}
      </Container>
    </>
  );
};
export default WelcomePage;
