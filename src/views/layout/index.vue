// 主页布局
<template>
  <div class="layout">
    <el-container>
      <el-aside width="200px">
        <!-- 头像 -->
        <div class="avatar-box">
          <img class="avatar" src="@/assets/images/avatar.png" />
        </div>
        <!-- 用户名 -->
        <div class="username">{{ name }}</div>
        <!-- 导航 -->
        <div class="nav-menu">
          <el-menu
            :default-active="defaultUrl"
            class="el-menu-vertical-demo"
            background-color="#313f58"
            text-color="#fff"
            active-text-color="#ffd04b"
            :unique-opened="true"
            :router="true"
          >
            <el-submenu :index="item.id + ''" v-for="item in asideMenu" :key="item.id">
              <!-- 一级菜单 -->
              <template slot="title">
                <i :class="icon[item.id]"></i>
                <span>{{ item.authName }}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="jump('/'+subItem.path)"> 
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>{{ subItem.authName }}</span>
                </template>
              </el-menu-item>
            </el-submenu>
            <!-- 退出 -->
            <el-menu-item index="0" @click="quit">
              <i class="iconfont icon-baobiao"></i>
              <span slot="title">返回登录</span>
            </el-menu-item>
          </el-menu>
        </div>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "layout",
  data() {
    return {
      name: "", //用户名
      defaultUrl: '', //默认地址
      asideMenu: [], //左侧菜单
      icon: {
        125: "iconfont icon-user",
        103: "iconfont icon-tijikongjian",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-danju",
        145: "iconfont icon-baobiao"
      }
    };
  },
  created() {
    // 通过缓存拿到用户名
    this.name = window.sessionStorage.getItem("username");
    // 通过缓存拿去默认地址
    this.defaultUrl = window.sessionStorage.getItem("defaultUrl")
    // 获取左侧导航数据
    this.getAside();
  },
  methods: {
    // 子菜单跳转
    jump(url) {
      // 将跳转路径保存到本地缓存中
      window.sessionStorage.setItem('defaultUrl',url)
    },
    // 退出按钮
    quit() {
      window.sessionStorage.removeItem("token");
      window.sessionStorage.removeItem("username");
      this.$router.push("/login");
    },
    // 获取左侧导航数据
    async getAside() {
      const { data: result } = await this.$http.get("menus");
      if (result.meta.status != 200)
        return this.$message.error(result.meta.msg);
      this.asideMenu = result.data;
    }
  }
};
</script>

<style lang="scss" scoped>
.layout {
  height: 100vh;
}
.el-container {
  height: 100%;
  // 左侧菜单
  .el-aside {
    height: 100%;
    background-color: #313f58;
    // 头像盒子
    .avatar-box {
      width: 50%;
      height: 100px;
      border-radius: 50%;
      margin: 50px auto 10px;
      background-color: #ffffff;
      overflow: hidden;
      // 图片
      .avatar {
        width: 100%;
      }
    }
    // 用户名
    .username {
      color: #fff;
      font-size: 30px;
      font-weight: bold;
      text-align: center;
    }
    .nav-menu {
      margin-top: 20px;
      .el-menu {
        border-right: none;
        .iconfont {
          margin-right: 15px;
        }
      }
    }
  }
  // 主体
  .el-main {
    height: 100%;
    background-color: #EBEEF5;
  }
}
</style>