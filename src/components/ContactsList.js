import React, { useState } from "react";
import { connect } from "react-redux";
import { Navigate } from "react-router";
import { ListGroup, ListGroupItem } from "reactstrap";

const ContactsList = (props) => {
  const [navigation, setNavigation] = useState(null);

  const addUserHandler = (contact) => {
    props.addCurrentContact(contact);
    setNavigation(<Navigate to={`/contacts/${contact}`} />);
  };

  return (
    <React.Fragment>
      {navigation}
      <ListGroup>
        {props.contactsList.map((contact) => (
          <ListGroupItem
            tag="a"
            color={props.color}
            key={contact}
            onClick={() => addUserHandler(contact)}
          >
            {contact}
          </ListGroupItem>
        ))}
      </ListGroup>
    </React.Fragment>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    addCurrentContact: (contact) =>
      dispatch({
        type: "ADD_CURRENT_CONTACT",
        contact: contact,
      }),
  };
};

export default connect(null, mapDispatchToProps)(ContactsList);
