<template>
  <div class="home">
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  components: {
  },
  methods: {
    logout () {
      console.log(123);
      window.sessionStorage.removeItem('token')
      this.$message.success('退出登录')
      this.$router.push('/login')
    }
  }
}
</script>
