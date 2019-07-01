<template>
  <div>
    <!-- 数据筛选 -->
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <span>数据筛选</span>
        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
      </div>
      <el-form ref="form" :model="filterParams" label-width="80px">
        <el-form-item label="文章状态">
          <el-radio-group v-model="filterParams.status">
            <el-radio label="">全部</el-radio>
            <el-radio
              v-for="(item, index) in statTypes"
              :key="index"
              :label="index"
              >{{ item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道列表">
          <article-channel v-model="filterParams.channel_id"></article-channel>
        </el-form-item>
        <el-form-item label="时间选择">
          <el-date-picker
            value-format="yyyy-MM-DD"
            v-model="range_date"
            @change="handelDateChange"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleFilter" :loading="articleLoading">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 数据筛选 -->

    <!-- 文章列表 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>一共有<strong>{{ totalCount }}</strong>条数据</span>
        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
      </div>
      <el-table
        v-loading="articleLoading"
        class="article-list"
        :data="articles"
        style="width: 100%">
        <el-table-column
          label="图片"
          width="180">
          <template slot-scope="scope">
            <img
              width="20"
              v-for="item in scope.row.cover.images"
              :key="item"
              :src="item" alt="">
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题"
          width="180">
        </el-table-column>
        <el-table-column
          label="状态"
          width="180">
          <template slot-scope="scope">
            <el-tag :type="statTypes[scope.row.status].type">{{ statTypes[scope.row.status].lable }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="pubdate"
          label="发布时间">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-row>
              <el-button
              size="mini"
              type="primary"
              plain
              @click="$router.push(`/publish/${scope.row.id}`)"
              >修改</el-button>
              <el-button size="mini" type="danger" plain @click="handleDelete(scope.row)">删除</el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>

      <!-- 数据分页 -->
      <el-pagination
        background
        :current-page="page"
        layout="prev, pager, next"
        :page-size="pageSize"
        :total="totalCount"
        :disabled="articleLoading"
        @current-change="handleCurrentChange">
      </el-pagination>
      <!-- /数据分页 -->
    </el-card>
    <!-- /文章列表 -->
  </div>
</template>

<script>
import ArticleChannel from '@/components/article-channel'
export default {
  name: 'ArticleList',
  components: {
    ArticleChannel
  },
  data () {
    return {
      articles: [],
      statTypes: [
        {
          type: 'info',
          label: '草稿'
        },
        {
          type: '',
          label: '待审核'
        },
        {
          type: 'success',
          label: '审核通过'
        },
        {
          type: 'warning',
          label: '审核失败'
        },
        {
          type: 'danger',
          label: '已删除'
        }
      ],
      pageSize: 10, // 每页大小
      totalCount: 0, // 总数据量
      page: 1, // 当前页码
      articleLoading: false, // 加载中
      filterParams: {
        status: '', // 文章状态发
        channel_id: '', // 频道id
        begin_pubdate: '', // 开始时间
        end_pubdate: '' // 结束时间
      },
      range_date: '', // 时间范围绑定值
      pickerOptions: { }
    }
  },
  created () {
    this.loadArticles()
  },
  methods: {
    async handleDelete (item) {
      try {
        // 删除确认提示
        await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        // 如果手动 catch 了它的异常，还是会被外部的 try-catch 捕获到
        // 但是代码依然可以继续往后执行
        // .catch(() => {
        //   this.$message({
        //     type: 'info',
        //     message: '已取消删除'
        //   })
        // })
        // 确认：执行删除操作
        console.log(item.id)
        await this.$http({
          method: 'DELETE',
          url: `/articles/${item.id}`
        })
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        // 删除成功重新加载数据列表
        this.loadArticles()
      } catch (err) {
        if (err === 'cancel') {
          return this.$message({
            type: 'info',
            message: '已取消删除'
          })
        }
        this.$message.error('删除失败')
      }
    },
    handelDateChange (value) {
      // console.log(value)
      this.filterParams.begin_pubdate = value[0]
      this.filterParams.end_pubdate = value[1]
    },
    handleFilter () {
      this.page = 1
      this.loadArticles()
    },
    async loadArticles () {
      this.articleLoading = true
      const filterData = {}
      for (let key in this.filterParams) {
        const item = this.filterParams[key]
        if (item !== null && item !== undefined && item !== '') {
          filterData[key] = item
        }
      }
      const data = await this.$http({
        method: 'GET',
        url: '/articles',
        params: {
          page: this.page,
          per_page: this.pageSize,
          ...filterData
        }
      })
      this.articles = data.results
      this.totalCount = data.total_count
      // console.log(data)
      this.articleLoading = false
    },
    handleCurrentChange (page) {
      this.page = page
      this.loadArticles()
    }
  }
}
</script>

<style lang="less" scoped>
.filter-card {
  margin-bottom: 15px;
}
.article-list {
  margin-bottom: 30px;
}
</style>
