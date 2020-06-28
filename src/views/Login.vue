// 登录页面
<template>
  <div class="login">
    <!-- 登录框 -->
    <div class="login-box">
      <!-- 标题 -->
      <div class="login-title">后台登陆</div>
      <!-- 表单 -->
      <div class="login-form">
        <el-form ref="loginRef" :model="loginFrom" :rules="loginRules">
					<!-- 用户名 -->
          <el-form-item prop="username">
            <el-input v-model="loginFrom.username" placeholder="请输入用户名" prefix-icon="iconfont icon-user"></el-input>
          </el-form-item>
					<!-- 密码 -->
          <el-form-item prop="password">
            <el-input v-model="loginFrom.password" placeholder="请输入密码" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
          </el-form-item>					
        </el-form>
      </div>
			<!-- 按钮 -->
			<div class="login-btn">
				<el-button type="primary" @click="login">登录</el-button>
				<el-button type="info" @click="rest">重置</el-button>
			</div>
    </div>
  </div>
</template>

<script>
export default {
	name: "login",
	data() {
		return {
			// 表单绑定的数据
			loginFrom: {
				username: 'admin', //用户名
				password: '123456' //密码
			},
			// 登录表单验证
			loginRules: {
				username: [ //验证用户名
					{ required: true, message: '请输入用户名', trigger: 'blur' },
					{ min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
				],
				password: [ //验证密码
					{ required: true, message: '请输入密码', trigger: 'blur' },
					{ min: 3, max: 6, message: '长度在 3 到 5 个字符', trigger: 'blur' }
				]
			}
		}
	},
	methods: {
		// 重置按钮
		rest(){
			this.$refs.loginRef.resetFields()
		},
		// 登录按钮
		login() {
			this.$refs.loginRef.validate(async valid => {
				// 判断用户名和密码格式是否正确
				if(!valid) return this.$message.error('请填写正确的用户名或密码')
				// 请求成功,请求接口
				const { data: result } = await this.$http.post('login',this.loginFrom)
				// 判断请求是否成功
				if(result.meta.status != 200) return this.$message.error(result.meta.msg)
				// 将token存入到浏览器缓存中
				window.sessionStorage.setItem('token',result.data.token)
				// 跳转到主页面布局
				 this.$router.push('/layout')
				this.$message.success(result.meta.msg)
			})
		}
	}
};
</script>

<style lang="scss" scoped>
.login {
  height: 100vh;
  background: url("../assets/images/bg-login.jpg") no-repeat center;
  .login-box {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 30%;
    height: 350px;
    background: rgba($color: #000, $alpha: 0.3);
		border-radius: 14px;
		padding: 20px 0;
		// 标题
    .login-title {
      font-size: 30px;
      font-weight: bold;
      color: #fff;
      padding: 10px;
      text-align: center;
    }
		// 表单
		.login-form {
			width: 80%;
			margin: 50px auto;
		}
		// 按钮
		.login-btn {
			width: 80%;
			margin: auto;
			display: flex;
			justify-content: flex-end;
		}
  }
}
</style>