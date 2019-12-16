<template>
  <div class="page_product_add">
    <div
      v-loading="loading"
      :class="`module add_product ${editClass}`"
    >
      <div class="mod_title">{{ pageTitle }}</div>
      <el-form
        ref="form"
        :model="form"
        label-position="left"
        label-width="133px"
      >
        <div class="form_content">
          <div class="left">
            <el-form-item
              :rules="generateRequireRules('请输入商品名称')"
              prop="goodsName"
              label="商品名称:"
              class="form_item_goodsName"
            >
              <el-input v-model="form.goodsName" />
            </el-form-item>
            <el-form-item
              :rules="generateRequireRules('请输入售价')"
              prop="price"
              label="售价:"
              class="form_item_price"
            >
              <el-input v-model="form.price" />
            </el-form-item>
            <el-form-item label="折扣:" class="form_item_discountPrice">
              <el-input v-model="form.discountPrice" />
            </el-form-item>
            <el-form-item label="库存:" class="form_item_stock">
              <el-input v-model="form.stock" />
            </el-form-item>
            <el-form-item
              :rules="generateRequireRules('请输入运费')"
              prop="fare"
              label="运费:"
              class="form_item_fare"
            >
              <el-input v-model="form.fare" />
            </el-form-item>
            <el-form-item label="商品图片:" class="form_item_goodsImg">
              <el-upload
                class="upload_wrap big"
                list-type="picture-card"
                :limit="5"
                :action="uploadUrl"
                :file-list="d_goodsImg"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove('goodsImg')"
                :before-upload="beforeAvatarUpload"
                :on-success="handleUploadSuccess('goodsImg')"
                :on-error="handleUploadError"
              >
                <i class="el-icon-plus" />
              </el-upload>
              <div class="tips">注：尺寸800*800，大小不限制，格式JPG、PNG、JPEG，图片最多可上传5张。</div>
            </el-form-item>
            <el-form-item label="是否设置为推荐:" class="form_item_recommend">
              <el-select v-model="form.recommend">
                <el-option
                  v-for="item in recommendSet"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="商品详情:" class="form_item_detailImg">
              <el-upload
                class="upload_wrap big"
                list-type="picture-card"
                :limit="5"
                :action="uploadUrl"
                :file-list="d_detailImg"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove('detailImg')"
                :before-upload="beforeAvatarUpload"
                :on-success="handleUploadSuccess('detailImg')"
                :on-error="handleUploadError"
              >
                <i class="el-icon-plus" />
              </el-upload>
              <div class="tips">注：尺寸800*800，大小不限制，格式JPG、PNG、JPEG，图片最多可上传5张。</div>
            </el-form-item>
          </div>
          <div class="right">
            <el-form-item label="规格:" class="form_item_standardList">
              <div class="input_wrap">
                <template v-for="(standardItem, idx) in form.standardList">
                  <el-input
                    :key="idx"
                    v-model="standardItem.name"
                    :placeholder="getPlaceholder(standardPlaceholderList, idx)"
                  />
                </template>
                <div class="tips">(例如：尺码、颜色、重量)</div>
              </div>
              <div class="add_wrap">
                <el-button type="primary" @click="addInputItem('standardList')">添加</el-button>
              </div>
            </el-form-item>
            <el-form-item label="类型:" class="form_item_standardList">
              <div class="input_wrap">
                <template v-for="(typeItem, idx) in form.typeList">
                  <el-input
                    :key="idx"
                    v-model="typeItem.name"
                    :placeholder="getPlaceholder(typeListPlaceholderList, idx)"
                  />
                </template>
                <div class="tips">(例如：尺码标准、色号)</div>
              </div>
              <div class="add_wrap">
                <el-button type="primary" @click="addInputItem('typeList')">添加</el-button>
              </div>
            </el-form-item>
          </div>
        </div>
        <el-form-item class="form_item_save">
          <el-button type="primary" @click="save">{{ saveButtonText }}</el-button>
        </el-form-item>
      </el-form>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { addGood, getGood, updateGood } from '@/api/product'
