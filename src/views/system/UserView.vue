<template>
  <div class="c-flex">
    <div class="c-sidebar">
      <ElTreeSelect
        :model-value="unitId"
        :data="units"
        style="margin-bottom: 12px"
        check-strictly
        :props="{ label: 'text' }"
        @node-click="handleUnitChange"
      />
      <ElTree
        ref="elTreeInstance"
        :props="{ label: 'text' }"
        :data="departments"
        :expand-on-click-node="false"
        default-expand-all
        highlight-current
        node-key="value"
        @node-click="handleNodeClick"
      />
    </div>
    <div class="c-display-inner">
      <ProTable :request="handleRequest" :query-metadata="queryMetadata" ref="proTableInstance">
        <template #actions>
          <ProActionButton
            :pd="PD.system.user.enable"
            type="warning"
            :loading="loading"
            :disabled="!selectedUserList.length"
            plain
            @click="handleUpdateStatus({ status: '0', selectAll: false })"
          >
            启用
          </ProActionButton>

          <ProActionButton
            :pd="PD.system.user.enable"
            type="warning"
            :loading="loading"
            plain
            @click="handleUpdateStatus({ status: '0', selectAll: true })"
          >
            启用全部
          </ProActionButton>
          <ProActionButton
            :pd="PD.system.user.disable"
            type="warning"
            :loading="loading"
            :disabled="!selectedUserList.length"
            plain
            @click="handleUpdateStatus({ status: '9', selectAll: false })"
          >
            停用
          </ProActionButton>

          <ProActionButton
            :pd="PD.system.user.disable"
            type="warning"
            :loading="loading"
            plain
            @click="handleUpdateStatus({ status: '9', selectAll: true })"
          >
            停用全部
          </ProActionButton>
          <ProActionButton
            :pd="PD.system.user.added"
            type="primary"
            plain
            icon="Plus"
            @click="handleAddedOrUpdate()"
          >
            新增
          </ProActionButton>
        </template>

        <ElTableColumn type="selection" width="55" />

        <ElTableColumn label="用户" min-width="220">
          <template #default="scope">
            <ul>
              <li>姓名：{{ scope.row.name || '-' }}</li>
              <li>手机：{{ scope.row.mobile || '-' }}</li>
              <li>角色：{{ scope.row.roleName || '-' }}</li>
            </ul>
          </template>
        </ElTableColumn>

        <ElTableColumn prop="statusName" label="状态">
          <template #default="scope">
            <ElTag :type="scope.row.status + '' === '0' ? 'success' : 'danger'">
              {{ scope.row.statusName }}
            </ElTag>
          </template>
        </ElTableColumn>

        <ElTableColumn label="时间" width="220px">
          <template #default="scope">
            <ul>
              <li>最后登录：{{ scope.row.loginTime || '-' }}</li>
              <li>登录次数：{{ scope.row.loginTimes || '-' }}</li>
              <li>创建：{{ scope.row.createTime || '-' }}</li>
              <li>更新：{{ scope.row.modifyTime || '-' }}</li>
            </ul>
          </template>
        </ElTableColumn>

        <ProTableActionsColumn :pds="[PD.system.user.edit, PD.system.integral.list]" width="120">
          <template #default="scope">
            <ProTableActionButton
              :pd="PD.system.user.edit"
              link
              type="primary"
              @click="handleAddedOrUpdate(scope.row)"
            >
              编辑
            </ProTableActionButton>
            <!-- <ProTableActionButton
              :pd="PD.system.user.delete"
              link
              type="danger"
              @click="handleDelete(scope.row)"
            >
              删除
            </ProTableActionButton> -->
            <ProTableActionButton
              :pd="PD.system.integral.list"
              type="primary"
              @click="handleIntegralTable(scope.row)"
            >
              积分管理
            </ProTableActionButton>
          </template>
        </ProTableActionsColumn>
      </ProTable>
    </div>
  </div>

  <ProDialogForm ref="proDialogFormInstance" />
</template>

