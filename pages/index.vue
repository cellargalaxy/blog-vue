<template>
  <b-card class="text-center translucent">
    <b-nav>
      <b-nav-item v-for="(sort,sortIndex) in sorts" :key="sortIndex" :href="'/'+sort.path+'/1'"
                  @mouseenter="mouseenter(sortIndex)" @mouseleave="mouseleave(sortIndex)">
        <b>{{sort.name}}</b>
      </b-nav-item>
    </b-nav>
  </b-card>
</template>

<script>
  import {Base64} from 'js-base64'
  import guestSort from '../guestApi/guestSort'

  export default {
    asyncData({params}) {
      return guestSort.listAllSort()
        .then(res => {
          return {sorts: res.data.data}
        })
    },
    data() {
      return {
        timeout: null,
      }
    },
    created: function () {
      for (let i = 0; i < this.sorts.length; i++) {
        this.sorts[i].base64 = Base64.encode(this.sorts[i].sort)
        this.sorts[i].path = this.sorts[i].sort
        this.sorts[i].name = this.sorts[i].base64
      }
    },
    methods: {
      mouseenter: function (sortIndex) {
        this.sorts[sortIndex].path = this.sorts[sortIndex].base64
        var self = this
        this.timeout = setTimeout(function () {
          self.sorts[sortIndex].name = self.sorts[sortIndex].sort
          self.sorts[sortIndex].path = self.sorts[sortIndex].sort
        }, 3000);
      },
      mouseleave: function (sortIndex) {
        if (this.timeout != null) {
          clearTimeout(this.timeout);
        }
        this.sorts[sortIndex].name = this.sorts[sortIndex].base64
        this.sorts[sortIndex].path = this.sorts[sortIndex].base64
      },
    },
    components: {},
    layout: 'home',
  }
</script>

<style>
  .container {
    /*min-height: 10em;*/
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .translucent {
    background-color: rgba(255, 255, 255, 0.7);
  }
</style>

