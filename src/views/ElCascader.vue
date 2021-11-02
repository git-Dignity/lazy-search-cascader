// 原生el-cascader组件，前端支持搜索，前端做搜索，就搜索不到列表没有的数据，
// 前端不可能显示1w+条数据，卡死，所以这里只展示50条，但就是搜索不到50条以外的数据。
<template>
  <div class="waterStorage-content">
    <div class="condition display-flex text-align-left">
      <div>
        <!-- :props="{ multiple: true }"     :filterable="true"     -->
        <el-cascader
          class="margin-left-10 provinceScascader"
          :options="optionsReservoir"
          :props="props"
          :show-all-levels="false"
          :filter-method="filterMethod"
          filterable
          collapse-tags
          placeholder="全省流域"
          @visible-change="visibleChange"
          @change="cascaderChange"
          popper-class="provincePopperScascader"
          @expand-change="expandChange"
        >
        </el-cascader>
      </div>
    </div>
  </div>
</template>

<script>
import { datajSON2, datajSON3, datajSON4 } from "../data/elCascader.js"
export default {
  components: {},
  data() {
    return {
      optionsReservoir: [],
      props: {
        multiple: true,
        lazy: true,
        checkStrictly: true,
        lazyLoad: (node, resolve) => {
          // console.log(node)
          if (node.level < 2) {
            resolve([])
            this.setElCheckboxDisplay()
          } else {
            this.getWaterListByTimeSlot(node.parent.value, node.value).then(
              (res) => {
                if (res.length > 50) {
                  res.slice(0, 50).map((item) => {
                    item.leaf = true
                  })
                  resolve(res.slice(0, 50))
                } else {
                  resolve(res)
                }
              }
            )
          }
        },
      },
    }
  },
  methods: {
    // 筛选方法
    filterMethod(node, key) {
      if (node?.level === 3 && node?.text.indexOf(key) != -1) {
        return node
      }
    },
    // 下拉框出现时，调用过滤方法
    visibleChange(flag) {
      if (flag) {
        this.filterMethod()
      }
    },
    /**
     * @description: 水库蓄水统计-根据开始时间和结束时间两个时间点获取流域水库列表数据接口
     * @param {String} basincd 流域
     * @param {String} type 水库类型
     * @return {Array}
     */

    getWaterListByTimeSlot(basincd, type) {
      return new Promise((resolve, reject) => {
        if (type == 2) {
          resolve(
            JSON.parse(
              JSON.stringify(datajSON2)
                .replace(/ennmcd/g, "value")
                .replace(/ennm/g, "label")
            )
          )
        } else if (type == 3) {
          resolve(
            JSON.parse(
              JSON.stringify(datajSON3)
                .replace(/ennmcd/g, "value")
                .replace(/ennm/g, "label")
            )
          )
        } else if (type == 4) {
          resolve(
            JSON.parse(
              JSON.stringify(datajSON4)
                .replace(/ennmcd/g, "value")
                .replace(/ennm/g, "label")
            )
          )
        }
      })

      // 以下是真实接口
      //   return new Promise((resolve, reject) => {
      //     let url = "wcs/rras/reservoir/reservoir/getWaterListByTimeSlot"
      //     let params = {
      //       basincd,
      //       startTime: '2021110208',
      //       endTime: '2021110208',
      //       type,
      //       pageNo: 1,
      //       pageSize: 9999,
      //     }

      //     axios
      //       .post(url, params)
      //       .then((res) => {
      //         let result = res.data.data.page.list

      //         resolve(
      //           JSON.parse(
      //             JSON.stringify(result)
      //               .replace(/ennmcd/g, "value")
      //               .replace(/ennm/g, "label")
      //           )
      //         )
      //       })
      //       .catch((e) => {
      //         resolve([])
      //       })
      //   })
    },

    cascaderChange(e) {
      console.log(e, "-------")
    },
    getTreeDate() {
      const basinList = {
        粤西沿海诸河水系: "HG",
        珠江三角洲: "HD",
        北江流域: "HB",
        东江流域: "HC",
        西江流域: "HA",
        韩江流域: "HE",
      }

      let res = [
        {
          label: "全省流域",
          value: "",
          children: [],
        },
      ]

      for (const key in basinList) {
        if (Object.hasOwnProperty.call(basinList, key)) {
          const element = basinList[key]
          res[0].children.push({
            label: key,
            value: element,
          })
        }
      }

      res[0].children.forEach((rc) => {
        rc.children = []
        rc.children.push(
          {
            label: "大型",
            value: "2",
          },
          {
            label: "中型",
            value: "3",
          },
          {
            label: "小型",
            value: "4",
          }
        )
      })

      this.optionsReservoir = res[0].children
      this.setElCheckboxDisplay()
    },
    /**
     * @description: 水库选择展开
     * @param {*} e
     * @return {*}
     */
    expandChange(e) {
      this.setElCheckboxDisplay()
    },
    /**
     * @description: 设置el-cascader元素样式
     * @param {*}
     * @return {*}
     */
    setElCheckboxDisplay() {
      this.$nextTick(() => {
        // 复选框
        const elCheckbox = document.querySelectorAll(
          ".provincePopperScascader  .el-cascader-node  .el-checkbox"
        )

        // 复选框右边的文字
        const elCascaderLabel = document.querySelectorAll(
          ".provincePopperScascader .el-cascader-menu .el-cascader-node__label"
        )

        elCheckbox.forEach((ec, ecIndex) => {
          if (ecIndex < 9) {
            ec.style.display = "none"
          }
        })
        elCascaderLabel.forEach((elc, elcIndex) => {
          if (elcIndex < 9) {
            elc.style.marginLeft = "0px"
          }
        })
      })
    },
  },
  mounted() {
    this.getTreeDate()
  },
}
</script>

<style lang="less" scoped>
.waterStorage-content {
  height: 100%;
  .condition {
    height: 60px;
    display: flex;
    align-items: center;

    .dividing-line {
      color: #e3eaf4;
      font-size: larger;
      margin: 0 20px;
      &.last-line {
        margin-left: 10px;
      }
    }
    .btn {
      display: flex;
      align-items: center;
      cursor: pointer;
      border-radius: 3px;
      padding: 3px 8px;
      border: 1px solid #cfd7e5;
      font-weight: normal;
      img {
        width: 22px;
        height: 22px;
      }
    }
    .provinceScascader {
      /deep/ .el-cascader__tags {
        display: flex;
        flex-wrap: nowrap;
      }
      /deep/ .el-input__inner {
        height: 30px !important;
        width: 370px;
      }
    }
  }
  .table-content {
    display: flex;
    justify-content: space-between;
    height: calc(100% - 60px);
  }
}
</style>

<style lang="less">
// 蓄水统计 点击文字可选择
.provincePopperScascader {
  .el-cascader-menu {
    .el-checkbox {
      width: 76%;
      height: 100%;
      z-index: 10;
      position: absolute;
      left: 0;
      top: 0;
      .el-checkbox__input {
        position: absolute;
        top: 10px;
        left: 34px;
      }
    }
    .el-cascader-node__label {
      margin-left: 28px;
    }
  }
}
</style>
