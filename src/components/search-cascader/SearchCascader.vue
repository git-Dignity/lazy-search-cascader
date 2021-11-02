<template>
  <div class="lazy-cascader" :style="{ width: width }">
    <!-- 禁用状态 -->
    <div
      v-if="disabled"
      class="el-input__inner lazy-cascader-input lazy-cascader-input-disabled"
    >
      <span class="lazy-cascader-placeholder" v-show="placeholderVisible">
        {{ placeholder }}
      </span>
      <div class="lazy-cascader-tags" v-if="props.multiple">
        <Tag
          :showAllLevels="showAllLevels"
          :labelArray="labelArray"
          :separator="separator"
          @close="handleClose"
        />
      </div>
      <div class="lazy-cascader-label" v-else>
        <el-tooltip
          placement="top-start"
          :content="labelObject.label.join(separator)"
        >
          <span>{{ labelObject.label.join(separator) }}</span>
        </el-tooltip>
      </div>
    </div>
    <!-- 禁用状态 -->
    <!-- 可选状态 -->
    <el-popover v-else trigger="click" placement="bottom-start" ref="popover">
      <!-- 搜索 -->
      <div class="lazy-cascader-search">
        <el-autocomplete
          :style="{ width: searchWidth || '100%' }"
          :popper-class="suggestionsPopperClass"
          v-if="filterable"
          class="inline-input"
          prefix-icon="el-icon-search"
          label="name"
          v-model="keyword"
          :fetch-suggestions="querySearch"
          :trigger-on-focus="false"
          placeholder="请输入"
          @select="handleSelect"
          @blur="isSearchEmpty = false"
        >
          <template slot-scope="{ item }">
            <div class="name" :class="isChecked(item[props.value])">
              {{ item[props.label].join(separator) }}
            </div>
          </template>
        </el-autocomplete>
        <div class="empty" v-show="isSearchEmpty">{{ searchEmptyText }}</div>
      </div>
      <!-- 搜索 -->
      <!-- 级联面板 -->
      <div class="lazy-cascader-panel">
        <el-cascader-panel
          ref="panel"
          v-model="current"
          :options="options"
          :props="currentProps"
          :class="popperClass"
          @change="change"
          @expand-change="expandChange"
        ></el-cascader-panel>
      </div>
      <!-- 级联面板 -->
      <!--内容区域-->
      <div
        class="el-input__inner lazy-cascader-input"
        :class="disabled ? 'lazy-cascader-input-disabled' : ''"
        slot="reference"
      >
        <span class="lazy-cascader-placeholder" v-show="placeholderVisible">
          {{ placeholder }}
        </span>
        <div class="lazy-cascader-tags" v-if="props.multiple">
          <Tag
            :showAllLevels="showAllLevels"
            :labelArray="labelArray"
            :separator="separator"
            @close="handleClose"
          />
        </div>
        <div class="lazy-cascader-label" v-else>
          <el-tooltip
            placement="top-start"
            :content="labelObject.label.join(separator)"
          >
            <span>{{ labelObject.label.join(separator) }}</span>
          </el-tooltip>
        </div>
        <span
          class="lazy-cascader-clear"
          v-if="clearable && current.length > 0"
          @click.stop="clearBtnClick"
        >
          <i class="el-icon-close"></i>
        </span>
      </div>
      <!--内容区域-->
    </el-popover>
    <!-- 可选状态 -->
  </div>
</template>
<script>
import { getArrLevel } from '@/utils/arr'