<script setup lang="ts">
  import banana from '@daysnap/banana'
  import { omit } from '@daysnap/utils'
  import { useAsyncTask } from '@daysnap/vue-use'
  import type { ElTree } from 'element-plus'
  import md5 from 'md5'

  import {
    DictType,
    doUserCreate,
    doUserDelete,
    doUserDisable,
    doUserEnable,
    doUserUpdate,
    reqDictInfo,
    reqRoleList,
    reqUserDepartmentTree,
    reqUserUnitTree,
  } from '@/api'
  import { reqUserInfo, reqUserList } from '@/api'
  import { type ProDialogFormMetadata, useProDialogForm, useProTable } from '@/components'
  import { multipleSelectionKey } from '@/components/ProTableList/selection'
  import { PD } from '@/stores'
  import type { TreeItem, User } from '@/types'
  import { getKeywordFields, phoneRule, withPagingParams } from '@/utils'

  import { useIntegralTable } from './useIntegralTable'

  // 单位
  const unitId = ref('all')
  const { data: units } = useAsyncTask(async () => reqUserUnitTree(), {
    immediate: true,
    throwError: true,
  })
  const handleUnitChange = (item: TreeItem) => {
    unitId.value = item.value
    selected.value = void 0
    handleReqDepartments()
    proTableInstance.value.reload()
  }

  // 部门
  const selected = ref<TreeItem>()
  const elTreeInstance = ref<InstanceType<typeof ElTree>>() // tree instance
  const { data: departments, trigger: handleReqDepartments } = useAsyncTask(
    async () => {
      let list: TreeItem[] = []
      if (unitId.value) {
        list = await reqUserDepartmentTree({ unitId: unitId.value })
      }
      // fix el-tree current-node-key bug
      setTimeout(() => {
        nextTick(() => elTreeInstance.value?.setCurrentKey(selected.value?.value))
      }, 0)
      return list
    },
    {
      throwError: true,
    },
  )
  const handleNodeClick = async (item: TreeItem) => {
    selected.value = item
    nextTick(() => elTreeInstance.value?.setCurrentKey(item.value))
    proTableInstance.value.reload()
  }

  // 列表
  let queryParams: Record<string, any> = {}
  const [queryMetadata, proTableInstance, handleRequest] = useProTable(
    {
      ...getKeywordFields(),
      name: {
        is: 'form-input',
        value: '',
        label: '姓名',
      },
      status: {
        is: 'form-select',
        value: '',
        label: '状态',
        options: [
          { label: '启用', value: '0' },
          { label: '停用', value: '9' },
        ],
      },
    },
    async ([currentPage, pageSize], query) => {
      let departmentId = selected.value?.value || ''
      if (departmentId === unitId.value) {
        departmentId = ''
      }
      query = {
        currentPage,
        pageSize,
        unitId: unitId.value === 'all' ? '' : unitId.value,
        departmentId,
        ...query,
      }
      const { dataList, total } = await reqUserList(query)
      queryParams = query
      return [dataList, total]
    },
  )

  const { data: mapOptions } = useAsyncTask(
    async () => {
      const [units, alertTypes, departments, sexOptions, roles] = await Promise.all([
        reqDictInfo(DictType.DIC_UNIT),
        reqDictInfo(DictType.DIC_REGISTER_ALERT_TYPE),
        reqDictInfo(DictType.DIC_UNIT_DEPARTMENT),
        reqDictInfo(DictType.DIC_SEX),
        withPagingParams(reqRoleList)(),
      ])
      return { units, alertTypes, departments, sexOptions, roles }
    },
    {
      immediate: true,
      throwError: true,
      initialValue: { units: [], alertTypes: [], departments: [], sexOptions: [], roles: [] },
    },
  )
  // 编辑 or 新增
  const [proDialogFormInstance, handleAddedOrUpdate] = useProDialogForm<User>(
    () => {
      const metadata: ProDialogFormMetadata = {
        id: {
          label: '用户名',
          value: '',
          is: 'form-input',
          rules: [{ required: true }],
        },
        name: {
          label: '姓名',
          value: '',
          is: 'form-input',
          rules: [{ required: true }],
        },
        image: {
          label: '头像',
          value: '',
          is: 'form-image-upload',
          width: '100%',
        },
        password: {
          label: '密码',
          value: '',
          is: 'form-input',
          get: (v) => (v ? md5(v) : {}),
          props: {
            type: 'password',
            showPassword: true,
            autocomplete: 'new-password',
          },
        },
        confirmPassword: {
          label: '确认密码',
          value: '',
          is: 'form-input',
          get: (v) => (v ? md5(v) : {}),
          props: {
            type: 'password',
            showPassword: true,
            autocomplete: 'new-password',
          },
          rules: [
            {
              validator: (_, v) => {
                return metadata.password.value === v
              },
              message: '两次密码输入不一致',
            },
          ],
        },
        sex: {
          label: '性别',
          is: 'form-radio',
          value: '',
          options: [
            { label: '男', value: 0 },
            { label: '女', value: 1 },
            { label: '未知', value: 2 },
          ],
        },
        idnumber: {
          label: '身份证',
          value: '',
          is: 'form-input',
          props: {
            maxlength: 18,
          },
        },
        unitId: {
          label: '单位',
          value: '',
          is: 'form-select',
          options: [],
          rules: [{ required: true }],
        },
        masterDepartmentId: {
          label: '负责部门',
          value: '',
          is: 'form-tree-select',
          options: [],
        },
        departmentId: {
          label: '所属部门',
          value: '',
          is: 'form-tree-select',
          options: [],
        },
        roleId: {
          label: '角色',
          value: '',
          is: 'form-select',
          labelKey: 'name',
          valueKey: 'id',
          options: [],
          set: (s, f) => {
            const { roleId } = s
            if (roleId) {
              f.value = roleId[0] || ''
            }
          },
        },
        birthday: {
          label: '出生日期',
          value: '',
          is: 'form-date-picker',
        },
        mobile: {
          label: '手机号',
          value: '',
          is: 'form-input',
          props: {
            maxlength: 11,
          },
          rules: [phoneRule],
        },
        phone: {
          label: '固定电话',
          value: '',
          is: 'form-input',
        },
        email: {
          label: '邮箱',
          value: '',
          is: 'form-input',
        },
        dateTime: {
          label: '账户生效时间',
          value: [],
          is: 'form-date-picker',
          width: '100%',
          get: (v) => {
            const [validTime, expireTime] = v
            return { validTime, expireTime }
          },
          set: (d, f) => {
            const { validTime, expireTime } = d
            if (validTime && expireTime) {
              f.value = [validTime, expireTime]
            }
          },
          props: {
            type: 'datetimerange',
            defaultTime: new Date(2000, 1, 1, 10, 0, 0),
          },
        },
        alertType: {
          label: '提醒方式',
          value: '',
          is: 'form-radio',
          options: [],
        },
        address: {
          label: '固定地址',
          value: '',
          is: 'form-input',
          width: '100%',
          props: {
            type: 'textarea',
          },
        },
        description: {
          label: '备注',
          value: '',
          is: 'form-input',
          width: '100%',
          props: {
            type: 'textarea',
          },
        },
      }
      return metadata
    },
    async (metadata, instance, item) => {
      metadata.sex.options = mapOptions.value.sexOptions
      metadata.masterDepartmentId.options = mapOptions.value.departments
      metadata.departmentId.options = mapOptions.value.departments
      metadata.alertType.options = mapOptions.value.alertTypes
      metadata.unitId.options = mapOptions.value.units
      metadata.roleId.options = mapOptions.value.roles.filter(
        (item) => !['DOCTOR', 'VOLUNTEER', 'PATIENT'].includes(item.id),
      )

      if (item) {
        const res = await reqUserInfo({ id: item.id })
        banana.assignment(res, metadata as any)

        if (item.password) {
          metadata.password.props!.placeholder = new Array(32).fill('*').join('')
          metadata.confirmPassword.props!.placeholder = new Array(32).fill('*').join('')
        }

        // 编辑
        ;['id', 'mobile'].forEach((key) => {
          const { value, props } = metadata[key]
          metadata[key].props = Object.assign({}, props, { disabled: !!value })
        })
      }

      await instance.value.show({
        title: item ? '编辑' : '新增',
        metadata,
        request: (params) => (item ? doUserUpdate({ ...item, ...params }) : doUserCreate(params)),
      })
      proTableInstance.value.reload()
      ElMessage.success('操作成功')
    },
  )

  // 删除
  const handleDelete = async (item: User) => {
    await ElMessageBox.confirm(`确认删除该数据？`)

    const { id } = item
    await doUserDelete({ id })
    proTableInstance.value.reload()
    ElMessage.success('操作成功')
  }

  // 积分管理
  const [, handleIntegralTable] = useIntegralTable({
    instance: proDialogFormInstance,
  })

  // 禁用 or 启用
  const selectedUserList = ref<User[]>([])
  provide(multipleSelectionKey, selectedUserList)
  const { loading, trigger: handleUpdateStatus } = useAsyncTask(
    async (options: { status: '0' | '9'; selectAll: boolean }) => {
      await ElMessageBox.confirm(`确认执行该操作？`)

      const { status, selectAll } = options
      const params: any = { ...omit(queryParams, ['pageSize', 'currentPage']), selectAll }
      if (!selectAll) {
        params.ids = selectedUserList.value.map((item) => item.id)
      }
      if (status === '0') {
        await doUserEnable(params)
      } else {
        await doUserDisable(params)
      }
      proTableInstance.value.reload()
      ElMessage.success('操作成功')
    },
    {
      throwError: true,
    },
  )
</script>
