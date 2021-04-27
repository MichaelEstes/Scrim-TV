export const validateDisplayName = displayName => {
  if (!displayName) return false;
  const regex = /^[A-Za-z0-9 ]*[A-Za-z0-9][A-Za-z0-9 ]*$/;
  return regex.test(displayName);
};

export const validateEmail = email => {
  if (!email) return false;
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email.toLowerCase());
};

export const validatePhone = phone => {
  if (!phone) return false;
  const regex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
  return regex.test(phone.toLowerCase());
};

export const validateFirstName = firstName => {
  if (!firstName) return false;
  // No spaces or special characters and must be at least 2 characters
  // TODO: Change this regex to reflect actual requirements
  const regex = /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]{2,}$/g;
  return regex.test(firstName);
};

export const validateLastName = lastName => {
  if (!lastName) return false;
  // No spaces or special characters and must be at least 2 characters
  // TODO: Change this regex to reflect actual requirements
  const regex = /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]{2,}$/g;
  return regex.test(lastName);
};

export const validatePassword = password => {
  if (!password) return false;
  const regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*-_,./<>?;':"]).{8,}$/;
  return regex.test(password);
};
