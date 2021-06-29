<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table
        class="tree-table"
        :show-row-hover="false"
        border
        index-text="#"
        show-index
        :expand-type="false"
        :selection-type="false"
        :data="catelist"
        :columns="columns"
      >
        <template v-slot:isOK="scope">
          <i style="color:green" class="el-icon-success" v-if="scope.row.cat_deleted === false"></i>
          <i style="color:red" class="el-icon-error" v-else></i>
        </template>
        <template v-slot:order="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <template v-slot:opt="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="showEditCateDialog(scope.row.cat_id)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="deletCate(scope.row.cat_id)"
          >删除</el-button>
        </template>
      </tree-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      @close="addCateDialogClosed"
      :visible="addCatedialogVisible"
      width="50%"
    >
      <el-form
        label-width="100px"
        ref="addCateFormRef"
        :model="addCateForm"
        :rules="addCateFormRules"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addCatedialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <!---修改分类对话框 -->
    <el-dialog
      title="修改分类"
      @close="editCateDialogClosed"
      :visible="editCateDialogVisible"
      width="50%"
    >
      <el-form
        label-width="100px"
        ref="editCateFormRef"
        :model="editCateForm"
        :rules="editCateFormRules"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editCate">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getCateList, getOneCateList, getParentCateList, setNewCate, deleteCate, editCate } from '../../network/goods'

export default {
  data () {
    return {
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      catelist: [],
      parentCateList: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isOK'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      addCatedialogVisible: false,
      editCateDialogVisible: false,
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addCateFormRules: {
        cat_name: [{
          required: true,
          message: '请输入分类名称',
          trigger: 'blur'
        }]
      },
      editCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      editCateFormRules: {
        cat_name: [{
          required: true,
          message: '请输入分类名称',
          trigger: 'blur'
        }]
      },
      selectedKeys: []
    }
  },
  created () {
    this.getCateList()
  },
  methods: {

    handleSizeChange (val) {
      this.queryInfo.pagesize = val
      this.getCateList()
    },
    handleCurrentChange (val) {
      this.queryInfo.pagenum = val
      this.getCateList()
    },
    showAddCateDialog () {
      this.getParentCateList()
      this.addCatedialogVisible = true
    },
    parentCateChange () {
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    addCate () {
      this.$refs.addCateFormRef.validate(async value => {
        console.log(this.addCateForm);
        if (!value) return
        const { data: res } = await setNewCate(this.addCateForm)
        if (res.meta.status != 201) return this.$message.error('添加分类失败')
        this.$message.success('添加分类成功!')
        this.getParentCateList()
        this.addCatedialogVisible = false
      })
    },
    addCateDialogClosed () {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    editCateDialogClosed () {
      this.$refs.editCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    deletCate (id) {
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteCategory(id)
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    showEditCateDialog (id) {
      this.getOneCateList(id)
      this.editCateDialogVisible = true
    },
    editCate () {
      this.$refs.editCateFormRef.validate(async value => {
        if (!value) return
        const { data: res } = await editCate(this.editCateForm)
        if (res.meta.status != 200) return this.$message.error('修改分类失败')
        this.getCateList()
        this.$message.success('修改分类成功!')
        this.editCateDialogVisible = false
      })
    },
    async getOneCateList (id) {
      const { data: res } = await getOneCateList(id)
      if (res.meta.status != 200) {
        return this.$message.error('获取失败')
      }
      this.editCateForm = res.data
    },
    async getParentCateList () {
      const { data: res } = await getParentCateList(2)
      if (res.meta.status != 200) return this.$message.error('获取父级失败')
      this.parentCateList = res.data
    },
    async getCateList () {
      const { data: res } = await getCateList(this.queryInfo)
      if (res.meta.status != 200) return this.$message.error('获取失败')
      this.catelist = res.data.result
      this.total = res.data.total
    },
    async deleteCategory (id) {
      const { data: res } = await deleteCate(id)
      if (res.meta.status != 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.getCateList()
    },
  }
}

</script>
<style scoped>
.tree-table {
  margin-top: 10px;
}
.el-cascader {
  width: 100%;
}
</style>