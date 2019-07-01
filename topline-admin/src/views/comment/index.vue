<template>
  <el-card class="box-card">
    <div slot="header">
      <span>评论管理</span>
    </div>
    <el-table :data="articles">
      <el-table-column label="标题" prop="title"></el-table-column>
      <el-table-column label="总评论数" prop="total_comment_count"></el-table-column>
      <el-table-column label="粉丝评价数" prop="fans_comment_count"></el-table-column>
      <el-table-column label="允许评论">
        <template slot-scope="scope">
          <el-switch
            :disabled="scope.row.disabled"
            v-model="scope.row.comment_status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="handleChangeStatus(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      articles: [],
      disabled: false
    }
  },
  created () {
    this.loadArticles()
  },
  methods: {
    async loadArticles () {
      try {
        const data = await this.$http({
          method: 'GET',
          url: '/articles'
        })
        console.log(data)
        data.results.forEach(item => {
          item.disabled = false
        })
        this.articles = data.results
        // this.articles = data
      } catch (err) {
        this.$message.error('加载文章列表失败')
      }
    },
    async handleChangeStatus (item) {
      item.disabled = true
      try {
        await this.$http({
          method: 'PUT',
          url: '/comments/status',
          params: {
            article_id: item.id.toString()
          },
          data: {
            allow_comment: item.comment_status
          }
        })
        this.$message({
          type: 'success',
          message: `${item.comment_status ? '启用' : '禁用'}评论状态成功`
        })
      } catch (err) {
        console.log(err)
        this.$message.error('修改评论状态失败')
        item.comment_status = !item.comment_status
      }
      item.disabled = false
    }
  }
}
</script>

<style>

</style>
