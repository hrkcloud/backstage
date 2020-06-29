// 权限列表页面
<template>
  <div class="rights">
    <!-- 面包屑导航 -->
    <div>
      <div class="rights-breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/rights' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>权限管理</el-breadcrumb-item>
          <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <!-- 卡片列表 -->
    <div class="rights-card card">
      <el-card class="box-card">
        <el-table :data="rightsTable" style="width: 100%">
          <el-table-column type="index" label="#" width="150"></el-table-column>
          <el-table-column prop="authName" label="权限名称"></el-table-column>
          <el-table-column prop="path" label="路径"></el-table-column>
          <el-table-column label="权限等级">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.level == 0">一级</el-tag>
              <el-tag type="success" v-else-if="scope.row.level == 1">二级</el-tag>
              <el-tag type="warning" v-else-if="scope.row.level == 2">三级</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "rights",
  data() {
    return {
      rightsTable: [], //所有权限列表
    }
  },
  created() {
    // 获取权限列表数据
    this.getRights()
  },
  methods: {
    // 获取权限列表数据
    async getRights() {
      const { data: result } = await this.$http.get('rights/list')
      if(result.meta.status != 200) return this.$message.error(result.meta.msg)
      this.rightsTable = result.data
    }
  }
};
</script>

<style lang="scss" scoped>
</style>