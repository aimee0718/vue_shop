import axios from "./axios"

export function checkLogin (loginForm) {
  return axios.post('/login', loginForm)
}