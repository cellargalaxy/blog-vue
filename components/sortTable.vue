<template>
  <div>
    <b-input-group v-for="(sort,sortIndex) in sorts" :key="sortIndex">
      <b-form-input v-model="sort.sort" type="text" class="translucent"/>
      <b-form-select v-model="sort.status" :options="statusOptions" class="translucent"/>
      <b-button variant="warning" @click="changeSort(sortIndex)">修改</b-button>
    </b-input-group>
  </div>
</template>

<sort-table :sorts="sorts"/>

<script>
  import util from '../utils/util'
  import adminSort from '../adminApi/adminSort'

  export default {
    name: "sortTable",
    props: {
      sorts: {
        default: function () {
          return [{"sortId": 1, "sort": "一个分类", "status": 1}, {"sortId": 2, "sort": "两个分类", "status": 2}]
        }
      },
    },
    data() {
      return {
        statusOptions: [{value: 1, text: '启用'}, {value: 2, text: '禁用'}],
      }
    },
    methods: {
      changeSort: function (index) {
        adminSort.changeSort(this.sorts[index])
          .then(res => {
            util.successInfo('修改成功')
          })
      },
    },
  }
</script>

<style scoped>
  .transparent {
    background-color: rgba(255, 255, 255, 0);
    border-color: rgba(255, 255, 255, 0);
  }

  .translucent {
    background-color: rgba(255, 255, 255, 0.7);
    border-color: rgba(255, 255, 255, 0.7);
  }
</style>
