<template>
  <div class="page_shop_index">
    <div
      v-loading="loading"
      class="module base_setting"
    >
      <div class="mod_title">基础信息</div>
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-position="left"
        label-width="133px"
      >
        <div v-if="form.shopId">
          <el-form-item label="店铺ID:" class="form_item_shopName">
            <el-input v-model="form.shopId" disabled />
          </el-form-item>
        </div>
        <el-form-item label="店铺名称:" class="form_item_shopName">
          <el-input v-model="form.shopName" />
        </el-form-item>
        <el-form-item label="店铺LOGO:" class="form_item_goodsImg">
          <el-upload
            class="avatar-uploader"
            list-type="picture-card"
            :limit="1"
            :action="uploadUrl"
            :on-preview="handlePictureCardPreview"
            :before-upload="beforeAvatarUpload"
            :on-success="handleAvatarSuccess"
            :multiple="false"
            :show-file-list="false"
          >
            <img v-if="form.shopLogo" :src="form.shopLogo" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="店铺地址:" class="form_item_shopAddress">
          <city-picker
            :dprovince="form.province"
            :dcity="form.city"
            :dregion="form.region"
            :ddetail-address="form.detailAddress"
            :show-detail="true"
            @onChange="handleCityChange"
          />
        </el-form-item>
        <el-form-item
          prop="linkPhone"
          label="联系电话:"
          class="form_item_linkPhone"
        >
          <el-input v-model="form.linkPhone" />
        </el-form-item>
        <el-form-item label="店铺分类:" class="form_item_category">
          <el-select v-model="form.category">
            <el-option
              v-for="item in categorySet"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="店铺描述:" class="form_item_shopDesc">
          <el-input v-model="form.shopDesc" :rows="6" type="textarea" />
        </el-form-item>
        <el-form-item class="form_item_save">
          <el-button type="primary" @click="save">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getShopInfo, getShopCategory, dealShopInfo } from '@/api/shop'
import CityPicker from '@/components/CityPicker'
import { UPLOAD_URL } from '@/settings'

export default {
  components: {
    CityPicker
  },
  data() {
    return {
      uploadUrl: UPLOAD_URL,
      loading: true,
      categorySet: [],
      d_goodsImg: [],
      form: {
        shopName: undefined,
        province: undefined,
        city: undefined,
        region: undefined,
        detailAddress: undefined,
        linkPhone: undefined,
        category: undefined,
        shopDesc: undefined,
        shopId: undefined,
        shopLogo: ''
      },
      rules: {
        linkPhone: [
          { validator: this.validatePhone, trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'userId'
    ])
  },
  async created() {
    try {
      const shopInfo = await getShopInfo(this.userId).then(res => res.obj)
      if (shopInfo) {
        Object.keys(this.form).forEach(key => {
          this.form[key] = shopInfo[key]
        })
      }
    } catch (error) {
      console.warn(error)
    }

    try {
      const categorySet = await getShopCategory({}).then(res => res.obj)
      if (categorySet) {
        this.categorySet = categorySet.map(item => {
          return {
            label: item.category,
            value: item.id + ''
          }
        })
      }
    } catch (error) {
      console.warn(error)
    }
    this.loading = false
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.form.shopLogo = res.obj
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleRemove(key) {
      return (file, fileList) => {
        this.generateImages(key, fileList)
      }
    },
    beforeAvatarUpload(file) {
      const allowTypeList = ['image/jpeg', 'image/jpg', 'image/png']
      const isAllowType = allowTypeList.includes(file.type)
      if (!isAllowType) {
        this.$message.error('上传图片只能是 JPG/PNG/JPEG 格式!')
      }
      return isAllowType
    },
    handleCityChange(params) {
      console.log(params)
      this.form.province = params.province
      this.form.city = params.city
      this.form.region = params.region
      this.form.detailAddress = params.detailAddress
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = {
            ...this.form
          }
          params.userId = this.userId
          this.loading = true
          dealShopInfo(params)
            .then(res => {
              this.$message.success('保存成功')
              this.$router.go(0)
            })
            .catch(error => {
              console.warn(error)
            })
            .finally(() => {
              this.loading = false
            })
        }
      })
    },
    validatePhone(rule, value, callback) {
      if (!value) {
        callback('请输入联系电话')
      } else if (!/^1\d{10}/.test(value)) {
        callback('请输入正确手机号')
      } else {
        callback()
      }
    }
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

<style lang="scss">
  .form_item_shopName,
  .form_item_linkPhone,
  .form_item_shopDesc {
    .el-form-item__content {
      width: 296px;
    }
  }
  .form_item_shopAddress {
    .el-form-item__content {
      > div {
        > .el-select {
          width: 120px;
          margin-right: 6px;
          margin-bottom: 12px;
        }
        > .el-input {
          width: 296px;
        }
      }
    }
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
.el-upload--picture-card {
    background-color: #fbfdff;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 176px;
    height: 176px;
    cursor: pointer;
    line-height: 176px;
    vertical-align: top;
}
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
