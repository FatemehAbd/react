import React, { useRef, useState, useEffect } from "react";
import { connect } from "react-redux";
import { Navigate } from "react-router";
import { supabase } from "../supabaseClient";
import "../styles/pv.css";
import {
  Alert,
  InputGroup,
  Input,
  Button,
  Card,
  CardText,
  CardHeader,
  Badge,
  ButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Spinner,
  Navbar,
  UncontrolledTooltip,
} from "reactstrap";

const ContactPv = (props) => {
  const [messages, setMessages] = useState([]);
  const [fetchingMessages, setFetchingMessages] = useState(false);
  const [path, setPath] = useState(null);
  const [dropdownOpen, setOpen] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [response,setResponse] = useState(null)

  const textareaRef = useRef();

  useEffect(() => {
    fetchMessagesHandler();
  }, []);

  const id = Math.floor(Math.random() * 100000000);

  const emergencySendHandler = () => {
    const from = props.auth.userName;
    const to = props.contacts.currentContact;
    const body = textareaRef.current.value;
    const date = Date.now();
    textareaRef.current.value = "";

    sendMessageToDB(id, from, to, body, date, true);
    setLoading(true);
  };

  const sendHandler = () => {
    const from = props.auth.userName;
    const to = props.contacts.currentContact;
    const body = textareaRef.current.value;
    const date = Date.now();
    textareaRef.current.value = "";

    sendMessageToDB(id, from, to, body, date, false);
    setLoading(true);
  };

  async function sendMessageToDB(id, from, to, body, date, isEmergency) {
    await supabase
      .from("messages")
      .insert({
        from: from,
        to: to,
        isEmergency: isEmergency,
        body: JSON.stringify(body),
        date: date,
        id: id,
      })
      .then((response) => {
        if (response.status !== 200 && response.status !== 201) {
          setResponse(<Alert color="danger">something went wrong</Alert>);
        } else {
          setResponse(null);
        }
      })
      .catch(() => {
        setResponse(<Alert color="danger">something went wrong</Alert>);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  async function fetchMessagesHandler() {
    setFetchingMessages(true);
    await supabase
      .from("messages")
      .select()
      .or(
        `and(from.eq.${props.auth.userName},to.eq.${props.contacts.currentContact}),and(to.eq.${props.auth.userName},from.eq.${props.contacts.currentContact})`
      )
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          setResponse(null);
          setMessages(
            response.data.map(
              (message) =>
                (message = {
                  id: message.id,
                  from: message.from,
                  to: message.to,
                  body: JSON.parse(message.body),
                  date: message.date,
                  isEmergency: message.isEmergency,
                })
            )
          );
        } else {
          setResponse(<Alert color="danger">something went wrong</Alert>);
        }
      })
      .catch(() => {
        setResponse(<Alert color="danger">something went wrong</Alert>);
      })
      .finally(() => {
        setFetchingMessages(false);
      });
  }

  async function deleteFromDB(id) {
    await supabase
      .from("messages")
      .delete()
      .match({ id: id })
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          setResponse(null);
        } else {
          setResponse(<Alert color="danger">something went wrong</Alert>);
        }
      })
      .catch(() => {
        setResponse(<Alert color="danger">something went wrong</Alert>);
      });
  }

  async function unmarkFromDB(id) {
    await supabase
      .from("messages")
      .update({ isEmergency: false })
      .match({ id: id })
      .then((response) => {
        console.log("r1");
        if (response.status === 200 || response.status === 201) {
          setResponse(null);
        } else {
          setResponse(<Alert color="danger">something went wrong</Alert>);
        }
      })
      .catch(() => {
        setResponse(<Alert color="danger">something went wrong</Alert>);
      });
  }

  async function deleteUserFromDB(contact) {
    await supabase
      .from("messages")
      .delete()
      .or(
        `and(from.eq.${props.auth.userName},to.eq.${contact}),and(to.eq.${props.auth.userName},from.eq.${contact})`
      )
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          setResponse(null);
        } else {
          setResponse(<Alert color="danger">something went wrong</Alert>);
        }
      })
      .catch(() => {
        setResponse(<Alert color="danger">something went wrong</Alert>);
      });
  }

  const deleteMessageHandler = (id) => {
    deleteFromDB(id);
  };

  const unmarkMessageHandler = (id) => {
    unmarkFromDB(id);
  };

  const deleteUserHandler = () => {
    deleteUserFromDB(props.contacts.currentContact);
    props.deleteContact(props.contacts.currentContact);
    setPath(<Navigate to="/main-page" />);
  };

  return (
    <React.Fragment>
      {path}
      <Navbar color="dark" className="fixed-top">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-arrow-repeat"
          viewBox="0 0 16 16"
          id="svg-repeat"
          onClick={fetchMessagesHandler}
        >
          <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z" />
          <path
            fillRule="evenodd"
            d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"
          />
        </svg>
        <UncontrolledTooltip placement="left" target="svg-repeat">
          Click To Fetch New Messages
        </UncontrolledTooltip>
      </Navbar>

      <Button
        color="danger"
        onClick={deleteUserHandler}
        width="100%"
        className="p-2 mt-4"
      >
        Delete This User
      </Button>

      {isLoading && (
        <Spinner color="success" className="m-5">
          Loading...
        </Spinner>
      )}

      {fetchingMessages && (
        <div className="m-5">
          <Spinner color="success" type="grow">
            Loading...
          </Spinner>
          <Spinner color="info" type="grow">
            Loading...
          </Spinner>
          <Spinner color="warning" type="grow">
            Loading...
          </Spinner>
          <Spinner color="danger" type="grow">
            Loading...
          </Spinner>
        </div>
      )}

      {messages.length
        ? messages.map((message) =>
            message.from === `${props.auth.userName}` ? (
              <div className="p-3 mt-4 rounded" key={message.id}>
                <Card color="success" className="w-75 ms-auto">
                  <ButtonDropdown
                    toggle={() => {
                      dropdownOpen === "" ? setOpen(message.id) : setOpen("");
                    }}
                    isOpen={dropdownOpen === message.id}
                    className="ms-auto py-0"
                  >
                    <DropdownToggle caret color="success" className="py-0">
                      <DropdownMenu>
                        <DropdownItem
                          onClick={() => deleteMessageHandler(message.id)}
                        >
                          delete message
                        </DropdownItem>
                        {message.isEmergency && (
                          <div>
                            <DropdownItem divider />
                            <DropdownItem
                              onClick={() => unmarkMessageHandler(message.id)}
                            >
                              unmark message
                            </DropdownItem>
                          </div>
                        )}
                      </DropdownMenu>
                    </DropdownToggle>
                  </ButtonDropdown>
                  <CardHeader className="py-0">You</CardHeader>
                  <CardText className="p-3">{message.body}</CardText>
                  <div>
                    {message.isEmergency && (
                      <Badge color="danger" className="m-2">
                        emergency
                      </Badge>
                    )}
                  </div>
                </Card>
              </div>
            ) : (
              <div className="p-3 mt-4 rounded" width="100%" key={message.id}>
                <Card color="info" className="ml-0 w-75">
                  <CardHeader className="py-0">{message.from}</CardHeader>
                  <CardText className="p-3">{message.body}</CardText>
                  <div>
                    {message.isEmergency && (
                      <Badge color="danger" className="m-2">
                        emergency
                      </Badge>
                    )}
                  </div>
                </Card>
              </div>
            )
          )
        : null}
      {!messages.length && (
        <div className="no-message-container">no message yet</div>
      )}
      {response}
      <div className="space"></div>
      <InputGroup className="p-3 fixed-bottom" width="50%">
        <Button color="danger" onClick={emergencySendHandler}>
          send as emergency
        </Button>
        <Input type="textarea" innerRef={textareaRef} />
        <Button color="warning" onClick={sendHandler}>
          send
        </Button>
      </InputGroup>
    </React.Fragment>
  );
};
const mapStateToProps = (state) => {
  return state;
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteContact: (userName) => {
      dispatch({
        username: userName,
        type: "DELETE_FROM_NEW_CONTACTS",
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ContactPv);
