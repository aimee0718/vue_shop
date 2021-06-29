import axios from "axios"

export function getCateList (queryInfo) {
  return axios.get('categories', {
    params: queryInfo
  })
}

export function getParentCateList (type) {
  return axios.get('categories', {
    type: type
  })
}

export function setNewCate (addCateFrom) {
  return axios.post('categories', addCateFrom)
}


export function deleteCate (id) {
  return axios.delete('categories/'+ id)
}

export function editCate (data) {
  return axios.put('categories/' + data.cat_id, {
    cat_name: data.cat_name
  })
}

export function getOneCateList (id) {
  return axios.get('categories/' + id)
}

/* Params */
export function getParams (id, activeName) {
  return axios.get('categories/' + id + '/attributes', {
    params: { sel: activeName }
  })
}

export function getOneParams (cateID, attr_id, attr_sel) {
  return axios.get('categories/' + cateID + '/attributes/' + attr_id, {
    params: {
        attr_sel: attr_sel
    }
  })
}

export function setNewParams (cateID, attr_name, attr_sel) {
  return axios.post(`categories/${cateID}/attributes`, {
    attr_name: attr_name,
    attr_sel: attr_sel
  })
}

export function deleteOneParams (cateID, attr_id) {
  return axios.delete(`categories/${cateID}/attributes/${attr_id}`)
}

export function editParams (cateID, attr_id, attr_name, attr_sel) {
  return axios.put(`categories/${cateID}/attributes/${attr_id}`, {
    attr_name: attr_name,
    attr_sel: attr_sel
  })
}

export function setTag (cateID, attr_id, attr_name, attr_sel, attr_vals) {
  return axios.put(`categories/${cateID}/attributes/${attr_id}`, {
    attr_name: attr_name,
    attr_sel: attr_sel,
    attr_vals: attr_vals.join(' '),
  })
}