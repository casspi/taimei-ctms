<template>
  <div class="login-wrap">
    <div class="login-inner">
      <div class="login-info">
        <span>欢迎登录</span>
        <i></i>
        <h1>{{ metadata.title }}</h1>
        <p>{{ metadata.subtitle }}</p>
      </div>
      <div class="login-content" @keyup.enter="handleSubmit">
        <h2>用户登录</h2>
        <ElForm
          class="form-section"
          label-position="top"
          size="large"
          ref="formInstance"
          :model="objForm"
          :rules="objFormRules"
          @submit="handleSubmit"
        >
          <ElFormItem prop="userId">
            <ElInput
              v-model="objForm.userId"
              prefix-icon="User"
              :disabled="loading"
              clearable
              placeholder="请填写账号"
            />
          </ElFormItem>
          <ElFormItem prop="password">
            <ElInput
              v-model="objForm.password"
              type="password"
              prefix-icon="Lock"
              :disabled="loading"
              clearable
              placeholder="请填写密码"
              autocomplete="new-password"
              show-password
            />
          </ElFormItem>
          <ElFormItem prop="code">
            <ElInput
              v-model="objForm.code"
              prefix-icon="Key"
              :disabled="loading"
              clearable
              maxlength="4"
              placeholder="请填写验证码"
            >
              <template #append>
                <div class="captcha-box" @click="handleCaptchaTrigger()">
                  <img
                    v-if="captchaInfo"
                    class="captcha-img"
                    :src="captchaInfo.base64EncodeImg"
                    alt="图形验证"
                  />
                </div>
              </template>
            </ElInput>
          </ElFormItem>
          <ElFormItem prop="isRemember">
            <ElCheckbox v-model="objForm.isRemember" label="记住密码" :disabled="loading" />
          </ElFormItem>
          <ElFormItem>
            <ElButton class="form-button" type="primary" :loading="loading" @click="handleSubmit">
              登 录
            </ElButton>
          </ElFormItem>
        </ElForm>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useAsyncTask } from '@daysnap/vue-use'
  import md5 from 'md5'

  import { doAdminUserLogin, doCaptchaCheck, reqCaptchaInfo } from '@/api'
  import { useForm } from '@/hooks'
  import { metadata } from '@/metadata'
  import { useUserinfoStore } from '@/stores'
  import { accountInfoStorage } from '@/utils'

  // 表单
  const [formInstance, objForm, objFormRules] = useForm(
    {
      userId: 'admin',
      password: 'admin',
      code: '',
      isRemember: false,
      ...accountInfoStorage.getItem({}),
    },
    {
      userId: [{ required: true, message: '请填写账号', trigger: 'blur' }],
      password: [{ required: true, message: '请填写密码', trigger: 'blur' }],
      code: [{ required: true, message: '请填写验证码', trigger: 'blur' }],
    },
  )

  // 图形验证
  const { data: captchaInfo, trigger: handleCaptchaTrigger } = useAsyncTask(
    async () => {
      const { img, ...rest } = await reqCaptchaInfo()
      return { ...rest, base64EncodeImg: `data:image/gif;base64,${img}` }
    },
    {
      immediate: true,
      throwError: true,
    },
  )

  // 登录
  const router = useRouter()
  const { setUserinfo } = useUserinfoStore()
  const { loading, trigger: handleSubmit } = useAsyncTask(
    async () => {
      await formInstance.value.validate().throw()
      try {
        const { code, userId, password, isRemember } = objForm
        await doCaptchaCheck({ code, sessionId: captchaInfo.value!.token })
        const data = await doAdminUserLogin({ userId, password: md5(password) })
        setUserinfo({ ...data, userId })
        accountInfoStorage.setItem(isRemember ? { userId, password, isRemember } : { isRemember })
        router.replace('/')
        ElMessage.success(`登录成功`)
      } catch (err) {
        handleCaptchaTrigger()
        throw err
      }
    },
    {
      throwError: true,
    },
  )
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
  $color-primary: rgb(10, 71, 237);
  // px
  .login-wrap {
    @extend %pr;
    @extend %bsb;
    @extend %df;
    @extend %aic;
    @extend %jcc;
    width: 100%;
    min-height: 100vh;
    padding: 80px 0px;
    background: rgb(249, 249, 249);
    // background-image: linear-gradient(45deg, rgb(244, 245, 246), #316cf1);
    &::after,
    &::before {
      @extend %pa;
      content: '';
      width: j(266 * 0.7);
      height: j(259 * 0.7);
      background: url('@/assets/img/icon-decoration.png') center no-repeat;
      background-size: contain;
    }
    &::after {
      @extend %t0;
      @extend %r0;
    }
    &::before {
      @extend %b0;
      @extend %l0;
    }
  }
  .login-inner {
    @extend %pr;
    @extend %df;
    @extend %aic;
    @extend %bsb;
    padding: 0 50px;
    z-index: 1;
    margin: auto;
    width: 100%;
    max-width: 1200px;
    height: 480px;
    border-radius: 20px;
    background-image: linear-gradient(45deg, #316cf1, #0d2266);
    &::before {
      @extend %pa;
      @extend %t0;
      @extend %l0;
      content: '';
      width: j(266 * 0.7);
      height: j(259 * 0.7);
      background: url('@/assets/img/icon-decoration.png') center no-repeat;
      background-size: contain;
    }
    @include meta(login-inner) {
      padding: 0 20px;
    }
  }
  .login-info {
    @extend %df1;
    @extend %df;
    @extend %fdc;
    @extend %cfff;
    span {
      @extend %fwb;
      font-size: 38px;
    }
    i {
      width: 36px;
      height: 4px;
      margin-top: 24px;
      background-color: #fff;
    }
    h1 {
      @extend %fwb;
      margin-top: 46px;
      font-size: 48px;
    }
    p {
      font-size: 28px;
      margin-top: 16px;
    }
    @include meta(login-info) {
      display: none;
    }
  }
  .login-content {
    @extend %w100;
    @extend %ma;
    @extend %bsb;
    @extend %pr;
    @extend %df;
    @extend %fdc;
    @extend %aic;
    @extend %jcc;
    padding: 60px 50px;
    border-radius: 20px;
    max-width: 500px;
    background-color: #fff;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    h2 {
      @extend %fwb;
      font-size: 42px;
      color: $color-primary;
    }
    @include meta(login-content) {
      padding: 48px 32px;
    }
  }
  .form-section {
    @extend %db;
    @extend %w100;
    margin-top: 48px;
    :deep {
      .el-input__wrapper {
        --el-input-height: 50px;
      }
    }
  }
  .form-button {
    width: 100%;
    background-color: $color-primary;
    border-color: $color-primary;
    --el-button-size: 50px;
    --el-font-size-base: 18px;
  }
  .captcha-box {
    @extend %db;
    @extend %cp;
    // height: 24px;
    // width: 80px;
    height: 38px;
    background-color: #f2f2f2;
    img {
      @extend %db;
      @extend %h100;
      @extend %w100;
      object-fit: cover;
    }
  }
</style>
