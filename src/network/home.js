import axios from "./axios"

export function getMenuList () {
  return axios.get('/menus')
}

export function getUserList (queryInfo) {
  return axios.get('/users', {params: queryInfo })
}

export function putUser (userInfo) {
  return axios.put(`/users/${userInfo.id}/state/${userInfo.mg_state}`, userInfo)
}

export function addNewUser (addForm) {
  return axios.post('/users', addForm)
}
export function getOneUser (id) {
  return axios.get(`/users/${id}`)
}

export function editUser (editForm) {
  console.log(editForm)
  return axios.put('/users/' + editForm.id, {
    email: editForm.email,
    mobile: editForm.mobile
  })
}

export function removeOneUser (id) {
  return axios.delete('/users/' + id)
}