<template>
    <el-row :gutter="20">
        <el-col :span="10">江苏传智播客教育科技股份有限公司</el-col>
        <el-col :span="5" :offset="5">
            <el-dropdown>
                <img width="30px" :src="userInfo.photo" alt="">
                <span class="el-dropdown-link">
                    hao<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>用户设置</el-dropdown-item>
                    <el-dropdown-item @click.native="handleLogout">退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>

        </el-col>
    </el-row>
</template>

<script>
import { removeUser, getUser } from '@/utils/auth'
export default {
  name: 'AppHeader',
  data () {
    return {
      userInfo: {}
    }
  },
  created () {
    // this.userInfo = JSON.parse(window.localStorage.getItem('user_info'))
    this.userInfo = getUser()
  },
  methods: {
    handleLogout () {
      this.$confirm('确认退出吗?', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // window.localStorage.removeItem('user_info')
        removeUser()
        this.$router.push({ name: 'login' })
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-header {
    height: 60px;
    .el-row {
        height: 60px;
        line-height: 60px;
    }
}
</style>
