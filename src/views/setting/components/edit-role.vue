<template>
  <el-dialog title="编辑信息" :visible="showDialog" @close="btnCancel">
    <el-form ref="roleForm" :model="roleForm" label-width="120px" :rules="rules">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="roleForm.name" />
      </el-form-item>
      <el-form-item label="角色描述">
        <el-input v-model="roleForm.description" />
      </el-form-item>
    </el-form>
    <el-row type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" @click="btnCancel">取消</el-button>
        <el-button size="small" type="primary" @click="btnOk">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { updateRole, addRole } from '@/api/setting'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    // eslint-disable-next-line vue/require-default-prop
    roleForm: {
      type: Object,
      require: true
    }
  },
  data() {
    return {
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    async btnOk() {
      try {
        await this.$refs.roleForm.validate()
        // 只有校验通过的情况下 才会执行await的下方内容
        // roleForm这个对象有id就是编辑 没有id就是新增
        if (this.roleForm.id) {
          await updateRole(this.roleForm)
        } else {
          await addRole(this.roleForm)
        }
        this.$emit('getRoleList')
        this.$message.success('操作成功')
        this.$emit('closeRole', 0)
      } catch (error) {
        console.log(error)
      }
    },

    async btnCancel() {
      this.$emit('closeRole', 0)
      // 移除校验
      this.$refs.roleForm.resetFields()
    }
  }
}
</script>

<style>

</style>
