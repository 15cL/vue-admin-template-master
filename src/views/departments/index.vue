<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <!-- 实现页面的基本布局 -->
      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->
        <!-- 缺少treeNode -->
        <tree-tool :tree-node="company" :is-root="true" />
        <!--放置一个属性   这里的props和我们之前学习的父传子 的props没关系-->
        <el-tree :data="departs" :props="defaultProps" default-expand-all>
          <!-- 说明el-tree里面的这个内容 就是插槽内容 => 填坑内容  => 有多少个节点循环多少次 -->
          <!-- scope-scope 是 tree组件传给每个节点的插槽的内容的数据 -->
          <!-- 顺序一定是 执行slot-scope的赋值 才去执行 props的传值 -->
          <tree-tool slot-scope="obj" :tree-node="obj.data" @delDepts="getDepartments" @addDepts="addDepts" @editDepts="editDepts" />
        </el-tree>
      </el-card>
      <add-dept ref="addDept" :show-dialog.sync="showDialog" :tree-node="node" @addDepts="getDepartments" />
    </div>
  </div>
</template>

<script>
import treeTool from './components/tree-tool.vue'
import AddDept from './components/add-dept.vue' // 引入新增部门组件
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
export default {
  components: {
    treeTool, AddDept
  },
  data() {
    return {
      company: {},
      departs: [],
      defaultProps: {
        label: 'name' // 表示 从这个属性显示内容
      },
      showDialog: false,
      node: {},
      loading: false // 用来控制进度弹层的显示和隐藏
    }
  },

  created() {
    this.getDepartments()
  },
  methods: {

    // 获取数据
    async getDepartments() {
      this.loading = true
      const res = await getDepartments()
      this.departs = tranListToTreeData(res.depts, '')
      this.company = { name: res.companyName, manager: '负责人', id: '' }
      this.loading = false
    },

    //  开启弹窗,记录当前点击的部门
    addDepts(node) {
      this.showDialog = true // 添加部门弹窗
      this.node = node // 记录当前点击的部门
    },

    // 编辑部门节点
    editDepts(node) {
      this.showDialog = true // 打开弹窗
      this.node = node // 赋值操作的节点
      this.$refs.addDept.getDepartDetail(node.id) // 直接调用子组件中的方法 传入一个id
    }
  }
}
</script>

<style scoped>
.el-card {
  min-width: 380px;
  margin-right: 20px;
}
</style>