import { UPLOAD_URL } from '@/settings'

export default {
  name: 'ProductAdd',
  props: {
    id: {
      type: [String, Number],
      default: undefined
    }
  },
  data() {
    return {
      loading: false,
      uploadUrl: UPLOAD_URL,
      recommendSet: [{
        label: '是',
        value: 1
      }, {
        label: '否',
        value: 0
      }],
      d_detailImg: [],
      d_goodsImg: [],
      form: {
        goodsName: undefined,
        price: undefined,
        discountPrice: undefined,
        stock: undefined,
        fare: undefined,
        detailImg: [],
        goodsImg: [],
        standardList: [
          { name: '' },
          { name: '' },
          { name: '' }
        ],
        typeList: [
          { name: '' },
          { name: '' },
          { name: '' }
        ],
        labelList: [
          { name: '' },
          { name: '' },
          { name: '' }
        ],
        shop_id: this.$store.state.user.user_info.id,
        recommend: 0
      },
      dialogImageUrl: '',
      dialogVisible: false,
      standardPlaceholderList: [
        '(例：41码)',
        '(例：黑色背心)',
        '(例：水果2斤)'
      ],
      typeListPlaceholderList: [
        '(例：黑色)',
        '(例：XXL)',
        '(例: 无)'
      ]
    }
  },
  computed: {
    isEditMode() {
      return this.id || this.id === 0
    },
    editClass() {
      return this.isEditMode ? 'edit_mode' : ''
    },
    pageTitle() {
      return this.isEditMode ? '修改商品' : '添加商品'
    },
    saveButtonText() {
      return this.isEditMode ? '保存' : '添加'
    }
  },
  created() {
    if (this.id) {
      this.loading = true
      getGood(this.id)
        .then(res => {
          const good = res.obj
          this.form.goodsName = good.goodsName
          this.form.price = good.price + ''
          this.form.discountPrice = good.discountPrice + ''
          this.form.stock = good.stock + ''
          this.form.fare = good.fare + ''
          this.form.recommend = good.recommend

          this.form.detailImg = this.getImgList(good.detailImg)
          this.form.goodsImg = this.getImgList(good.goodsImg)
          this.d_detailImg = this.form.detailImg.map(item => {
            return {
              name: '',
              url: item
            }
          })
          this.d_goodsImg = this.form.goodsImg.map(item => {
            return {
              name: '',
              url: item
            }
          })
          if (good.standardList.length > 0) {
            this.form.standardList = good.standardList
          }
          if (good.typeList.length > 0) {
            this.form.typeList = good.typeList
          }
          if (good.labelList.labelList > 0) {
            this.form.labelList = good.labelList
          }
        })
        .catch(error => {
          console.warn(error)
        })
        .finally(() => {
          this.loading = false
        })
    }
  },
  methods: {
    handleUploadSuccess(key) {
      return (response, file, fileList) => {
        if (response.result === 0) {
          this.generateImages(key, fileList)
        }
      }
    },
    handleRemove(key) {
      return (file, fileList) => {
        this.generateImages(key, fileList)
      }
    },
    handleUploadError() {
      this.$message.error('上传图片失败！')
    },
    generateImages(key, fileList) {
      this.form[key] = fileList
        .filter(item => {
          return (
            (item.response && item.response.result === 0) ||
            (!item.response && item.url && !item.url.startsWith('bolb'))
          )
        })
        .map(item => (item.response ? item.response.obj : item.url))
      this.$refs['form'].validateField(key)
    },
    generateRequireRules(msg, type = 'string') {
      return [{
        require: true, message: msg, type: type, trigger: 'blur'
      }]
    },
    beforeAvatarUpload(file) {
      const allowTypeList = ['image/jpeg', 'image/jpg', 'image/png']
      const isAllowType = allowTypeList.includes(file.type)
      if (!isAllowType) {
        this.$message.error('上传图片只能是 JPG/PNG/JPEG 格式!')
      }
      return isAllowType
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleCityChange(province, city, region, detailAddress) {
      this.form.province = province
      this.form.city = city
      this.form.region = region
      this.form.detailAddress = detailAddress
    },
    addInputItem(key) {
      this.form[key].push('')
    },
    getPlaceholder(list, idx) {
      return list[idx] ? list[idx] : '(例：无)'
    },
    getImgList(imgStr) {
      if (imgStr.startsWith('[')) {
        return JSON.parse(imgStr)
      } else {
        return [].concat(imgStr)
      }
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.isEditMode) {
            const params = {
              id: this.id,
              goodsName: this.form.goodsName,
              price: this.form.price,
              discountPrice: this.form.discountPrice,
              stock: this.form.stock,
              fare: this.form.fare,
              detailImg: JSON.stringify(this.form.detailImg),
              goodsImg: JSON.stringify(this.form.goodsImg),
              standardList: JSON.stringify(this.form.standardList.map(item => item.name).filter(item => item)),
              typeList: JSON.stringify(this.form.typeList.map(item => item.name).filter(item => item)),
              labelList: JSON.stringify(this.form.labelList.map(item => item.name).filter(item => item)),
              recommend: this.form.recommend
            }
            this.loading = true
            updateGood(params)
              .then(res => {
                this.$message.success('修改成功')
                this.$router.go(0)
              })
              .catch(error => {
                console.warn(error)
              })
              .finally(() => {
                this.loading = false
              })
          } else {
            const params = {
              goodsName: this.form.goodsName,
              price: this.form.price,
              discountPrice: this.form.discountPrice,
              stock: this.form.stock,
              fare: this.form.fare,
              detailImg: JSON.stringify(this.form.detailImg),
              goodsImg: JSON.stringify(this.form.goodsImg),
              standardList: JSON.stringify(this.form.standardList.map(item => item.name).filter(item => item)),
              typeList: JSON.stringify(this.form.typeList.map(item => item.name).filter(item => item)),
              recommend: this.form.recommend,
              shop_id: this.form.shop_id
            }
            this.loading = true
            addGood(params)
              .then(res => {
                this.$message.success('添加成功')
                this.$router.push('/product/list')
              })
              .catch(error => {
                console.warn(error)
              })
              .finally(() => {
                this.loading = false
              })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .page_product_add {
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
  .module.add_product {
    .el-form {
      > .form_content {
        display: flex;
        > .left {
          width: 568px;
          flex-shrink: 0
        }
        > .right {
          padding-top: 116px;
          padding-left: 12px;
          width: 446px;
        }
      }
    }
    &.edit_mode {
      .el-form {
      > .form_content {
        display: block;
        > .right {
          padding-top: 0;
          padding-left: 0;
        }
      }
    }
    }
  }

  .form_item_goodsName,
  .form_item_price {
    .el-form-item__content {
      width: 280px;
    }
  }
  .form_item_discountPrice,
  .form_item_stock,
  .form_item_fare {
    .el-form-item__content {
      width: 120px;
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
  .form_item_detailImg,
  .form_item_goodsImg {
    .el-upload {
      width: 120px;
      height: 120px;
      line-height: 118px;
    }
    .el-upload-list {
      li {
        width: 120px;
        height: 120px;
      }
    }
    .tips {
      font-size: 12px;
      color: #999;
    }
  }

  .form_item_standardList {
    display: flex;
    .el-form-item__content {
      display: flex;
      margin-left: 0px!important;
      .input_wrap {
        width: 180px;
        margin-right: 12px;
        .el-input {
          margin-bottom: 12px;
        }
      }
    }
    .tips {
      font-size: 12px;
      color: #999;
    }
  }

  .form_item_save {
    margin-top: 48px;
  }
</style>