import Tag from './Tag.vue'
export default {
  props: {
    value: {
      type: Array,
      default: () => {
        return []
      }
    },
    // label连接符
    separator: {
      type: String,
      default: ' > '
    },
    // 输入框占位文本
    placeholder: {
      type: String,
      default: '请选择'
    },
    width: {
      type: String,
      default: '400px'
    },
    // 是否开启搜索
    filterable: Boolean,
    // 是否支持清空选项
    clearable: Boolean,
    disabled: Boolean,
    // 输入框中是否显示选中值的完整路径
    showAllLevels: {
      type: Boolean,
      default: true
    },
    // 为el-cascader-panel级联面板添加class
    popperClass: {
      type: String,
      default: 'popperScascader'
    },
    props: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 搜索下拉列表的类名
    suggestionsPopperClass: {
      type: String,
      default: 'suggestions-popper-class'
    },
    searchWidth: {
      type: String
    },
    searchEmptyText: {
      type: String,
      default: '暂无数据'
    }
  },
  components: {
    Tag
  },
  data() {
    return {
      isSearchEmpty: false,
      keyword: '',
      options: [],
      current: [],
      labelObject: { label: [], value: [] },
      labelArray: [],
      currentProps: {
        multiple: this.props.multiple,
        checkStrictly: this.props.checkStrictly,
        value: this.props.value,
        label: this.props.label,
        leaf: this.props.leaf,
        lazy: true,
        lazyLoad: this.lazyLoad
      },
      searchArray: [], // 搜索数组
      optionLevel: 1 // 设置数组层级
    }
  },
  computed: {
    placeholderVisible() {
      if (this.current) {
        return this.current.length == 0
      } else {
        return true
      }
    }
  },
  watch: {
    current() {
      this.getLabelArray()
    },
    value(v) {
      // console.log(v)
      this.current = v
    },
    keyword() {
      this.isSearchEmpty = false
    }
  },
  created() {
    this.initOptions()
  },
  methods: {
    //搜索是否选中
    isChecked(value) {
      //多选
      if (this.props.multiple) {
        let index = this.current.findIndex(item => {
          return item.join() == value.join()
        })
        if (index > -1) {
          return 'el-link el-link--primary'
        } else {
          return ''
        }
      } else {
        if (value.join() == this.current.join()) {
          return 'el-link el-link--primary'
        } else {
          return ''
        }
      }
    },
    //搜索
    querySearch(query, callback) {
      this.props.lazySearch(query, list => {
        // console.log(list);
        callback(list)
        if (!list || !list.length) this.isSearchEmpty = true
      })
    },
    /**
     * @description: 获取option某一项（仅最多支持三层）
     * @param {*} item
     * @return {Array} [a, b, c]
     * a：第一项this.options的id（流域）；
     * b：第一项this.options.children的id（大中小型）；
     * c：当前列表（默认50条数据）有没有搜索这个值的存在（返回布尔）；
     */

    findOptionsItem(item) {
      let arr = []
      for (let i = 0; i < this.options.length; i++) {
        if (this.options[i].id === item.id[0]) {
          // 第一层
          arr.push(i)
          if (this.optionLevel > 1) {
            // 第二层
            if (this.optionLevel === 2) {
              const findRes = this.options[i].children.find(
                occ => occ.id === item.id[1]
              )
              arr.push(findRes?.id ? true : false)

              return arr
            } else {
              for (let j = 0; j < this.options[i].children.length; j++) {
                // 第二层
                if (this.options[i].children[j].id === item.id[1]) {
                  arr.push(j)

                  // 第三层
                  const findRes = this.options[i].children[j].children.find(
                    occ => occ.id === item.id[2]
                  )
                  arr.push(findRes?.id ? true : false)

                  return arr
                }
              }
            }
          } else {
            return arr
          }
        }
      }
    },

    /**
     * @description 懒加载的时候怎么才能搜索出未加载的选项？
     * @description: 选中搜索下拉搜索项
     * @param {*} item
     * @return {*}
     */

    handleSelect(item) {
      // console.log(item, this.props, this.current)
      // console.log(this.options)
      const optionsItem = this.findOptionsItem(item)
      const idIndex = this.optionLevel - 1 // option层级

      // optionsItem[2]：当前列表（默认50条数据）有没有搜索这个值的存在（返回布尔）
      // 如果没有 && searchArray没有这个值就push
      if (
        !optionsItem[idIndex] &&
        !this.searchArray.includes(item.id[idIndex])
      ) {
        this.searchArray.push(item.id[idIndex])
        this.options[optionsItem[0]].children[optionsItem[1]].children.push({
          id: item.id[idIndex],
          leaf: true,
          name: item.name[idIndex]
        })
      }

      if (this.props.multiple) {
        let index = this.current.findIndex(obj => {
          return obj.join() == item[this.props.value].join()
        })
        if (index == -1) {
          this.$refs.panel.clearCheckedNodes()
          this.current.push(item[this.props.value])
          this.$emit('change', this.current)
        }
      } else {
        //选中下拉选变更值
        if (
          this.current == null ||
          item[this.props.value].join() !== this.current.join()
        ) {
          this.$refs.panel.activePath = []
          this.current = item[this.props.value]
          this.$emit('change', this.current)
        }
      }
      this.keyword = ''
    },
    //初始化数据
    async initOptions() {
      this.setElCheckboxDisplay()
      this.props.lazyLoad(0, list => {
        // console.log(list);
        this.$set(this, 'options', list)
        this.optionLevel = getArrLevel(this.options) // 设置数组层级
        if (this.props.multiple) {
          this.current = [...this.value]
        } else {
          this.current = this.value
        }
      })
    },
    async getLabelArray() {
      this.setElCheckboxDisplay()
      if (this.props.multiple) {
        // console.log(this.current);
        let array = []
        for (let i = 0; i < this.current.length; i++) {
          let obj = await this.getObject(this.current[i])
          // console.log(obj)
          array.push(obj)
        }
        // console.log(array)
        this.labelArray = array
        this.$emit('input', this.current)
        if (!this.disabled) {
          this.$nextTick(() => {
            this.$refs.popover.updatePopper()
          })
        }
      } else {
        this.labelObject = await this.getObject(this.current || [])
        this.$emit('input', this.current)
      }
      // console.log(this.current)
    },
    /**格式化id=>object */
    async getObject(id) {
      try {
        let options = this.options
        let nameArray = []
        for (let i = 0; i < id.length; i++) {
          let index = options.findIndex(item => {
            return item[this.props.value] == id[i]
          })
          nameArray.push(options[index][this.props.label])
          if (i < id.length - 1 && options[index].children == undefined) {
            let list = new Promise(resolve => {
              // console.log(id[i]);
              this.props.lazyLoad(id[i], list => {
                resolve(list)
              })
            })
            this.$set(options[index], 'children', await list)
            options = options[index].children
          } else {
            options = options[index].children
          }
        }
        return { value: id, label: nameArray }
      } catch (e) {
        this.current = []
        return { value: [], label: [] }
      }
    },
    //懒加载数据
    async lazyLoad(node, resolve) {
      let current = this.current
      if (this.props.multiple) {
        current = [...this.current]
      }
      if (node.root) {
        resolve()
      } else if (node.data[this.props.leaf]) {
        resolve()
      } else if (node.data.children) {
        if (this.props.multiple) {
          this.current = current
        }
        resolve()
      } else {
        this.props.lazyLoad(node, list => {
          node.data.children = list
          if (this.props.multiple) {
            this.current = current
          }
          resolve(list)
        })
      }
      // console.log(this.current)
    },
    //删除多选值
    /**删除**/
    handleClose(item, eee) {
      let index = this.current.findIndex(obj => {
        return obj.join() == item.value.join()
      })
      if (index > -1) {
        this.$refs.panel.clearCheckedNodes()
        this.current.splice(index, 1)
        this.$emit('change', this.current)
      }
    },
    //点击清空按钮
    clearBtnClick() {
      this.$refs.panel.clearCheckedNodes()
      this.current = []
      this.$emit('change', this.current)
    },
    change() {
      // console.log(11111, this.current)
      this.$emit('change', this.current)
    },
    /**
     * @description: 选择展开
     * @param {*} e
     * @return {*}
     */
    expandChange(e) {
      this.setElCheckboxDisplay()
    },

    /**
     * @description 让复选框隐藏（默认是前9个）
     * @description: 设置el-cascader元素样式
     * @param {*}
     * @return {*}
     */
    setElCheckboxDisplay(num = 9) {
      this.$nextTick(() => {
        // 复选框
        const elCheckbox = document.querySelectorAll(
          `.${this.popperClass}  .el-cascader-node  .el-checkbox`
        )

        // 复选框右边的文字
        const elCascaderLabel = document.querySelectorAll(
          `.${this.popperClass} .el-cascader-menu .el-cascader-node__label`
        )

        elCheckbox.forEach((ec, ecIndex) => {
          if (ecIndex < num) {
            ec.style.display = 'none'
          }
        })
        elCascaderLabel.forEach((elc, elcIndex) => {
          if (elcIndex < num) {
            elc.style.marginLeft = '0px'
          }
          elc.style.width = '140px' // 140px
          elc.style.whiteSpace = 'nowrap'
          elc.style.textOverflow = 'ellipsis'
          elc.style.overflow = 'hidden'
          elc.style.wordBreak = 'break-all'
        })
      })
    }
  }
}
</script>
<style lang="less">

