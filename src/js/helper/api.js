import { f7 } from "framework7-react";

const API = (url, method = "GET", body = null) => {
  const token = localStorage.getItem("token");

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  return fetch(`http://localhost:8000/api/${url}`, options).then(async (res) => {
    
    if(res.status === 401) {
      localStorage.clear();

      f7.dialog.alert("Session expired. PLease Login again.","Session Expired", () => {
        window.location.href = "/login/";
      });

      throw new Error("Unauthorized");
    }
    
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const message = err.message || `Failed to fetch ${url}`;
      throw new Error(message);
    }
    return res.json();
  });
};

export const get = (url) => API(url, "GET");
export const post = (url, body) => API(url, "POST", body);
export const put = (url, body) => API(url, "PUT", body);
export const remove = (url) => API(url, "DELETE");

export default API;
