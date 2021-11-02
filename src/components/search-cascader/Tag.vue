<template>
  <div>
    <!-- 是否显示完整的路径 -->
    <template v-if="showAllLevels">
      <el-tag
        class="lazy-cascader-tag"
        type="info"
        size="small"
        disable-transitions
        v-for="(item, index) in labelArray"
        :key="index"
        closable
        @close="handleClose(item)"
      >
        <span> {{ item.label.join(separator) }}</span>
      </el-tag>
    </template>
    <template v-else>
      <el-tag
        class="lazy-cascader-tag"
        type="info"
        size="small"
        disable-transitions
        v-show="labelArray.length > 0"
      >
        <span> {{ getVal(labelArray, "0", "label", 2) }}</span>
      </el-tag>
      <el-tag
        class="lazy-cascader-tag"
        type="info"
        size="small"
        disable-transitions
        v-show="labelArray.length > 1"
      >
        <span> +{{ labelArray.length - 1 }}</span>
      </el-tag>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    showAllLevels: {
      type: Boolean,
      default: true,
    },
    labelArray: {
      type: Array,
      default: () => [],
    },
    separator: {
      type: String,
      default: " > ",
    },
  },
  data() {
    return {}
  },
  methods: {
    //删除多选值
    /**删除**/
    handleClose(item) {
      this.$emit("close", item)
    },
  },
}
</script>

<style lang="less" scoped>
.lazy-cascader-tag {
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  margin: 2px;
  text-overflow: ellipsis;
  background: #f0f2f5;
  > span {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  > .el-icon-close {
    -webkit-box-flex: 0;
    -ms-flex: none;
    flex: none;
    background-color: #c0c4cc;
    color: #fff;
  }
}
</style>
