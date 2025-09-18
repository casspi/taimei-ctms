<template>
  <ElDropdown class="layout-user-box" trigger="hover">
    <div class="layout-user-content">
      <img src="@/assets/img/avatar.png" alt="头像" />
      <span>{{ name }}</span>
      <ElIcon>
        <CaretBottom />
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
</template>

<script setup lang="ts">
  import { CaretBottom } from '@element-plus/icons-vue'
  import md5 from 'md5'

  import { doAdminUserPasswordChange } from '@/api'
  import { type ProDialogFormMetadata, useProDialogForm } from '@/components'
  import { useUserinfoStore } from '@/stores'

  const router = useRouter()
  const { logout, userinfo } = useUserinfoStore()

  const name = computed(() => {
    return userinfo?.name ?? userinfo?.userId ?? userinfo?.loginId ?? ''
  })

  const role = computed(() => {
    const { roleNames } = userinfo || {}
    return roleNames ? (roleNames[0] ?? '') : ''
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

  .layout-user-prompt {
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
