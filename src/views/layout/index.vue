<template>
    <el-container>
        <el-aside width="200px">
            <AppAside/>
        </el-aside>
        <el-container>
            <el-header>
                <AppHeader/>
            </el-header>
            <el-main>
                <router-view/>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import AppAside from './components/AppAside'
import AppHeader from './components/AppHeader'
export default {
  name: 'AppLayout',
  // 注册子组件
  components: {
    AppAside,
    AppHeader
  },
  data () {
    return {}
  }
}
</script>

<style lang="less" scoped>
.el-container {
    height: 100%;
}
.el-aside {
    background-color: rgb(220, 226, 167);
}
.el-header {
    background-color: rgb(236, 164, 143);
}
.el-main {
    background-color: rgb(205, 160, 223);
}
</style>
