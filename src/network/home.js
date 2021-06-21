import axios from "./axios"

// menu
export function getMenuList () {
  return axios.get('/menus')
}

// user
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

// rights
export function getRightsList () {
  return axios.get('/rights/list')
}

// roles
export function getRolesList () {
  return axios.get('/roles')
}

export function addRole (roleForm) {
  return axios.post('/roles', {
    roleName: roleForm.roleName,
    roleDesc: roleForm.roleDesc
  })
}

export function removeOneRole (id) {
  return axios.delete('/roles/' + id)
}

export function getOneRole (id) {
  return axios.get('/roles/' + id)
}

export function editOneRole (editForm) {
  return axios.put('/roles/' + editForm.roleId, {
    roleName: editForm.roleName,
    roleDesc: editForm.roleDesc
  })
}

export function removeRight (roleId, rightId) {
  return axios.delete('/roles/' + roleId + '/rights/' + rightId)
}

export function getRights () {
  return axios.get('/rights/tree')
}

export function setRights (roleId, idStr) {
  return axios.post('roles/' + roleId + '/rights', {
    rids: idStr
  })
}

export function getRoles () {
  return axios.get('/roles')
}

export function setRoles (userId, role) {
  return axios.put('users/' + userId + '/role', {
    rid: role
  })
}
