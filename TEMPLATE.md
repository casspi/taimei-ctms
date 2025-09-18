# 代码片段

主要用于 copy 复制

## 所在省市

```vue
<ElTableColumn label="省市" >
  <template #default="scope">
      {{ scope.row.provinceName }} / {{ scope.row.cityName }}
    </template>
</ElTableColumn>

<DistrictTableColumn />
```


## 状态 启用/禁用

```ts
reqDictionaryListType({ type: DictionaryType.DIC_DISABLED }),

status: {
  label: '状态',
  value: '',
  is: 'form-radio',
  props: {
    placeholder: '请选择状态',
  },
  rules: [{ required: true, message: '请选择状态' }],
},


const { data: mapOptions } = useAsyncTask(
  async () => {
    const [status] = await Promise.all([
      reqDictionaryListType({ type: DictionaryType.DIC_DISABLED }),
    ])
    return { status }
  },
  {
    immediate: true,
    throwError: true,
    initialValue: { status: [] },
  },
)
```

```vue
<ElTableColumn prop="status" label="状态" >
  <template #default="scope">
    <ElTag :type="scope.row.status === '1' ? 'success' : 'info'">
      {{ scope.row.statusName || scope.row.status }}
    </ElTag>
  </template>
</ElTableColumn>
```