.lazy-cascader {
  display: inline-block;
  width: 300px;
  .lazy-cascader-input {
    position: relative;
    width: 100%;
    background: #fff;
    height: auto;
    min-height: 36px;
    // padding: 5px;
    line-height: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    > .lazy-cascader-placeholder {
      padding: 0 2px;
      line-height: 28px;
      color: #999;
      font-size: 16px;
    }
    > .lazy-cascader-label {
      padding: 0 2px;
      line-height: 28px;
      color: #606266;
      font-size: 16px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    > .lazy-cascader-clear {
      position: absolute;
      right: 0;
      top: 0;
      display: inline-block;
      width: 36px;
      height: 36px;
      text-align: center;
      line-height: 36px;
    }
  }
  .lazy-cascader-input-disabled {
    background-color: #f5f7fa;
    border-color: #e4e7ed;
    color: #c0c4cc;
    cursor: not-allowed;
    > .lazy-cascader-label {
      color: #c0c4cc;
    }
    > .lazy-cascader-placeholder {
      color: #c0c4cc;
    }
  }
  .lazy-cascader-tags {
    height: 100%;
    display: flex;
    align-items: center;
  }

  .suggestions-popper-class {
    // width: auto !important;
    min-width: 200px;
  }
}

.lazy-cascader-search {
  .empty {
    width: calc(100% - 24px);
    box-sizing: border-box;
    background-color: #fff;
    color: #999;
    text-align: center;
    position: absolute;
    z-index: 999;
    padding: 12px 0;
    margin-top: 12px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    &:before {
      content: '';
      position: absolute;
      top: -12px;
      left: 36px;
      width: 0;
      height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-top: 6px solid transparent;
      border-bottom: 6px solid #fff;
      filter: drop-shadow(0 -1px 2px rgba(0, 0, 0, 0.02));
    }
  }
}

.lazy-cascader-panel {
  margin-top: 10px;
  display: inline-block;
}

.el-autocomplete-suggestion li {
  text-align: left;
  font-size: 16px;
}
</style>

<style lang="less" scoped>
/deep/ .el-cascader-menu__wrap {
  height: 272px;
}
.el-link {
  font-size: 16px;
}
</style>
