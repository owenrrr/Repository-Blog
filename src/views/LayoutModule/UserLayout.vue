<template>
  <a-layout id="components-layout-demo-custom-trigger">
    <a-layout-sider v-model="collapsed" :trigger="null" collapsible>
      <div><p>Logo</p></div>
      <a-menu theme="dark" mode="inline" :default-selected-keys="['1']">
        <a-menu-item key="1" @click='jumptoSet'>
          <a-icon type="user" />
          <span>设置</span>
        </a-menu-item>
        <a-menu-item key="2"  @click="jumptoFol">
          <a-icon type="team"/>
          <span>关注</span>
        </a-menu-item>
        <a-menu-item key="3"  @click="jumptoArt">
          <a-icon type="form"/>
          <span>我的文章</span>
        </a-menu-item>
        <a-menu-item key="4" @click="jumptoLog">
          <a-icon type="logout" />
          <span>登出</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0;">
        <a-button @click="() => (collapsed = !collapsed)" type="primary" style="margin-left: 20px">
          <a-icon
                  class="trigger"
                  :type="collapsed ? 'menu-fold' : 'menu-unfold'"
          />
          <span>{{collapsed ? '展开菜单' : '收缩菜单'}}</span>
        </a-button>

      </a-layout-header>
      <a-layout-content
        :style="{ margin: '24px 16px', padding: '24px', background: 'lightgray', minHeight: '280px' }"
      >
        <router-view/>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
export default {
  data() {
    return {
      collapsed: true,
    };
  },
  methods: {
      jumptoSet(){
          this.$router.push({name: 'Settings'})
      },
      jumptoFol(){
          this.$router.push({name: 'Followers'})
      },
      jumptoArt(){
          this.$router.push({name: 'myArticles'})
      },
      jumptoLog(){
        var msg = "Logout?"
        if(confirm(msg)==true){
          this.$router.push('/')
        }
      }
  },
  mounted() {
    this.$router.push({name: 'Settings'})
  }
};
</script>
<style>
#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 30px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger {
  min-height: 500px;
}
</style>