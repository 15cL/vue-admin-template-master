<template>
  <el-dialog title="分配角色" :visible="showAssign" @close="btnCancel">
    <el-checkbox-group v-model="roleIds">
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" align="center" justify="center">
      <el-col :span="6">
        <el-button size="small" type="primary" @click="btnOk">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { assignRoles, getUserDetailById } from '@/api/user'
export default {
  props: {
    showAssign: {
      type: Boolean,
      default: false
    },
    // 用户id，用来查询当前用户的角色信息
    userId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      list: [],
      roleIds: []
    }
  },
  created() {
    this.getRoleList()
    this.getUserDetailById()
  },
  methods: {
    async getRoleList() {
      const { rows } = await getRoleList()
      this.list = rows
      console.log(this.list)
    },
    async getUserDetailById(id) {
      console.log(id)
      const { roleIds } = await getUserDetailById(id)
      this.roleIds = roleIds // 赋值本用户分配角色
      console.log(id)
    },

    async btnOk() {
      await assignRoles({ id: this.userId, roleIds: this.roleIds })
      //   关闭窗体
      this.$emit('update:showAssign', false)
    },

    async btnCancel() {
      this.roleIds = [] // 清空原来的数组
      this.$emit('update:showAssign', false)
    }
  }
}
</script>

<style>

</style>
