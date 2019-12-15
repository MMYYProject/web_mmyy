<template>
  <div class="merchant_page">
    <el-form ref="couponInfo" :model="couponInfo" :rules="rules" label-width="100px" class="demo-couponInfo">
      <el-form-item label="优惠券名称">
        <el-input v-model="couponInfo.name" />
      </el-form-item>
      <el-form-item label="发放总量">
        <el-input v-model="couponInfo.paymentTotal">
          <template slot="append">张</template>
        </el-input>
        <span>修改优惠券总量时只能增加不能减少，请谨慎设置</span>
      </el-form-item>
      <el-form-item label="适用门槛">
        <el-input v-model="couponInfo.usePrice">
          <template slot="append">元</template>
        </el-input>
        <span>备注:无门槛使用，请输0</span>
      </el-form-item>
      <el-form-item label="优惠券金额">
        <el-input v-model="couponInfo.punishmentPrice">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="用券类型">
        <el-radio-group v-model="couponInfo.type">
          <el-radio label="0">时间区间</el-radio>
          <el-radio label="1">领券当日起</el-radio>
          <el-radio label="2">领券次日起</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="couponInfo.type ==='0'" label="">
        <el-date-picker
          v-model="couponInfo.time"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item v-if="couponInfo.type ==='1'" label="">
        <el-input v-model="couponInfo.fromThatDay" type="input">
          <template slot="prepend">领券当日起</template>
          <template slot="内可用">元</template>
        </el-input>
      </el-form-item>
      <el-form-item v-if="couponInfo.type ==='2'" label="">
        <el-input v-model="couponInfo.desc" type="input">
          <template slot="prepend">领券次日起</template>
          <template slot="内可用">元</template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('couponInfo')">添加</el-button>
        <el-button @click="resetForm('couponInfo')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      shopId: '',
      host: 'https://wechat.mamayy.com/mother',
      couponInfo: {
        name: '',
        paymentTotal: '',
        startDate: '',
        endDate: '',
        usePrice: '',
        time: [],
        punishmentPrice: '',
        type: '0',
        fromThatDay: '',
        fromNextDay: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入优惠券名称', trigger: 'blur' }
        ],
        paymentTotal: [
          { required: true, message: '请填写发放总量', trigger: 'change' }
        ],
        type: [
          { type: 'array', required: true, message: '请至少选择一个用券类型', trigger: 'change' }
        ]
      }

    }
  },
  created() {
    const userInfo = JSON.parse(localStorage.getItem('user_info'))
    console.log(userInfo)
    this.shopId = userInfo.shopId
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = { ...this.couponInfo }
          if (params.type === '0') {
            params.startDate = params.time[0]
            params.endDate = params.time[1]
          }
          params.shopId = this.shopId
          delete params.time
          const url = `${this.host}/insertCoupon`
          axios
            .post(url, params)
            .then(res => {
              if (res.data.result === 0) {
                this.$message({
                  message: '添加成功',
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
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style lang="css" scoped>
.merchant_page {
  width: 40vw;
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
