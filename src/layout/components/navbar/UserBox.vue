<template>
  <div class="layout-user-box">
    <ElBadge :value="5" :max="99" class="task-item">
      <ElButtonGroup class="mb-4">
        <ElButton size="small" round color="#435c70" type="primary">新建</ElButton>
        <ElButton size="small" round color="#435c70" type="primary"> 任务中心 </ElButton>
      </ElButtonGroup>
    </ElBadge>
    <ElIcon><MostlyCloudy /></ElIcon>

    <ElDropdown size="small" trigger="hover">
      <ElIcon><Orange /></ElIcon>
      <template #dropdown>
        <ElDropdownMenu>
          <ElDropdownItem>English (US) </ElDropdownItem>
          <ElDropdownItem divided>中文 (简体) </ElDropdownItem>
        </ElDropdownMenu>
      </template>
    </ElDropdown>

    <ElDropdown size="small" trigger="hover">
      <ElIcon><QuestionFilled /></ElIcon>
      <template #dropdown>
        <ElDropdownMenu>
          <ElDropdownItem>常见问题 </ElDropdownItem>
          <ElDropdownItem>使用支持 </ElDropdownItem>
          <ElDropdownItem>我要上报 </ElDropdownItem>
          <ElDropdownItem>问题追踪 </ElDropdownItem>
        </ElDropdownMenu>
      </template>
    </ElDropdown>

    <ElIcon><Bell /></ElIcon>

    <span class="user-name">{{ name }}</span>

    <ElDropdown trigger="hover">
      <div class="layout-user-content">
        <ElIcon size="22">
          <SwitchButton />
        </ElIcon>
      </div>
      <template #dropdown>
        <p v-if="role" class="layout-user-prompt">角色：{{ role }}</p>
        <ElDropdownMenu>
          <ElDropdownItem @click="handlePasswordChange">修改密码</ElDropdownItem>
          <ElDropdownItem divided @click="handleExit">安全退出</ElDropdownItem>
        </ElDropdownMenu>
      </template>
    </ElDropdown>

    <ProDialogForm ref="proDialogFormInstance" />
  </div>
</template>

<script setup lang="ts">
  import type { ElBadge } from 'element-plus'
  import md5 from 'md5'

  import { doAdminUserPasswordChange } from '@/api'
  import { type ProDialogFormMetadata, useProDialogForm } from '@/components'
  import { useUserinfoStore } from '@/stores'

  const router = useRouter()
  const { logout, userinfo } = useUserinfoStore()

  const name = computed(() => {
    return userinfo?.username
  })

  const role = computed(() => {
    const { roles = [] } = userinfo || {}
    return roles[0] ?? ''
  })

  // 编辑 or 新增
  const [proDialogFormInstance, handlePasswordChange] = useProDialogForm(
    () => {
      const metadata: ProDialogFormMetadata = {
        oldPassword: {
          label: '旧密码',
          value: '',
          is: 'form-input',
          props: {
            type: 'password',
            showPassword: true,
            autocomplete: 'new-password',
          },
          rules: [{ required: true }],
        },
        password: {
          label: '新密码',
          value: '',
          is: 'form-input',
          get: (v) => md5(v),
          props: {
            type: 'password',
            showPassword: true,
            autocomplete: 'new-password',
          },
          rules: [{ required: true }],
        },
        confirmPassword: {
          label: '确认密码',
          value: '',
          is: 'form-input',
          get: (v) => md5(v),
          props: {
            type: 'password',
            showPassword: true,
            autocomplete: 'new-password',
          },
          rules: [
            { required: true },
            {
              validator: (_, v) => {
                return metadata.password.value === v
              },
              message: '两次密码输入不一致',
            },
          ],
        },
      }
      return metadata
    },
    async (metadata, instance) => {
      await instance.value.show({
        title: '修改密码',
        metadata,
        request: (params) => doAdminUserPasswordChange(params),
      })
      logout()
      ElMessage.success('操作成功，请使用新密码登录')
    },
  )

  const handleExit = async () => {
    await ElMessageBox.confirm(`确认是否退出该账号？`)
    logout()
    router.replace('/login')
    ElMessage.success(`退出成功`)
  }
</script>

<style lang="scss" scoped>
  @use '@/layout/styles/define.scss' as *;

  .layout-user-box {
    display: flex;
    color: #435c70 !important;
    gap: 6px;
    align-items: center;
    i {
      font-size: 16px;
      cursor: pointer;
      &:focus-visible {
        outline: none;
      }
    }
    .user-name {
      font-size: 14px;
      color: #333;
    }
  }
  .task-item {
    margin-right: 20px;
  }
  .layout-user-prompt {
    margin-right: 10px;
    @extend %wsn;
    @extend %c3;
    padding: 12px 16px;
    font-size: 14px;
  }
  .layout-user-content {
    @extend %df;
    @extend %aic;
    @extend %cp;
    outline: none;
    font-size: 14px;
    padding: 0 15px;
    span {
      @extend %twno;
      max-width: 60px;
      margin-right: 5px;
    }
    img {
      width: 24px;
      height: 24px;
      margin-right: 5px;
    }
  }
</style>
