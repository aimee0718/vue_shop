<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/img/logo.png" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 主体 -->
    <el-container>
      <!-- 左侧边栏 -->
      <el-aside :width="isCollapse? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          router
          :collapse="isCollapse"
          unique-opened
          :collapse-transition="false"
          background-color="#323744"
          text-color="#fff"
          active-text-color="#329bff"
          :default-active="$route.path"
        >
          <el-submenu v-for="item in menulist" :key="item.id" :index="item.id + ''">
            <template #title>
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item
              v-for="subitem in item.children"
              :key="subitem.id"
              :index="'/' + subitem.path"
            >
              <i class="el-icon-menu"></i>
              <span>{{subitem.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getMenuList } from '../network/home'

export default {
  name: 'Home',
  data () {
    return {
      menulist: [],
      isCollapse: false
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      window.sessionStorage.removeItem('token')
      this.$message.success('退出登录')
      this.$router.push('/login')
    },
    getMenuList () {
      getMenuList().then(res => {
        if (res.data.meta.status !== 200) {
          this.$message.error(res.data.meta.msg)
        }
        this.menulist = res.data.data
      })
    },
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 10px;
  background-color: #353a3f;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    img {
      width: 50px;
    }
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #323744;
  color: #fff;
  .el-menu {
    border-right: 0;
  }
}
.el-main {
  background-color: #eaedf2;
}
.toggle-button {
  height: 25px;
  line-height: 25px;
  text-align: center;
  font-size: 10px;
  background-color: #485064;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
