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
    <div class="users-card card">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <el-row type="flex" justify="space-between">
            <el-col>
              <span>用户列表</span>
            </el-col>
            <!-- 搜索 -->
            <el-col :span="8">
              <div class="search-box">
                <el-input
                  placeholder="请输入内容"
                  v-model="queryInfo.query"
                  @keyup.enter="search"
                  clearable
                  @clear="getUsers"
                >
                  <template slot="append">
                    <i class="el-icon-search" @click="getUsers"></i>
                  </template>
                </el-input>
                <el-button type="primary" @click="addUserDialog = true">添加用户</el-button>
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
                    <el-button type="primary" icon="el-icon-edit" @click="edit(scope.row)"></el-button>
                    <el-button type="danger" icon="el-icon-delete" @click="delUser(scope.row)"></el-button>
                    <el-button type="warning" icon="el-icon-setting"></el-button>
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
              :current-page="queryInfo.pagenum"
              :page-sizes="[1, 3, 5, 7]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            ></el-pagination>
          </div>
        </div>
      </el-card>
    </div>
    <!-- 添加用户对话框 -->
    <div class="dialog">
      <el-dialog title="添加用户" :visible.sync="addUserDialog" width="30%" :before-close="addUserCancel">
        <!-- 内容主题区域 -->
        <div class="dialog-form">
          <el-form ref="addUserRef" :model="addUserForm" label-width="80px" :rules="addUserRules">
            <!-- 用户名称 -->
            <el-form-item label="用户名称" prop="username">
              <el-input v-model="addUserForm.username"></el-input>
            </el-form-item>
            <!-- 用户密码 -->
            <el-form-item label="用户密码" prop="password">
              <el-input v-model="addUserForm.password"></el-input>
            </el-form-item>
            <!-- 邮箱 -->
            <el-form-item label="用户邮箱" prop="email">
              <el-input v-model="addUserForm.email"></el-input>
            </el-form-item>
            <!-- 手机 -->
            <el-form-item label="用户手机" prop="mobile">
              <el-input v-model="addUserForm.mobile"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <!-- 底部按钮 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addUserCancel">取 消</el-button>
          <el-button type="primary" @click="addUserBtn">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 编辑用户对话框 -->
    <div class="dialog">
      <el-dialog title="编辑" :visible.sync="editDialog" width="30%" :before-close="editCancel">
        <!-- 内容主题区域 -->
        <div class="dialog-form">
          <el-form ref="editRef" :model="editForm" label-width="80px" :rules="editRules">
            <!-- 用户名称 -->
            <el-form-item label="用户名称" prop="username">
              <el-input v-model="editForm.username" disabled></el-input>
            </el-form-item>
            <!-- 邮箱 -->
            <el-form-item label="用户邮箱" prop="email">
              <el-input v-model="editForm.email"></el-input>
            </el-form-item>
            <!-- 手机 -->
            <el-form-item label="用户手机" prop="mobile">
              <el-input v-model="editForm.mobile"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <!-- 底部按钮 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editCancel">取 消</el-button>
          <el-button type="primary" @click="editBtn">确 定</el-button>
        </span>
      </el-dialog>
    </div>    
  </div>
</template>

<script>
export default {
  name: "users",
  data() {
    // 自定义校验手机号
    var validateMobile = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入手机号"));
      } else if (!/^1[3456789]\d{9}$/.test(value)) {
        return callback(new Error("手机号格式错误"));
      } else {
        callback();
      }
    };
    return {
      userTable: [], //表格数据
      queryInfo: {
        query: "", //查询参数
        pagenum: 1, //当前页码
        pagesize: 1 //每页显示条数
      },
      total: 0, //总条数
      addUserDialog: false, //添加用户对话框
      editDialog: false, //编辑对话框
      editForm: {
        username: '',
        email: '', //邮箱
        mobile: '' //手机号
      },
      addUserForm: {
        username: "", //用户名称
        password: "", //用户密码
        email: "", //邮箱
        mobile: "" //手机号
      },
      // 添加用户校验规则
      addUserRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 6, message: "长度在 3 到 6 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        mobile: [{ required: true, validator: validateMobile, trigger: "blur" }]
      },
      // 编辑用户校验规则
      editRules: {
                email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        mobile: [{ required: true, validator: validateMobile, trigger: "blur" }]
      },
      // 用户id
      userId: ''
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
    },
    // 分页按钮
    handleSizeChange(e) {
      this.queryInfo.pagesize = e;
      this.getUsers();
    },
    // 选择每页显示多少条
    handleCurrentChange(e) {
      this.queryInfo.pagenum = e;
      this.getUsers();
    },
    // 提交添加用户按钮
    addUserBtn() {
      // 验证表单
      this.$refs.addUserRef.validate(async vaild => {
        if (!vaild) return this.$message.error("表单格式存在错误");
        const { data: result } = await this.$http.post(
          "users",
          this.addUserForm
        );
        if (result.meta.status != 201)
          return this.$message.error(result.meta.msg);
        this.$message.success(result.meta.msg);
        // 创建成功后,重置表单关闭对话框
        this.resetClose("addUserRef",'addUserDialog');
      });
    },
    // 关闭前的回调，会暂停 Dialog 的关闭
    handleClose() {
      this.resetClose("addUserRef",'addUserDialog');
    },
    // 添加用户取消按钮
    addUserCancel() {
      this.resetClose("addUserRef",'addUserDialog');
    },
    // 重置关闭对话框
    resetClose(name,dialogName) {
      this.$refs[name].resetFields();
      this[dialogName] = false;
    },
    // 删除用户
    async delUser(userInfo) {
      let res = await this.$confirm("此操作将删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).catch(err => err)
      if(res == 'cacel') return this.$message.info('取消删除成功')
      const { data: result } = await this.$http.delete(`users/${userInfo.id}`)
      if(result.meta.status !== 200) return this.$message.error(result.meta.msg)
      this.$message.success(result.meta.msg)
      this.getUsers()
    },
    // 编辑
    async edit(userInfo) {
      this.userId = userInfo.id
      const { data: result } = await this.$http.get(`users/${userInfo.id}`)
      if(result.meta.status != 200) return this.$message.error(result.meta.msg)
      this.editForm.username = result.data.username
      this.editForm.email = result.data.email
      this.editForm.mobile = result.data.mobile
      this.editDialog = true
    },
    // 编辑提交按钮
    editBtn() {
      // 需要编辑的用户id
      let userId = this.userId
      // 验证表单
      this.$refs.editRef.validate(async valid => {
        if(!valid) return this.$message.error('表单内容格式有错')
        const { data: result } = await this.$http.put(`users/${userId}`,{ email: this.editForm.email,mobile: this.editForm.mobile })
        if(result.meta.status != 200) this.$message.error(result.meta.msg)
        this.$message.success(result.meta.msg)
        this.resetClose('editRef','editDialog')
        this.getUsers()
      })
    },
    // 取消编辑
    editCancel() {
      this.resetClose('editRef','editDialog')
    }
  },
  created() {
    // 获取用户数据
    this.getUsers();
  }
};
</script>

<style lang="scss" scoped>
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

</style>