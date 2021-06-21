<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" @clear="getUserList" clearable>
            <template #append>
              <el-button @click="getUserList" icon="el-icon-search"></el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userlist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="120"></el-table-column>
        <el-table-column label="状态" width="80">
          <template v-slot="scope">
            <el-switch v-model="scope.row.mg_state" @change="stateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template v-slot="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEidtDialog(scope.row.id)"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeUser(scope.row.id)"
            ></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button
                size="mini"
                type="warning"
                icon="el-icon-setting"
                @click="showSetRolesDialog(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 登录表单区域 -->
      <el-form
        ref="addFormRef"
        :rules="addFormRules"
        label-width="70px"
        :model="addForm"
        class="add_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username" label="用户名">
          <el-input type="text" placeholder="请输入用户名" v-model="addForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password" label="密码">
          <el-input type="text" placeholder="请输入密码" v-model="addForm.password"></el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item prop="email" label="邮箱">
          <el-input type="text" placeholder="请输入邮箱" v-model="addForm.email"></el-input>
        </el-form-item>
        <!-- 手机 -->
        <el-form-item prop="mobile" label="手机号">
          <el-input type="text" placeholder="请输入手机号" v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible=false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户" :visible="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form
        ref="editFormRef"
        :rules="editFormRules"
        label-width="70px"
        :model="editForm"
        class="edit_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username" label="用户名">
          <el-input disabled type="text" placeholder="请输入用户名" v-model="editForm.username"></el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item prop="email" label="邮箱">
          <el-input type="text" placeholder="请输入邮箱" v-model="editForm.email"></el-input>
        </el-form-item>
        <!-- 手机 -->
        <el-form-item prop="mobile" label="手机号">
          <el-input type="text" placeholder="请输入手机号" v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUser">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      @close="setRolesDialogVisible = false"
      :visible="setRolesDialogVisible"
      width="50%"
    >
      <div>
        <p>当前的用户: {{userInfo.username}}</p>
        <p>当前的角色: {{userInfo.role_name}}</p>
        <p>分配新角色:</p>
        <el-select v-model="selectedRoleId" placeholder="请选择">
          <el-option
            v-for="item in roleLists"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="setRolesDialogVisible=false">取 消</el-button>
          <el-button type="primary" @click="setRoles">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getUserList, putUser, addNewUser, getOneUser, editUser, removeOneUser, getRoles, setRoles } from '../../network/home'
export default {
  data () {
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法邮箱'))
    }
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0-9]|166|17[3678]|18[0-9]|19[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法手机号'))
    }

    return {
      addForm: {
        username: '',
        passward: '',
        email: '',
        mobile: ''
      },
      editForm: {},
      addFormRules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在3~10个字符间'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 15,
            message: '密码的长度在6~15个字符间'
          }
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          },
          {
            validator: checkMobile,
            trigger: 'blur'
          }
        ]
      },
      editFormRules: {
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          },
          {
            validator: checkMobile,
            trigger: 'blur'
          }
        ]
      },
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userlist: [],
      total: 0,
      userInfo: {},
      roleLists: [],
      selectedRoleId: '',
      addDialogVisible: false,
      editDialogVisible: false,
      setRolesDialogVisible: false
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    stateChange (userInfo) {
      this.putUser(userInfo)
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    setRolesDialogClosed () {
      this.userInfo = {}
      this.selectedRoleId = ''
    },
    addUser () {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) return
        this.addNewUser()
      })
    },
    editUser () {
      this.$refs.editFormRef.validate(valid => {
        if (!valid) return
        this.editOneUser()
      })
    },
    removeUser (id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.removeOneUser(id)
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    setRoles () {
      if (!this.selectedRoleId) {
        return this.$message.error('请选择要分配的角色！')
      }
      setRoles(this.userInfo.id, this.selectedRoleId).then(res => {
        if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
        this.$message.success('更新角色成功！')
        this.getUserList()
        this.setRolesDialogVisible = false
      })
    },
    showSetRolesDialog (userInfo) {
      this.userInfo = userInfo
      this.getRoles()
    },
    showEidtDialog (id) {
      getOneUser(id).then(res => {
        this.editForm = res.data.data
        this.editDialogVisible = true
      })
    },
    /* 网络请求 */
    getUserList () {
      getUserList(this.queryInfo).then(res => {
        if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
        this.userlist = res.data.data.users
        this.total = res.data.data.total
      })
    },
    putUser (userInfo) {
      putUser(userInfo).then(res => {
        if (res.data.meta.status !== 200) {
          userInfo.mg_state = !userInfo.mg_state
          return this.$message.error(res.data.meta.msg)
        }
        this.$message.success(res.data.meta.msg)
      })
    },
    addNewUser () {
      addNewUser(this.addForm).then(res => {
        console.log(res)
        if (res.data.meta.status !== 201) {
          return this.$message.error(res.data.meta.msg)
        }
        this.$message.success(res.data.meta.msg)
        this.addDialogVisible = false
        this.getUserList()
      })
    },
    editOneUser () {
      editUser(this.editForm).then(res => {
        if (res.data.meta.status !== 200) {
          return this.$message.error(res.data.meta.msg)
        }
        this.editDialogVisible = false
        this.$message.success(res.data.meta.msg)
        this.getUserList()
      })
    },
    removeOneUser (id) {
      removeOneUser(id).then(res => {
        console.log(res)
        this.$message.success('删除成功!')
        this.getUserList()
      })
    },
    getRoles () {
      getRoles().then(res => {
        if (res.data.meta.status !== 200) {
          return this.$message.error(res.data.meta.msg)
        }
        this.roleLists = res.data.data
      })
      this.setRolesDialogVisible = true
    }
  }
}

</script>
<style lang="less" scoped>
</style>