<template>
  <b-input-group>
    <b-form-input v-model="sortForm.sort" type="text" class="translucent"/>
    <b-form-select v-model="sortForm.status" :options="statusOptions" class="translucent"/>
    <b-button variant="success" @click="addSort">添加</b-button>
  </b-input-group>
</template>

<sort-form/>

<script>
  import util from '../utils/util'
  import adminSort from '../adminApi/adminSort'

  export default {
    name: "sortForm",
    data() {
      return {
        statusOptions: [{value: 1, text: '启用'}, {value: 2, text: '禁用'}],
        sortForm: {sort: null, status: 0},
      }
    },
    methods: {
      addSort: function () {
        adminSort.addSort(this.sortForm)
          .then(res => {
            util.successInfo('添加成功')
            this.sortForm = {sort: null, status: 0}
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
