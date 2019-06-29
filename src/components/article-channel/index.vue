<template>
  <el-select :value="value" clearable @change="handelChange">
    <el-option
    v-for="item in channels"
    :key="item.id"
    :label="item.name"
    :value="item.id"
    ></el-option>
  </el-select>
</template>
<script>
export default {
  name: 'ArticleChannel',
  props: {
    value: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      channels: []
    }
  },
  created () {
    this.loadChannels()
  },
  methods: {
    async loadChannels () {
      try {
        const data = await this.$http({
          method: 'GET',
          url: '/channels'
        })
        // console.log(data)
        this.channels = data.channels
      } catch (err) {
        console.log(err)
        this.$message.error('获取频道数据失败')
      }
    },
    handelChange (val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
