<template>
  <div id="app">
    <el-container>
      <el-aside>
        <el-menu
          :default-active="index"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          @select="selectMenu"
          >
          <el-menu-item index="1">
            <i class="el-icon-menu"></i>
            <span slot="title">diff</span>
          </el-menu-item>
          <el-menu-item index="2">
            <i class="el-icon-document"></i>
            <span slot="title">文档(wiki)</span>
          </el-menu-item>
          <el-menu-item index="3">
            <i class="el-icon-location"></i>
            <span slot="title">文件名-页面路径</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
      <router-view/>
      </el-main>
  </el-container>
</div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      index: '1'
    }
  },
  methods: {
    selectMenu (index) {
      this.index = index
      switch (index) {
        case '1':
          this.$router.push('/diff')
          break
        case '2':
          this.$router.push('/wiki')
          break
        case '3':
          this.$router.push('check_path')
      }
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  box-sizing: border-box;
}
.el-container {
  width: 100%;
  height: 100vh;
  overflow: scroll;
  .el-aside {
    width: 600px !important;
    padding-top: 300px;
    height: 100%;
    box-sizing: border-box;
    background-color: rgb(84, 92, 100);
    .el-menu-item {
      height: 400px;
      line-height: 400px;
      i {
        margin-right: 40px;
        font-size: 60px;
      }
      span {
        font-size: 60px;
      }
    }
    .is-active {
      background-color: rgb(67,74,90) !important;
    }
  }
  .el-main {
    padding-top: 200px;
    box-sizing: border-box;
    height: 100%;
  }
}
</style>
