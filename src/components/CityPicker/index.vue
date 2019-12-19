<template>
  <div>
    <el-select
      v-model="province"
      placeholder="省级地区"
      @change="choseProvince"
    >
      <el-option
        v-for="item in provinces"
        :key="item"
        :label="item"
        :value="item"
      />
    </el-select>
    <el-select
      v-model="city"
      placeholder="市级地区"
      @change="choseCity"
    >
      <el-option
        v-for="item in citys"
        :key="item"
        :label="item"
        :value="item"
      />
    </el-select>
    <el-select
      v-model="region"
      placeholder="区级地区"
      @change="choseRegion"
    >
      <el-option
        v-for="item in regions"
        :key="item"
        :label="item"
        :value="item"
      />
    </el-select>
    <br>
    <el-input
      v-if="showDetail"
      v-model="detailAddress"
      placeholder="详细地址"
      @change="changeDetailAddress"
    />
  </div>
</template>

<script>
import cityData from '@/utils/city'

export default {
  name: 'CityPicker',
  props: {
    dprovince: {
      type: String,
      default: undefined
    },
    dcity: {
      type: String,
      default: undefined
    },
    dregion: {
      type: String,
      default: undefined
    },
    ddetailAddress: {
      type: String,
      default: undefined
    },
    showDetail: {
      type: Boolean,
      default: undefined
    },
    onChange: {
      type: Function,
      default: undefined
    }
  },
  data() {
    return {
      province: this.dprovince,
      city: this.dcity,
      region: this.dregion,
      detailAddress: this.ddetailAddress
    }
  },
  computed: {
    provinces() {
      return Object.keys(cityData)
    },
    citys() {
      if (this.province) {
        return Object.keys(cityData[this.province]) || []
      }
      return []
    },
    regions() {
      if (this.province && this.city) {
        return cityData[this.province][this.city] || []
      }
      return []
    }
  },
  watch: {
    dprovince(n_v, o_v) {
      if (n_v && n_v !== o_v && !this.province) {
        this.province = n_v
      }
    },
    dcity(n_v, o_v) {
      if (n_v && n_v !== o_v && !this.city) {
        this.city = n_v
      }
    },
    dregion(n_v, o_v) {
      if (n_v && n_v !== o_v && !this.region) {
        this.region = n_v
      }
    },
    ddetailAddress(n_v, o_v) {
      if (n_v && n_v !== o_v && !this.detailAddress) {
        this.detailAddress = n_v
      }
    }
  },
  mounted() {
    this.province = this.dprovince
    this.city = this.dcity
    this.region = this.dregion
    this.detailAddress = this.ddetailAddress
  },
  methods: {
    choseProvince(province) {
      this.city = undefined
      this.region = undefined
      this.emitChange()
    },
    choseCity(city) {
      this.region = undefined
      this.emitChange()
    },
    choseRegion(region) {
      this.emitChange()
    },
    changeDetailAddress(detailAddress) {
      this.emitChange()
    },
    emitChange() {
      const data = {
        'province': this.province,
        'city': this.city,
        'region': this.region,
        'detailAddress': this.detailAddress
      }
      this.$emit('onChange', data)
    }
  }
}
</script>
