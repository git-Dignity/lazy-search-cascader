
# 基于ele可搜索、可多选的Cascader 级联选择器



# lazy-search-cascader

> ElementUI 级联选择组件（Cascader）懒加可搜索的拓展 

标签全显示如下：

![1](https://gitee.com/zhengzem/graphic-bed/raw/master/img/20211102110852.png)

标签只显示一行如下：

![2](https://gitee.com/zhengzem/graphic-bed/raw/master/img/20211102110905.png)

# 组件为何存在？

首先我们要问ElementUI的Cascader级联选择器懒加载的时候有什么问题。

1、基于Cascader 级联选择器组件添加搜索功能，搜索的时候调后端接口，官网搜索样式不适用

官网搜索是前端实现的，但前端实现只能对目前已有数据进行搜索，就搜索不到以外的数据了。


2、懒加载的时候怎么才能搜索出未加载的选项？

搜索选中的话，如果级联选择组件数据没有这条数据的话，就往对应的层级数据push一条。


为了解决这两个问题，所以他lazy-search-cascader来了。

# 该组件如何使用？

1、使用

```javascript
 
 //引入组件
import lazyCascader from "@/components/search-cascader"

//声明组件
components: {
  LazyCascader
}

```

2、在template

```html

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

```

4、支持的属性
|参数|说明|类型|可选值|默认值|
|---|---|---|---|---|
|v-model|选中项绑定值|-|-|-|
|props|配置选项，具体见下表|object|-|-|
|placeholder|输入框占位文本	|string|-|请选择|
|separator|label连接符	|string|-|请选择|
|showAllLevels|输入框中是否显示选中值的完整路径	|boolean|-|true|
|popperClass|为el-cascader-panel级联面板添加class	|string|-|popperScascader|
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
[{value:['HD',2,'H415sds'],label:["珠江三角洲", "大型", "大河水库"]}]

```

