<!--
 * @Author: san lang
 * @Date: 2019-11-21 15:08:06
 * @LastEditTime: 2019-11-23 00:11:00
 * @Description:
 -->
<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <svg
          v-if="logo"
          class="sidebar-logo"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          width="154"
          height="200"
          viewBox="0 0 154 200"
        >
          <image
            id="LOGO"
            x="28"
            y="53"
            width="82"
            height="95"
            xlink:href="data:img/png;base64,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"
          />
        </svg>

        <!-- <img v-if="logo" :src="logo" class="sidebar-logo" /> -->
        <h1 v-else class="sidebar-title">{{ title }}</h1>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <!-- <img v-if="logo" :src="logo" class="sidebar-logo" > -->
        <svg
          v-if="logo"
          class="sidebar-logo"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          width="154"
          height="200"
          viewBox="0 0 154 200"
        >
          <image
            id="LOGO"
            x="28"
            y="53"
            width="100"
            height="100"
            xlink:href="data:img/png;base64,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"
          />
        </svg>
        <h1 class="sidebar-title">{{ title }}</h1>
      </router-link>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: '商城后台管理系统',
      logo:
        'https://wpimg.wallstcn.com/69a1c46c-eb1c-4b46-8bd4-e9e686ef5251.png'
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #2b2f3a;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
