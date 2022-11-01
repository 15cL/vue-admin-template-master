<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="角色管理">
            <el-row style="height:60px">
              <el-button icon="el-icon-plus" size="small" type="primary" @click="addRole">新增角色</el-button>
            </el-row>
            <el-table :data="list">
              <el-table-column align="center" label="序号" type="index" width="120px" />
              <el-table-column align="center" label="角色名称" prop="name" width="240px" />
              <el-table-column align="center" label="描述" prop="description" />
              <el-table-column align="center" label="操作">
                <template slot-scope="{row}">
                  <el-button size="small" type="success" @click="giveRole(row.id)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRole(row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="delRole(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>

            <!-- 分页组件 -->
            <el-row type="flex" align="middle" justify="center" style="height: 60px">
              <!-- 分页组件 -->
              <el-pagination
                :current-page="page.page"
                :page-size="page.pagesize"
                :total="page.total"
                layout="prev, pager, next"
                @current-change="changePage"
              />
            </el-row>

            <edit-role :show-dialog="showDialog" :role-form="roleForm" @getRoleList="getRoleList" @closeRole="closeRole" />
            <assignRole ref="assignRole" :show-assign.sync="showAssign" :user-id="userId" />
            <!-- 公司信息 -->
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />

            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input v-model="formData.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" type="textarea" :rows="3" disabled style="width:400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getCompanyInfo, getRoleList, deleteRole, getRoleDetail } from '@/api/setting'
import { mapGetters } from 'vuex'
import EditRole from './components/edit-role.vue'
import assignRole from './components/assign-role.vue'
export default {
  components: {
    EditRole, assignRole
  },
  data() {
    return {
      list: [],
      page: {
        page: 1, // 页数
        pagezise: 10, // 每页显示条目个数
        total: 10 // 记录总数
      },
      formData: [],
      showDialog: false,
      roleForm: {},
      showAssign: false,
      userId: ''
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    this.getRoleList() // 获取角色列表
    this.getCompanyInfo() // 获取公司信息
  },

  methods: {

    // 获取角色列表
    async getRoleList() {
      const { rows, total } = await getRoleList(this.page)
      this.page.total = total
      this.list = rows
    },

    // 翻页函数
    changePage(newPage) {
      this.page.page = newPage // 将当前页码赋值给当前的最新页码
      this.getRoleList()
    },

    // 删除角色
    async delRole(id) {
      try {
        await this.$confirm('确认删除该角色吗')
        await deleteRole(id) // 调用删除接口
        this.getRoleList() // 重新加载数据
        this.$message.success('删除角色成功')
      } catch (error) {
        console.log(error)
      }
      console.log(id)
    },
    // 获取公司信息
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId)
    },

    // 编辑角色
    async editRole(id) {
      this.roleForm = await getRoleDetail(id)
      this.showDialog = true
    },

    // 关闭弹窗
    async closeRole(val) {
      if (val) {
        this.roleForm = { name: '', description: '' }
      }
      this.showDialog = false
    },

    // 新增角色
    async addRole() {
      this.roleForm = { name: '', description: '' }
      this.showDialog = true
    },

    // 分配角色
    async giveRole(id) {
      this.userId = id
      await this.$refs.assignRole.getRoleList(id) // 有点小问题
      this.showAssign = true
    }
  }
}
</script>

<style>

</style>
