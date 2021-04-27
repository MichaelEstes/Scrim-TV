import { getUserContext } from "../api/endpoints";

export var userContext = {};

export const initUserContext = () => {
  if (!userContext.id) {
    return getUserContext().then(res => {
      const { data } = res;
      if (data.id) {
        gtag("set", {
          user: data.id
        });
      }
      userContext = res.data;
    });
  }
};

export const resetUserContext = () => {
  userContext = {};
  return initUserContext();
};

export const isUserLoggedIn = () => {
  return userContext.id && !userContext.temp;
};
