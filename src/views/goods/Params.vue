<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert :closable="false" title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon></el-alert>
      <el-row>
        <el-col class="cat_opt">
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            :props="cateProps"
            @change="handleChange"
            clearable
            change-on-select
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button @click="addParams" :disabled="isBtbDisabled" type="primary" size="mini">添加参数</el-button>
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag
                  @close="handleClose(index, scope.row)"
                  closable
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditParamsDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="deletParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button @click="addParams" :disabled="isBtbDisabled" type="primary" size="mini">添加属性</el-button>
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag
                  @close="handleClose(index, scope.row)"
                  closable
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditParamsDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="deletParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog
      :title="activeName == 'many' ? '添加动态参数' : '添加静态属性'"
      :visible="addDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <el-form :rules="addFormRules" ref="addFormRef" :model="addForm" label-width="80px">
        <el-form-item prop="attr_name" :label="activeName == 'many' ? '动态参数' : '静态属性'">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addNewParams">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      :title="activeName == 'many' ? '修改动态参数' : '修改静态属性'"
      :visible="editDialogVisible"
      width="50%"
      @close="editDialogClose"
    >
      <el-form :rules="editFormRules" ref="editFormRef" :model="editForm" label-width="80px">
        <el-form-item prop="attr_name" :label="activeName == 'many' ? '动态参数' : '静态属性'">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editParams">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCateList,
  getParams, getOneParams, editParams, setNewParams,
  deleteOneParams, setTag
} from '../../network/goods'
export default {
  data () {
    return {
      addForm: {
        attr_name: ''
      },
      addFormRules: {
        attr_name: [{
          required: true,
          message: '请输入参数名称',
          trigger: 'blur'
        }]
      },
      editForm: {},
      editFormRules: {
        attr_name: [{
          required: true,
          message: '请输入参数名称',
          trigger: 'blur'
        }]
      },
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedCateKeys: [],
      cateList: [],
      activeName: 'many',
      manyTableData: [],
      onlyTableData: [],
      addDialogVisible: false,
      editDialogVisible: false
    }
  },
  computed: {
    isBtbDisabled () {
      if (this.selectedCateKeys.length != 3) return true
      return false
    },
    cateID () {
      if (this.selectedCateKeys.length == 3) {
        return this.selectedCateKeys[2]
      }
      return null
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async handleClose (index, row) {
      row.attr_vals.splice(index, 1)
      const { data: res } = await setTag(this.cateID, row.attr_id, row.attr_name, this.activeName, row.attr_vals)
      if (res.meta.status != 200) {
        return this.$message.error('删除失败！')
      }
      this.$message.success('删除成功！')
    },
    showInput (row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    async handleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }

      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false

      const { data: res } = await setTag(this.cateID, row.attr_id, row.attr_name, this.activeName, row.attr_vals)
      if (res.meta.status != 200) {
        return this.$message.error('设置失败！')
      }
      this.$message.success('设置成功！')
    },
    addParams () {
      this.addDialogVisible = true
    },
    editParams () {
      this.$refs.editFormRef.validate(async value => {
        if (!value) return
        const { data: res } = await editParams(this.cateID, this.editForm.attr_id, this.editForm.attr_name, this.activeName)
        if (res.meta.status != 200) return this.$message.error('修改失败')
        this.$message.success('修改成功')
        this.editDialogVisible = false
        this.getParamsData()
      })
    },
    addNewParams () {
      this.$refs.addFormRef.validate(async value => {
        if (!value) return
        const { data: res } = await setNewParams(this.cateID, this.addForm.attr_name, this.activeName)
        if (res.meta.status != 201) return this.$message.error('添加失败')
        this.$message.success('添加成功')

        this.addDialogVisible = false
        this.getParamsData()
      })
    },
    handleTabClick () {
      this.getParamsData()
    },
    async showEditParamsDialog (id) {
      this.editDialogVisible = true
      const { data: res } = await getOneParams(this.cateID, id, this.activeName)
      if (res.meta.status != 200) {
        return this.$message.error('读取数据失败！')
      }
      this.editForm = res.data
    },
    addDialogClose () {
      this.$refs.addFormRef.resetFields()
    },
    editDialogClose () {
      this.$refs.editFormRef.resetFields()
    },
    deletParams (id) {
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteP(id)
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    async deleteP (id) {
      const { data: res } = await deleteOneParams(this.cateID, id)
      if (res.meta.status != 200) {
        return this.$message.error('删除失败！')
      }
      this.$message.success('删除成功！')
      this.getParamsData()
    },
    async getParamsData () {
      const { data: res } = await getParams(this.cateID, this.activeName)
      if (res.meta.status != 200) {
        return this.$message.error('获取参数失败！')
      }
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      console.log(res.data)
      if (this.activeName == 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    handleChange () {
      if (this.selectedCateKeys.length != 3) {
        this.selectedCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      this.getParamsData()
    },
    async getCateList () {
      const { data: res } = await getCateList()
      if (res.meta.status != 200) {
        return this.$message.error('获取商品分类失败！')
      }
      this.cateList = res.data
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.input-new-tag {
  width: 150px;
  margin-left: 15px;
}
.el-tag,
.button-new-tag {
  margin-left: 15px;
}
</style>