import validator from "validator";

export const usernameIsValid = (username) => {
  const text = username
    .toString()
    .toLowerCase()
    .trim();
  if (text === "") return false;
  for (let l of text) {
    if (!(l >= "a" && l <= "z") && !(l >= "0" && l <= "9") && l !== "_")
      return false;
  }
  return true;
};

export const passwordIsValid = (password) => {
  if (password.length !== password.trim().length) return false;
  else if (password.trim().length < 8) return false;
  else return true;
};

export const emailIsValid = (email) => {
  if (validator.isEmail(email)) return true;
  return false;
};
