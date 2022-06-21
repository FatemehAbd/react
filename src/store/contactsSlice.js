const initialState = {
  contactsName: [],
  currentContact: "",
  messages: [
    {
      id: "",
      from: "",
      to: "",
      body: "",
      date: "",
      isEmergency: false,
    },
  ],
};

const contactsSlice = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_CONTACT":
      state = {
        ...state,
        contactsName: [...state.contactsName, action.username],
      };
      break;

    case "ADD_MESSAGE_TO_PV":
      state = {
        ...state,
        contactsMessages: [
          ...state.contactsMessages,
          {
            id: action.id,
            from: action.from,
            to: action.to,
            body: action.body,
            date: action.date,
            isEmergency: action.isEmergency,
          },
        ],
      };
      break;

    case "ADD_CURRENT_CONTACT":
      state = {
        ...state,
        currentContact: action.contact,
      };
      break;

    case "DELETE_FROM_NEW_CONTACTS":
      state = {
        ...state,
        contactsName: [
          state.contactsName.filter((contact) => contact !== action.username),
        ],
      };
      break;

    default:
      return state;
  }
  return state;
};
export default contactsSlice;
