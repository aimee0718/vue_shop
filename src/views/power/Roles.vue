<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button type="primary" @click="roleDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop':'', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  type="primary"
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                >{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[i2 === 0 ? '': 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id "
                      type="warning"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300">
          <template v-slot="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEidtRoleDialog(scope.row.id)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeRole(scope.row.id)"
            >删除</el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible="roleDialogVisible" width="50%" @close="roleDialogClosed">
      <el-form
        ref="roleFormRef"
        :rules="roleFormRules"
        label-width="80px"
        :model="roleForm"
        class="role_form"
      >
        <!-- 角色名 -->
        <el-form-item prop="roleName" label="角色名">
          <el-input type="text" placeholder="请输入角色名" v-model="roleForm.roleName"></el-input>
        </el-form-item>
        <!-- 角色描述 -->
        <el-form-item prop="roleDesc" label="角色描述">
          <el-input type="text" placeholder="请输入角色描述" v-model="roleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="roleDialogVisible=false">取 消</el-button>
          <el-button type="primary" @click="addRole">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 修改角色对话框 -->
    <el-dialog
      title="修改角色"
      :visible="editRoleDialogVisible"
      width="50%"
      @close="editRoleDialogClosed"
    >
      <el-form
        ref="editRoleFormRef"
        :rules="editRoleFormRules"
        label-width="80px"
        :model="editRoleForm"
      >
        <!-- 角色名 -->
        <el-form-item prop="roleName" label="角色名">
          <el-input type="text" placeholder="请输入角色名" v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <!-- 角色描述 -->
        <el-form-item prop="roleDesc" label="角色描述">
          <el-input type="text" placeholder="请输入角色描述" v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editRoleDialogVisible=false">取 消</el-button>
          <el-button type="primary" @click="editRole">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      @close="setRightsDialogClosed"
      :visible="setRightDialogVisible"
      width="50%"
    >
      <el-tree
        ref="treeRef"
        :data="rightsList"
        show-checkbox
        :props="TreeProps"
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
      ></el-tree>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="setRightDialogVisible=false">取 消</el-button>
          <el-button type="primary" @click="setRights">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRolesList,
  addRole,
  removeOneRole,
  getOneRole,
  editOneRole,
  removeRight,
  getRights,
  setRights
} from '../../network/home'
export default {
  data () {
    return {
      rolesList: [],
      roleForm: {
        roleName: '',
        roleDesc: '',
        children: {}
      },
      rightsList: [],
      defKeys: [],
      roleId: '',
      editRoleForm: {},
      roleFormRules: {
        roleName: [
          {
            required: true,
            message: '请输入角色名称',
            trigger: 'blur'
          }],
        roleDesc: [
          {
            required: true,
            message: '请输入角色描述',
            trigger: 'blur'
          }]
      },
      editRoleFormRules: {
        roleName: [
          {
            required: true,
            message: '请输入角色名称',
            trigger: 'blur'
          }],
        roleDesc: [
          {
            required: true,
            message: '请输入角色描述',
            trigger: 'blur'
          }]
      },
      roleDialogVisible: false,
      editRoleDialogVisible: false,
      setRightDialogVisible: false,
      TreeProps: {
        children: 'children',
        label: 'authName'
      }
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    addRole () {
      this.$refs.roleFormRef.validate(valid => {
        if (!valid) return
        this.addRole()
      })
    },
    editRole () {
      this.$refs.editRoleFormRef.validate(valid => {
        if (!valid) return
        this.editOneRole()
      })
    },
    removeRole (id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.removeOneRole(id)
      }).catch(() => {
        this.$message.info('已取消删除')
      })

    },
    setRights () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      setRights(this.roleId, idStr).then(res => {
        if (res.data.meta.status != 200) {
          return this.$message.error('更新失败')
        }
        this.$message.success('更新成功')
        this.getRolesList()
        this.setRightDialogVisible = false
      })
    },
    showEidtRoleDialog (id) {
      this.getOneRole(id)
    },
    showSetRightDialog (role) {
      this.roleId = role.id
      this.getRights(role)
    },
    roleDialogClosed () {
      this.$refs.roleFormRef.resetFields()
    },
    editRoleDialogClosed () {
      this.$refs.editRoleFormRef.resetFields()
    },
    setRightsDialogClosed () {
      this.defKeys = []
    },
    removeRightById (role, rightId) {
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.removeRight(role, rightId)
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    /* 网络请求 */
    getRolesList () {
      getRolesList().then(res => {
        if (res.data.meta.status != 200) {
          return this.$message.error(res.data.meta.msg)
        }
        this.rolesList = res.data.data
      })
    },
    getRights (role) {
      getRights().then(res => {
        if (res.data.meta.status != 200) {
          return this.$message.error(res.data.meta.msg)
        }
        this.rightsList = res.data.data
        this.getLeafKeys(role, this.defKeys)
        this.setRightDialogVisible = true
      })
    },
    getLeafKeys (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    getOneRole (id) {
      getOneRole(id).then(res => {
        if (res.data.meta.status != 200) {
          return this.$message.error(res.data.meta.msg)
        }
        this.editRoleForm = res.data.data
        this.editRoleDialogVisible = true
      })
    },
    addRole () {
      addRole(this.roleForm).then(res => {
        if (res.data.meta.status != 201) {
          return this.$message.error(res.data.meta.msg)
        }
        this.roleDialogVisible = false
        this.$message.success(res.data.meta.msg)
        this.getRolesList()
      })
    },
    editOneRole () {
      editOneRole(this.editRoleForm).then(res => {
        if (res.data.meta.status != 200) {
          return this.$message.error(res.data.meta.msg)
        }
        this.editRoleDialogVisible = false
        this.$message.success('更新成功！')
        this.getRolesList()
      })
    },
    removeOneRole (id) {
      removeOneRole(id).then(res => {
        if (res.data.meta.status != 200) {
          return this.$message.error(res.data.meta.msg)
        }
        this.$message.success(res.data.meta.msg)
        this.getRolesList()
      })
    },
    removeRight (role, rightId) {
      removeRight(role.id, rightId).then(res => {
        if (res.data.meta.status != 200) {
          return this.$message.error(res.data.meta.msg)
        }
        this.$message.success(res.data.meta.msg)
        role.children = res.data.data
      })
    }
  }
}

</script>
<style scoped>
.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.el-tag {
  margin: 7px;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>