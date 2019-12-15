<template>
  <div class="merchant_page">
    <div class="search_form_wrap">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-input
            v-model="formInline.coupon"
            placeholder="请输入优惠券名称"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchData">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="data_table_wrap">
      <el-table
        v-loading="loading"
        :data="list"
        stripe
        border
        style="width: 100%"
        align="center"
      >
        <el-table-column align="center" type="index" :index="indexMethod" label="序号" />
        <el-table-column align="center" prop="name" label="优惠券名称" />
        <el-table-column align="center" prop="paymentTotal " label="数量">
          <template slot-scope="scope">
            <span v-if="scope.row.paymentTotal">{{ scope.row.paymentTotal }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="startDate" label="有效期">
          <template slot-scope="scope">
            <span v-if="scope.row.startDate && scope.row.endDate">
              {{ scope.row.startDate }}至{{ scope.row.endDate }}
            </span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="usePrice" label="适用门槛">
          <template slot-scope="scope">
            <span
              v-if="scope.row.usePrice != 0 && scope.row.usePrice"
            >满{{ scope.row.usePrice }}可用</span>
            <span v-else>无使用门槛</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="idCard" label="优惠券详情" /> -->
        <el-table-column align="center" prop="status" label="状态">
          <template slot-scope="scope">
            <span>{{ scope.row.status | filterStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column
          class-name="col-options"
          prop="address"
          label="操作"
          width="110"
        >
          <template slot-scope="scope">
            <el-button
              size="small"
              type="text"
              @click="showDialog(scope)"
            >编辑</el-button>
            <el-popconfirm title="确定移除吗？">
              <el-button
                slot="reference"
                size="small"
                type="text"
                @click="delShop(scope)"
              >移除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination_wrap">
      <div class="left">
        显示第 {{ startNum }} 到 {{ endNum }} 条记录，总共 {{ total }} 条记录
      </div>
      <div class="right">
        <el-pagination
          layout="prev, pager, next, jumper"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          :total="total"
        >@current-change="handleCurrentChange"</el-pagination>
      </div>
    </div>
    <el-dialog
      title="优惠券修改"
      width="50vw"
      :visible.sync="showDetail"
      class="data_table_dialog"
    >
      <el-form :model="couponObj" label-width="100px">
        <el-form-item label="优惠券名称:">
          <el-input
            v-model="couponObj.name"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="数量">
          <el-input
            v-model="couponObj.paymentTotal"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="有效期:">
          <el-date-picker
            v-model="couponObj.time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="适用门槛:">
          <el-input
            v-model="couponObj.usePrice"
            autocomplete="off"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeDialog">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  filters: {
    filterStatus: function(status) {
      let res = ''
      switch (status) {
        case 0:
          res = '停用'
          break
        case 1:
          res = '使用中'
          break
        default:
          break
      }
      return res
    },
    filterPerfectStatus: function(perfect_status) {
      if (perfect_status === 1) {
        return '已完善'
      } else {
        return '未完善'
      }
    }
  },
  data() {
    return {
      host: 'https://wechat.mamayy.com/mother',
      loading: true,
      currentPage: 1,
      pageSize: 11,
      total: 0,
      formInline: {
        coupon: ''
      },
      list: [],
      showDetail: false,
      couponObj: {
        name: '',
        paymentTotal: '',
        startDate: '',
        endDate: '',
        usePrice: '',
        time: []
      },
      value6: ''
    }
  },
  computed: {
    startNum: function() {
      return this.currentPage * this.pageSize - this.pageSize
    },
    endNum: function() {
      const end = this.currentPage * this.pageSize
      return end > this.total ? this.total : end
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    indexMethod(index) {
      return index + 1
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    fetchData() {
      this.loading = true
      const url = `${this.host}/name=${this.formInline.coupon}/${this
        .currentPage - 1}/${this.pageSize}/gainCouponByNameList`
      axios
        .get(url)
        .then(res => {
          if (res.data.result === 0) {
            this.list = res.data.obj.data
            this.total = res.data.obj.total
            this.currentPage = 1
          } else {
            // to do
            // fetch error
            this.list = []
            this.total = 0
            this.currentPage = 1
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    delShop(scope) {
      this.$confirm('是否移除当前商户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const url = `${this.host}/delCoupon/${scope.row.id}`
        axios.get(url).then(res => {
          if (res.data.result === 0) {
            this.$message({
              type: 'success',
              message: '移除成功!'
            })
            this.fetchData()
          } else {
            this.$message({
              type: 'warning',
              message: res.data.msg
            })
          }
        })
      })
    },
    showDialog(scope) {
      this.couponObj = Object.assign(this.couponObj, scope.row)
      this.showDetail = true
    },
    closeDialog() {
      const params = { ...this.couponObj }
      params.startDate = params.time[0]
      params.endDate = params.time[1]
      delete params.time
      const url = `${this.host}/updateCoupon`
      axios
        .post(url, params)
        .then(res => {
          if (res.data.result === 0) {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            })
          }
        })
        .finally(() => {
          this.showDetail = false
        })
    }
  }
}
</script>
<style lang="css" scoped>
.merchant_page {
  padding: 21px 40px 33px 48px;
}
.data_table_wrap {
  min-height: calc(100vh - 87px - 45px - 41px - 33px - 21px - 21px - 22px);
}
.pagination_wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.left {
  font-size: 18px;
  color: #333;
}
</style>
