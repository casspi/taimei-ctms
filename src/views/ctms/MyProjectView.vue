<template>
  <div class="project-warp">
    <div class="project-infos-l">
      <div class="project-infos-title">我的项目</div>
    </div>
    <div class="project-infos-r">
      <img src="@/assets/img/app.png" alt="" srcset="" />
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
  .project-warp {
    position: relative;
    height: 100%;
    display: flex;
  }
  .project-infos-l {
    background: #fff;
    padding: 10px 16px;
    box-sizing: border-box;
    flex: 1;
  }
  .project-infos-title {
    font-size: 20px;
    font-weight: 700;
    padding-left: 10px;
    &::before {
      content: '';
      display: inline-block;
      width: 2px;
      height: 20px;
      background: #108ee9;
      margin-top: 5px;
    }
  }
  .project-infos-r {
    background: #fff;
    width: 300px;
    margin-left: 10px;
  }
</style>
