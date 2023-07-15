import { API_URL } from './config.js';
import { TIME_OUT } from './config.js';
const timeout = function (s) {
  //timer if data fetching from the url is taking long so we can handle it
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const getJSON = async function (url) {
  try {
    const fetchpro = fetch(url);
    const res = await Promise.race([fetchpro, timeout(TIME_OUT)]); // if the timeout wins then we will throw the error
    const data = await res.json(); //coverting body to json
    if (!res.ok) throw new Error(`${data.message} , ${res.success}`);
    return data;
  } catch (err) {
    throw err;
  }
};