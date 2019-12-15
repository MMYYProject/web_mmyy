<template>
  <div class="page_product_add">
    <div
      v-loading="loading"
      class="module add_product"
    >
      <div class="page_title">
        <div class="mod_title">商品列表</div>
        <el-input
          v-model="searchText"
          class="search_input"
          placeholder="输入商品ID/关键字"
          suffix-icon="el-icon-search"
          @change="fetchData"
        />
      </div>
      <div class="page_content">
        <el-table
          :data="list"
          border
          style="width: 100%"
        >
          <el-table-column prop="id" label="商品ID" align="center" />
          <el-table-column prop="goodsImg" label="图片" align="center">
            <template slot-scope="scope">
              <img
                :src="getGoodImg(scope.row.goodsImg)"
                class="product_img"
                alt=""
                @click="handlePictureCardPreview(getGoodImg(scope.row.goodsImg))"
              >
            </template>
          </el-table-column>
          <el-table-column prop="goodsName" label="名称" align="center" />
          <el-table-column prop="createTime" label="添加时间" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.createTime | getCreateTime }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="价格（元）" align="center" />
          <el-table-column prop="fare" label="库存" align="center" />
          <el-table-column prop="recommend" label="是否首页展示" align="center">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.recommend"
                class="recommend_select"
                @change="updateRecommend(scope)"
              >
                <el-option
                  v-for="item in recommendSet"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="183px" align="center">
            <template slot-scope="scope">
              <el-button size="small" @click="handleEdit(scope.row.id)">编辑</el-button>
              <el-popconfirm
                title="确定删除吗？"
                @onConfirm="handleDel(scope.row.id)"
              >
                <el-button slot="reference" size="small">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        layout="prev, pager, next, jumper"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        :total="total"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt>
    </el-dialog>
    <el-dialog
      v-if="editDialogVisible"
      :visible.sync="editDialogVisible"
      width="720"
    >
      <div class="edit_good_wrap">
        <product-add :id="editGoodId" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getProductList, updateGood, delGood } from '@/api/product'
import ProductAdd from './add'

export default {
  components: {
    ProductAdd
  },
  filters: {
    getCreateTime(createTime) {
      return createTime.substring(0, 10)
    }
  },
  data() {
    return {
      loading: true,
      searchText: undefined,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      list: [],
      recommendSet: [{
        label: '是',
        value: 1
      }, {
        label: '否',
        value: 0
      }],
      dialogImageUrl: undefined,
      dialogVisible: false,
      editDialogVisible: false,
      editGoodId: undefined
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    getGoodImg(goodsImg) {
      if (goodsImg) {
        if (goodsImg.startsWith('[')) {
          return JSON.parse(goodsImg)[0]
        } else {
          return goodsImg
        }
      } else {
        return ''
      }
    },
    fetchData() {
      this.loading = true
      getProductList(this.searchText, this.currentPage - 1, this.pageSize)
        .then(res => {
          this.list = res.obj.data || [res.obj] || []
          this.total = Array.isArray(res.obj.data) ? res.obj.total : 1
        })
        .catch(error => {
          console.warn(error)
        })
        .finally(() => {
          this.loading = false
        })
    },
    updateRecommend(scope) {
      this.loading = true
      const params = {
        ...scope.row
      }

      params.detailImg = JSON.stringify(params.detailImg)
      params.goodsImg = JSON.stringify([].concat(params.goodsImg))

      updateGood(params)
        .then(res => {
          if (res.result === 0) {
            this.fetchData()
          }
        })
        .catch(error => {
          console.warn(error)
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleEdit(id) {
      this.editDialogVisible = true
      this.editGoodId = id
    },
    handleDel(id) {
      this.loading = true
      delGood(id)
        .then(() => {
          this.fetchData()
        })
        .catch(error => {
          console.warn(error)
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchData()
    },
    handlePictureCardPreview(url) {
      this.dialogImageUrl = url
      this.dialogVisible = true
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
  .edit_good_wrap {
    height: 600px;
    overflow: auto;
  }
</style>

<style lang="scss" scoped>
  .page_product_add {
    .page_title {
      display: flex;
      align-items: center;
      margin-bottom: 24px;
      .mod_title {
        margin-bottom: 0px;
        margin-right: 24px;
      }
      .search_input {
        width: 256px;
      }
    }
    .product_img {
      width: 40px;
      height: 40px;
    }
    .recommend_select {
      width: 66px;
    }
    .page_content {
      margin-bottom: 24px;
      min-height: calc(100vh - 162px - 100px - 60px - 24px - 32px)
    }
    .el-pagination {
      text-align: right;
    }
  }
  .module.add_product {
    .el-form {
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
