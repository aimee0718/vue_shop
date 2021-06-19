<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/img/logo.png" alt />
      </div>
      <!-- 登录表单区域 -->
      <el-form ref="loginFormRef" :rules="loginFormRules" :model="loginForm" class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password" prefix-icon="iconfont icon-lock"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { checkLogin } from '../network/login'
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '长度在3到10个字符',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }
        ]
      }
    }
  },

  components: {},

  methods: {
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        checkLogin(this.loginForm).then(res => {
          if (res.data.meta.status !== 200) return this.$message.error('登录失败')
          this.$message.success('登录成功')
          window.sessionStorage.setItem('token', res.data.data.token)
          this.$router.push('/home')
        })
      })
    },
    resetLoginForm () {
      // 点击重置登录表单
      this.$refs.loginFormRef.resetFields()
    }
  }
}

</script>
<style lang="less" scoped>
.login_container {
  height: 100%;
  background-color: #2b4b6b;
}

.login_box {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  height: 300px;
  width: 450px;
  background-color: #fff;
  border-radius: 3px;

  .avatar_box {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 130px;
    width: 130px;
    padding: 10px;
    border: 1px solid #eee;
    border-radius: 50%;
    box-shadow: 0 0 10px #ddd;
    img {
      height: 100%;
      width: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.btns {
  display: flex;
  justify-content: flex-end;
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>