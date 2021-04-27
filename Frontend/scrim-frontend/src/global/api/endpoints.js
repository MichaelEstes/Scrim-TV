export const getUserContext = () => {
  const url = `/api/user/context`;
  return fetch(url, {
    credentials: "same-origin",
    method: "GET"
  }).then(res => res.json());
};

export const postLogin = info => {
  const url = `/api/users/login`;
  return fetch(url, {
    credentials: "same-origin",
    method: "POST",
    body: JSON.stringify(info)
  }).then(res => res.json());
};

export const postRegister = info => {
  const url = `/api/users/register`;
  return fetch(url, {
    credentials: "same-origin",
    method: "POST",
    body: JSON.stringify(info)
  }).then(res => res.json());
};

export const getHome = () => {
  const url = `/api/trending`;
  return fetch(url, {
    credentials: "same-origin",
    method: "GET"
  }).then(res => res.json());
};

export const getProjects = () => {
  const url = `/api/projects`;
  return fetch(url, {
    credentials: "same-origin",
    method: "GET"
  }).then(res => res.json());
};

export const getProject = id => {
  const url = `/api/project?id=${id}`;
  return fetch(url, {
    credentials: "same-origin",
    method: "GET"
  }).then(res => res.json());
};

export const getVideo = broadcastId => {
  const url = `/api/broadcast?id=${broadcastId}`;
  return fetch(url, {
    credentials: "same-origin",
    method: "GET"
  }).then(res => {
    return res.json();
  });
};

export const getPaper = paperId => {
  const url = `/api/paper?id=${paperId}`;
  return fetch(url, {
    credentials: "same-origin",
    method: "GET"
  }).then(res => {
    return res.json();
  });
};

export const updateViewCount = broadcastId => {
  const url = `/api/broadcasts/viewed?id=${broadcastId}`;
  return fetch(url, {
    credentials: "same-origin",
    method: "GET"
  }).then(res => {
    return res.json();
  });
};

export const getUser = id => {
  const url = `/api/user?id=${id}`;

  return fetch(url, {
    credentials: "same-origin",
    method: "GET"
  }).then(res => {
    return res.json();
  });
};

export const getProfile = () => {
  const url = "/api/profile";

  return fetch(url, {
    credentials: "same-origin",
    method: "GET",
    cache: "no-cache"
  }).then(res => {
    return res.json();
  });
};

export const updateProfile = body => {
  const url = `/api/user/update`;
  return fetch(url, {
    credentials: "same-origin",
    method: "PUT",
    body: JSON.stringify(body)
  }).then(res => {
    return res.json();
  });
};

export const updateProfileImage = body => {
  const url = `/api/user/update/image`;
  return fetch(url, {
    credentials: "same-origin",
    method: "POST",
    body: body
  }).then(res => {
    return res.json();
  });
};

export const getRecommendedUsers = userType => {
  let url = "";
  if (userType) {
    url = `/api/users/recommended/${userType}`;
  } else {
    url = `/api/users/recommended`;
  }

  return fetch(url, {
    credentials: "same-origin",
    method: "GET"
  }).then(res => res.json());
};

export const getRecommendedUsersPaginated = (userType, page) => {
  const url = `/api/users/recommended/${userType}?page=${page}`;

  return fetch(url, {
    credentials: "same-origin",
    method: "GET"
  }).then(res => res.json());
};

export const postFeedback = feedback => {
  const url = `/api/user/feedback`;

  return fetch(url, {
    credentials: "same-origin",
    method: "POST",
    body: JSON.stringify(feedback)
  }).then(res => res.json());
};

export const connectToUser = userId => {
  const url = `/api/user/connectTo/${userId}`;

  return fetch(url, {
    credentials: "same-origin",
    method: "GET"
  }).then(res => res.json());
};

export const getUserEmail = userId => {
  const url = `/api/user/message/${userId}`;

  return fetch(url, {
    credentials: "same-origin",
    method: "GET"
  }).then(res => res.json());
};

export const postBroadcast = body => {
  const url = `/api/broadcasts/create`;

  return fetch(url, {
    credentials: "same-origin",
    method: "POST",
    body: JSON.stringify(body)
  }).then(res => res.json());
};

export const uploadVideo = (id, video) => {
  const url = `/api/broadcasts/upload?id=${id}`;
  return fetch(url, {
    credentials: "same-origin",
    method: "POST",
    body: video
  }).then(res => {
    return res.json();
  });
};

export const postPaper = body => {
  const url = `/api/papers/create`;

  return fetch(url, {
    credentials: "same-origin",
    method: "POST",
    body: JSON.stringify(body)
  }).then(res => res.json());
};
