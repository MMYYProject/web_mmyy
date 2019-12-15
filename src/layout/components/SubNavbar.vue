<template>
  <div class="sub_navbar">
    <div class="position_info_wrap">
      您的位置： {{ pageName }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'SubNavbar',
  computed: {
    pageName() {
      return this.$route.name
    }
  }
}
</script>

<style style="scss" scoped>
  .sub_navbar {
    height: 67px;
    display: flex;
    align-items: center;
    padding-left: 48px;
    background: #eee;
    font-size: 18px;
    color: #666;
  }
</style>
