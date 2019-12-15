<template>
  <div class="page_shop_index">
    <div
      v-loading="loading"
      class="module base_setting"
    >
      <div class="mod_title">基础信息</div>
      <el-form
        :model="form"
        label-position="right"
        label-width="80px"
      >
        <el-form-item label="店铺名称">
          <el-input v-model="form.shopName" />
        </el-form-item>
        <el-form-item label="店铺地址">
          <el-input v-model="form.province" />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="form.linkPhone" />
        </el-form-item>
        <el-form-item label="店铺描述">
          <el-input v-model="form.shopDesc" />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getShopInfo } from '@/api/shop'

export default {
  data() {
    return {
      loading: true,
      form: {
        shopName: undefined,
        province: undefined,
        city: undefined,
        region: undefined,
        detailAddress: undefined,
        linkPhone: undefined,
        category: undefined,
        shopDesc: undefined
      }
    }
  },
  computed: {
    ...mapGetters([
      'userId'
    ])
  },
  created() {
    getShopInfo(this.userId).then(res => {
      console.log(res)
    }).finally(() => {
      this.loading = false
    })
  }
}
</script>

<style lang="scss" scoped>
  .page_shop_index {
    padding: 50px 40px;
  }
  .module {
    .mod_title {
      margin-bottom: 24px;
      height: 24px;
      line-height: 1;
      border-left: 5px solid #F16263;
      font-size: 24px;
      font-weight: 500;
      color: #F16263;
      text-indent: 12px;
    }
  }
</style>
