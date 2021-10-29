
# 基于ele可搜索、可多选的Cascader 级联选择器



# lazy-cascader

> ElementUI 级联选择组件（Cascader）懒加载的拓展 


 ![image.png](https://upload-images.jianshu.io/upload_images/80274-8e35b51d940a39fa.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

# 为什么会有这个组件？

首先我们要问ElementUI的Cascader级联选择器懒加载的时候有什么问题。

1、为什么懒加载，多选的时候没有自带回显逻辑？

2、懒加载的时候怎么才能搜索出未加载的选项？

为了解决这两个问题，我在网上翻了很多博客，虽然找到了回显的解决方案，但是似乎并不是很完美，或者有部分bug，甚至有些是无用的代码。

# 该组件如何使用？

1、使用

```javascript
 
 //引入组件
import lazyCascader from '@/components/search-cascader/SearchCascader'

//声明组件
components: {
  LazyCascader
}

```

2、在template

```html

<lazy-cascader
          filterable
          :width="'2rem'"
          :searchWidth="'2.95rem'"
          :props="props2"
          :disabled="classify == 'type'"
          :show-all-levels="false"
          :placeholder="'全省流域'"
          clearable
          @change="cascaderChange"
          class="provinceScascader"
          :popper-class="'provincePopperScascader'"
        ></lazy-cascader>

```

4、支持的属性
|参数|说明|类型|可选值|默认值|
|---|---|---|---|---|
|v-model|选中项绑定值|-|-|-|
|props|配置选项，具体见下表|object|-|-|
|placeholder|输入框占位文本	|string|-|请选择|
|disabled|是否禁用|boolean|-|false|
|filterable|是否开启搜索|boolean|-|false|
|clearable|是否支持清空选项|boolean|-|false|
|width|组件的宽度，输入框和搜索框的宽度|string|-|400px|
|suggestionsPopperClass|搜索下拉列表的类名|string|-|suggestions-popper-class，注：默认suggestions-popper-class的样式为width: auto!important;|
|searchWidth|搜索框宽度|string|-|-，注：取值方式为width: searchWidth \| 100%|
|searchEmptyText|搜索框远程搜索无数据的时候展示的默认文案|string|-|暂无数据|


5、props配置项
|参数|说明|类型|可选值|默认值|
|---|---|---|---|---|
|multiple|是否多选	|boolean|-|false|
|checkStrictly|是否严格的遵守父子节点不互相关联|boolean|-|false|
|value|指定选项的值为选项对象的某个属性值|string|-|'value'|
|label|指定选项标签为选项对象的某个属性值	|string|-|'label'|
|leaf|指定选项的叶子节点的标志位为选项对象的某个属性值|string|-|leaf|
|lazyLoad|加载动态数据的方法|function(nodeValue, resolve)，node为当前点击的节点，resolve为数据加载完成的回调(必须调用),nodeValue根为0|-|-|
|lazySearch|动态搜索数据的方法|function(queryString, callback)，queryString为搜索时的关键字，callback为数据加载完成的回调(必须调用)|-|-|


6、支持事件change，当选择的值发生变化是触发

7、注意事项
大部分配置参数都同ElementUI的Cascader级联选择器，可参考其文档[ElementUI官方文档](https://element.eleme.cn/#/zh-CN/component/cascader)
lazySearch的callback返回一个数组，数组格式如下

```javascript

//其中value和label键值同props配置项的参数一致
[{value:[1,2,3,4],label:["服装鞋包", "流行男鞋", "凉鞋", "沙滩鞋"]}]

```

