// 用户管理界面
<template>
  <div class="users">
    <!-- 面包屑导航 -->
    <div class="users-breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/users' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 卡片列表 -->
    <div class="users-card">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <el-row type="flex" justify="space-between">
            <el-col>
              <span>用户列表</span>
            </el-col>
            <!-- 搜索 -->
            <el-col :span="6">
              <div class="search-box">
                <el-input placeholder="请输入内容" v-model="searchValue">
                  <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
                <el-button type="primary">添加</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="main">
          <!-- 表格 -->
          <div class="table">
            <el-table :data="userTable" style="width: 100%">
              <el-table-column type="index" label="#"></el-table-column>
              <el-table-column prop="username" label="用户名"></el-table-column>
              <el-table-column prop="email" label="邮箱"></el-table-column>
              <el-table-column prop="mobile" label="电话"></el-table-column>
              <el-table-column prop="role_name" label="角色"></el-table-column>
              <el-table-column prop="role_name" label="状态">
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.mg_state"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                  ></el-switch>
                </template>
              </el-table-column>
              <el-table-column prop="role_name" label="操作">
                <template slot-scope="scope">
                  <el-button-group>
                    <el-button type="primary" icon="el-icon-edit"></el-button>
                    <el-button type="primary" icon="el-icon-share"></el-button>
                    <el-button type="primary" icon="el-icon-delete"></el-button>
                  </el-button-group>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- 分页 -->
          <div>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage4"
              :page-sizes="[100, 200, 300, 400]"
              :page-size="100"
              layout="total, sizes, prev, pager, next, jumper"
              :total="400"
            ></el-pagination>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "users",
  data() {
    return {
      searchValue: "", //搜索的值
      userTable: [], //表格数据
      queryInfo: {
        query: "", //查询参数
        pagenum: 1, //当前页码
        pagesize: 2 //每页显示条数
      },
      total: 0 //总条数
    };
  },
  methods: {
    // 获取用户数据
    async getUsers() {
      const { data: result } = await this.$http.get("users", {
        params: this.queryInfo
      });
      if (result.meta.status != 200)
        return this.$message.error(result.meta.msg);
      this.userTable = result.data.users;
      this.total = result.data.total;
    }
  },
  created() {
    // 获取用户数据
    this.getUsers();
  }
};
</script>

<style lang="scss" scoped>
// 卡片列表
.users-card {
  margin-top: 20px;
  // 搜索盒子
  .search-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .el-button {
      margin-left: 5px;
    }
  }
  .table {
    margin-bottom: 20px;
  }
}
</style>