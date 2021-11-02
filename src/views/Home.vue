<template>
  <div class="condition">
    <lazy-cascader
      filterable
      :width="'400px'"
      :searchWidth="'590px'"
      :props="props2"
      :disabled="classify == 'type'"
      :show-all-levels="false"
      :placeholder="'全省流域'"
      clearable
      @change="cascaderChange"
      class="margin-left-10 provinceScascader"
      :popper-class="'provincePopperScascader'"
      ref="lazyCascader"
    ></lazy-cascader>
  </div>
</template>

<script>
import { fieldReplace, getReservoirType, strRemoveNum } from "@/utils/arr"
import { dataJson } from "../data/data.js"
import lazyCascader from "@/components/search-cascader"
import axios from "axios"

export default {
  components: {
    lazyCascader,
  },
  data() {
    return {
      basinAndTypeCancel: axios.CancelToken.source(),
      current: [],
      options: [],
      props2: {
        multiple: true,
        checkStrictly: false,
        value: "id",
        label: "name",
        leaf: "leaf",
        lazyLoad: this.lazyLoad,
        lazySearch: this.lazySearch,
      },
    }
  },
  methods: {
    /**
     * @description: 加载级联的方法
     * @param {*} node
     * @param {*} resolve
     * @return {*}
     */

    lazyLoad(node, resolve) {
      this.getCateList(node.value ? node.value : 0).then((res) => {
        resolve(res)
      })
    },

    /**
     * @description: 下拉框搜索
     * @param {*} queryString
     * @param {*} callback
     * @return {*}
     */

    lazySearch(queryString, callback) {
      // console.log(dataJson, queryString);
      let tmp = []
      dataJson.forEach((d) => {
        d.typeVoList.forEach((dt) => {
          dt.voList.forEach((dtv) => {
            if (dtv.ennm.indexOf(queryString) != -1) {
              tmp.push({
                id: [
                  strRemoveNum(dtv.basincd),
                  getReservoirType(dtv.encl),
                  dtv.ennmcd,
                ],
                name: [dtv.basinnm, dtv.enclDesc, dtv.ennm],
              })
            }
          })
        })
      })
      // console.log(tmp);
      callback(tmp)

      // 下面是真实请求接口的例子
      // setTimeout(() => {
      //   axios
      //     .get("wcs/rras/reservoir/reservoir/page/searchReservoirInfoList", {
      //       params: {
      //         searchValue: queryString,
      //       },
      //     })
      //     .then((res) => {
      //       // console.log(res.data.data.list)
      //       let result = this.getVal(res, "data", "data", "list")
      //       let tmp = []

      //       if (result) {
      //         result.forEach((r) => {
      //           tmp.push({
      //             id: [
      //               strRemoveNum(r.basincd),
      //               getReservoirType(r.encl),
      //               r.ennmcd,
      //             ],
      //             name: [r.basinnm, r.enclDesc, r.ennm],
      //           })
      //         })
      //         // console.log(tmp)
      //         callback(tmp)
      //       } else {
      //         callback([])
      //       }
      //     })
      //     .catch((e) => {
      //       callback([])
      //     })
      // }, 200)
    },

    /**
     * @description: 获取下拉框数据
     * @param {*}
     * @return {*}
     */
    getTreeDate() {
      const basinList = {
        粤西沿海诸河水系: "HG",
        珠江三角洲: "HD",
        北江流域: "HB",
        东江流域: "HC",
        西江流域: "HA",
        韩江流域: "HE",
      }
      return new Promise((resolve, reject) => {
        this.groupReservoirByBasinAndType("HG,HD,HB,HC,HA,HE", "2,3,4")
          .then((resBasin) => {
            console.log(resBasin)
            let res = [
              {
                name: "全省流域",
                id: "",
                children: [],
              },
            ]

            // 第一级
            for (const key in basinList) {
              if (Object.hasOwnProperty.call(basinList, key)) {
                const element = basinList[key]
                res[0].children.push({
                  name: key,
                  id: element,
                })
              }
            }

            res[0].children.forEach((rc, rcIndex) => {
              let basinnmIndex = ""

              resBasin.map((b, bIndex) => {
                if (b.basinnm == rc.name) {
                  basinnmIndex = bIndex
                }
              })

              rc.children = []

              // 获取中型的索引（因为不止全部都有大、中、小，如果大型没有，那么中型索引就是0；大型有，中型索引是1）
              let mediumIndex = 0 // 中型索引
              if (resBasin[basinnmIndex].typeVoList.length === 1) {
                mediumIndex = 0
              } else if (resBasin[basinnmIndex].typeVoList.length === 2) {
                mediumIndex = 1
              } else if (resBasin[basinnmIndex].typeVoList.length === 3) {
                mediumIndex = 2
              }

              const fieldAll = [
                {
                  ennmcd: this.props2.value,
                },
                {
                  ennm: this.props2.label,
                },
              ]

              // 添加第二级及以下的孩子
              rc.children.push(
                {
                  name: "大型",
                  id: "2",
                  children:
                    mediumIndex === 2
                      ? fieldReplace(
                          resBasin[basinnmIndex].typeVoList[0].voList,
                          fieldAll
                        )
                      : [],
                },
                {
                  name: "中型",
                  id: "3",
                  children:
                    mediumIndex === 2
                      ? fieldReplace(
                          resBasin[basinnmIndex].typeVoList[1].voList,
                          fieldAll
                        )
                      : mediumIndex === 1
                      ? fieldReplace(
                          resBasin[basinnmIndex].typeVoList[0].voList,
                          fieldAll
                        )
                      : [],
                },

                {
                  name: "小型",
                  id: "4",
                  children:
                    mediumIndex === 0
                      ? fieldReplace(
                          resBasin[basinnmIndex].typeVoList[0].voList.slice(
                            0,
                            50
                          ),
                          fieldAll
                        )
                      : fieldReplace(
                          resBasin[basinnmIndex].typeVoList[
                            resBasin[basinnmIndex].typeVoList.length - 1
                          ].voList.slice(0, 50),
                          fieldAll
                        ),
                }
              )
            })

            this.options = res[0].children
            // console.log(this.options)
            resolve(true)
          })
          .catch((e) => {
            console.log(e)
            reject(false)
          })
      })
    },

    /**
     * @do 将接口替换成死数据
     * @description: 水库蓄水统计-根据开始时间和结束时间两个时间点获取流域水库列表数据接口
     * @param {String} basincd 流域
     * @param {String} type 水库类型
     * @return {Array}
     */
    groupReservoirByBasinAndType(basincd, type) {
      return new Promise((resolve, reject) => {
        resolve(dataJson)
      })

      // 下面是真实请求接口的例子
      // this.basinAndTypeCancel?.cancel()
      // this.basinAndTypeCancel = axios.CancelToken.source()

      // return new Promise((resolve, reject) => {
      //   let url ='wcs/rras/reservoir/reservoir/groupReservoirByBasinAndType'
      //   let params = {
      //     basincd,
      //     type
      //   }

      //   axios
      //     .get(url, {
      //       params,
      //       cancelToken: this.basinAndTypeCancel.token
      //     })
      //     .then(res => {
      //       resolve(res.data.data)
      //     })
      //     .catch(e => {
      //       resolve([])
      //     })
      // })
    },

    /**
     * @description: 获取节点数据
     * @param {*} parent
     * @return {*}
     */

    getCateList(parent) {
      console.log(parent)
      if (parent == 0) {
        // 一开始没数据，拿this.options数据
        return new Promise((resolve, reject) => {
          this.getTreeDate()
            .then((res) => {
              // console.log(res)
              if (res) {
                this.options.map((item) => {
                  let obj = {
                    id: item.id,
                    name: item.name,
                    leaf: true,
                  }
                  if (item.children && item.children.length > 0) {
                    obj.leaf = false
                    item.children.map((ic) => {
                      if (ic.children && ic.children.length > 0) {
                        ic.children.map((icc) => {
                          icc.leaf = true
                        })
                      }
                    })
                  }
                  return obj
                })
                resolve(this.options)
              } else {
                resolve([])
              }
            })
            .catch((e) => {
              resolve([])
            })
        })
      } else {
        return new Promise((resolve, reject) => {
          this.current = []
          this.findCate(parent, this.options)
          this.current.map((item) => {
            let obj = {
              id: item.id,
              name: item.name,
              leaf: true,
            }
            if (item.children && item.children.length > 0) {
              obj.leaf = false
            }
            return obj
          })
          resolve(this.current)
        })
      }
    },
    findCate(parent, children) {
      for (let i = 0; i < children.length; i++) {
        if (parent == children[i].id) {
          this.current = children[i].children
        } else {
          if (children[i].children) {
            this.findCate(parent, children[i].children)
          }
        }
      }
    },
  },
  created() {},
}
</script>

<style lang="less" scoped>
.condition {
  // 1
  // height: 60px;
  // display: flex;
  // align-items: center;

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
      // height: 30px !important;  // 2
      width: 370px;
    }
  }
}
.table-content {
  display: flex;
  justify-content: space-between;
  height: calc(100% - 60px);
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
