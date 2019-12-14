<!--
 * @Author: san lang
 * @Date: 2019-11-30 15:19:14
 * @LastEditTime: 2019-12-08 13:16:52
 * @Description:
 -->
<template>
  <div class="dashboard-container">
    <el-row>
      <el-col :span="12">
        <!-- <div class="dashboard-text">name: {{ name }}</div> -->
        <el-form ref="form" :model="storeInfo" label-width="80px" size="mini">
          <el-form-item label="店铺名称">
            <el-input v-model="storeInfo.shopName" />
          </el-form-item>
          <el-form-item label="店铺地址">
            <el-cascader
              v-model="selectedOptions"
              size="large"
              :options="options"
              @change="handleChange"
            />
          </el-form-item>
          <el-form-item label="详细地址">
            <el-input v-model="storeInfo.detailAddress" type="textarea" />
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input v-model="storeInfo.linkPhone" />
          </el-form-item>
          <el-form-item label="店铺描述">
            <el-input v-model="storeInfo.shopDesc" type="textarea" />
          </el-form-item>
          <!-- <el-form-item label="产品图片上传">
            <el-upload action="#" list-type="picture-card" :auto-upload="false">
              <i slot="default" class="el-icon-plus" />
              <div slot="file" slot-scope="{ file }">
                <img class="el-upload-list__item-thumbnail" :src="file.url" alt />
                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-preview"
                    @click="handlePictureCardPreview(file)"
                  >
                    <i class="el-icon-zoom-in" />
                  </span>
                  <span
                    v-if="!disabled"
                    class="el-upload-list__item-delete"
                    @click="handleDownload(file)"
                  >
                    <i class="el-icon-download" />
                  </span>
                  <span
                    v-if="!disabled"
                    class="el-upload-list__item-delete"
                    @click="handleRemove(file)"
                  >
                    <i class="el-icon-delete" />
                  </span>
                </span>
              </div>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <el-img width="100%" :src="dialogImageUrl" alt />
            </el-dialog>
          </el-form-item>-->
          <el-form-item size="large">
            <el-button type="primary" @click="onSubmit">保存</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex';
import { regionDataPlus } from 'element-china-area-data'

export default {
  name: 'Dashboard',

  data() {
    return {
      options: regionDataPlus,
      selectedOptions: [],
      storeInfo: {
        shopName: '',
        detailAddress: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        address: ''
      },
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false
    }
  },
  // computed: {
  //   ...mapGetters(['name'])
  // },\
  methods: {
    onSubmit() {
      console.log('submit!')
    },
    handleChange(value) {
      console.log(this.selectedOptions)
      console.log(value)
    },
    handleRemove(file) {
      console.log(file)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleDownload(file) {
      console.log(file)
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
