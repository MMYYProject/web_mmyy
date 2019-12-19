<template>
  <div class="page_order_index">
    <div
      v-loading="loading"
      class="module add_product"
    >
      <div class="page_title">
        <div class="mod_title">订单管理</div>
        <el-input
          v-model="searchText"
          class="search_input"
          placeholder="输入订单编号"
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
          <el-table-column prop="orderNo" label="订单编号" align="center" />
          <el-table-column prop="createTime" label="订单创建时间" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="allShopMoney" label="订单金额" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.allShopMoney }}元</div>
            </template>
          </el-table-column>
          <el-table-column prop="userPhone" label="联系电话" align="center" />
          <el-table-column prop="orderStatus" label="状态" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.orderStatus ===0">待付款</div>
              <div v-if="scope.row.orderStatus ===1">待发货</div>
              <div v-if="scope.row.orderStatus ===2">待收货</div>
              <div v-if="scope.row.orderStatus ===3">售后</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="183px" align="center">
            <template slot-scope="scope">
              <el-row>
                <span v-if="scope.row.orderStatus!=1">
                  <el-button type="primary" disabled size="small" @click="handleEdit(scope.row.orderNo)">发货</el-button>
                </span>
                <span v-else>
                  <el-button type="primary" size="small" @click="handleEdit(scope.row.orderNo)">发货</el-button>
                </span>
                <el-button type="primary" size="small" @click="handleLookDetail(scope.row.goodsList)">查看详情</el-button>
              </el-row>
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
    <el-dialog :visible.sync="dialogVisible" title="发货">
      <el-form ref="form" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="快递公司" prop="deliveryCompany">
          <el-select v-model="form.deliveryCompany" filterable placeholder="请选择物流公司">
            <el-option
              v-for="item in expressList"
              :key="item.id"
              :label="item.delivery"
              :value="item.delivery"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="快递单号" prop="deliveryNo">
          <el-input v-model="form.deliveryNo" placeholder="请输入快递单号" />
        </el-form-item>
        <div v-if="form.deliveryCompany==='京东快递'">
          <el-form-item label="京东青龙配送编码">
            <el-input v-model="form.customerName" placeholder="请输入京东青龙配送编码" />
          </el-form-item>
        </div>
        <el-button type="primary" @click="deliverGoods('form')">立即发货</el-button>
        <el-button>取消</el-button>
      </el-form>
    </el-dialog>
    <el-dialog :width="'50vw'" :visible.sync="dialogVisibleDetail" title="查看详情">
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        :height="'50vh'"
      >
        <el-table-column
          prop="goodsName"
          label="商品名称"
        />
        <el-table-column
          prop="price"
          label="价格"
        />
        <el-table-column
          prop="discountPrice"
          label="折扣价"
        />
        <el-table-column
          prop="standard"
          label="规格"
        />
        <el-table-column
          prop="num"
          label="数量"
        />
        <el-table-column
          prop="allPrice"
          label="总价"
        />
        <el-table-column
          prop="stock"
          label="库存剩余"
        />
        <el-table-column
          prop="fare"
          label="运费"
        />
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { orderManage, ajaxExpressList, ajaxDeliverGoods } from '@/api/product'
export default {
  filters: {
    getCreateTime(createTime) {
      return createTime.substring(0, 10)
    }
  },
  data() {
    return {
      shopId: undefined,
      loading: true,
      tableData: [],
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
      dialogVisibleDetail: false,
      editGoodId: undefined,
      expressList: [], //
      form: {
        deliveryNo: undefined,
        deliveryCompany: undefined,
        orderNo: undefined,
        customerName: undefined
      },
      rules: {
        deliveryCompany: [
          { required: true, message: '请选择快递公司', trigger: 'change' }
        ],
        deliveryNo: [
          { required: true, message: '请输入快递单号', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    const userInfo = JSON.parse(localStorage.getItem('user_info'))
    this.shopId = userInfo.id
    this.fetchData()
    this.handleAjaxExpress()
  },
  methods: {
    deliverGoods(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = { ...this.form }
          ajaxDeliverGoods(params).then(res => {
            this.$message({
              message: '发货成功',
              type: 'success'
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleLookDetail(goodsList) {
      this.dialogVisibleDetail = true
      this.tableData = goodsList
    },
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
    // 获取快递公司
    handleAjaxExpress() {
      ajaxExpressList({}).then(res => {
        this.expressList = res.obj
      })
    },
    fetchData() {
      this.loading = true

      const params = { shopId: this.shopId, orderNo: this.searchText, page: this.currentPage - 1, pageSize: this.pageSize }
      orderManage(params)
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
    handleEdit(orderNo) {
      this.dialogVisible = true
      this.form.orderNo = orderNo
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
  .page_order_index {
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
  .page_order_index {
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
