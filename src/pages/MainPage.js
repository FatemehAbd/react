import React, { useRef, useState, useEffect } from "react";
import { connect } from "react-redux";
import { Navigate } from "react-router";
import { Button, Input, InputGroup, List, Alert, Spinner } from "reactstrap";
import { supabase } from "../supabaseClient";
import ContactsList from "../components/ContactsList";

const MainPage = (props) => {
  const [response, setResponse] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [contactsName, setContactsName] = useState([]);

  const searchRef = useRef(null);

  useEffect(() => {
    setFetching(true);
    fetchContacts(props.auth.userName);
  }, [props.contacts.contactsName]);

  async function fetchContacts(username) {
    await supabase
      .from("messages")
      .select("to")
      .match({ from: username })
      .then((response) => {
        console.log(response);
        if (response.status === 200 || response.status === 201) {
          setContactsName([...new Set(response.data.map((info) => info.to))]);
        } else {
          setResponse(<Alert color="danger">something went wrong</Alert>);
        }
      })
      .catch(() => {
        setResponse(<Alert color="danger">something went wrong</Alert>);
      })
      .finally(() => {
        setFetching(false);
      });
  }

  async function getUsername(username) {
    await supabase
      .from("user_info")
      .select(`username`)
      .match({
        username: `${username}`,
      })
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          if (response.data.length) {
            const usrN = response.data[0].username;
            addContactHandler(usrN);
            // setResponse(<Button color="success" className="my-3" block onClick={()=>}>get this user info</Button>)
            console.log("rrr", response);
          } else
            setResponse(<Alert color="danger">username doesnt exist</Alert>);
        } else setResponse(<Alert color="danger">something went wrong</Alert>);
      })
      .catch(() => {
        setResponse(<Alert color="danger">something went wrong</Alert>);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const addContactHandler = (username) => {
    props.addContact(username);
    searchRef.current.value = "";
  };

  const searchUserHandler = () => {
    setLoading(true);
    if (contactsName.includes(searchRef.current.value)) {
      setResponse(
        <Alert color="danger">
          the username is already in the contacts list
        </Alert>
      );
    } else if (props.auth.userName !== searchRef.current.value) {
      getUsername(searchRef.current.value);
    } else {
      setResponse(
        <Alert color="danger">the username cannot be yourself</Alert>
      );
    }
  };

  if (!props.auth.userIsAuthenticated) return <Navigate to="/" />;

  return (
    <React.Fragment>
      <InputGroup className="px-5 pt-5" width="100%" min-width="300px">
        <Input
          innerRef={searchRef}
          placeholder="find a new contact"
          onChange={() => setResponse(null)}
        ></Input>
        <Button color="info" onClick={searchUserHandler}>
          Search
        </Button>
      </InputGroup>
      {fetching && (
        <Spinner
          className="p-5 m-5 fetching-contacts"
          size="50%"
          color="info"
          type="grow"
        ></Spinner>
      )}
      {isLoading}
      <List className="p-5">
        <div className="pb-5">{response}</div>
        {props.contacts.contactsName.length ? (
          <ContactsList
            contactsList={props.contacts.contactsName}
            color="warning"
          />
        ) : null}
        {contactsName.length ? (
          <ContactsList contactsList={contactsName} color="primary" />
        ) : null}
      </List>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return state;
};

const mapDispatchToProps = (dispatch) => {
  return {
    addContact: (userName) => {
      dispatch({
        username: userName,
        type: "ADD_CONTACT",
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainPage);
