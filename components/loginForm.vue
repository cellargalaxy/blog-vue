<template>
  <b-form class="translucent">
    <b-form-group>
      <b-form-input v-model="userForm.username" type="text" placeholder="username" class="translucent"/>
      <b-form-input v-model="userForm.password" type="password" placeholder="password" class="translucent"/>
    </b-form-group>

    <b-form-group>
      <b-button @click="login" variant="outline-success" style="width: 100%;">登录</b-button>
    </b-form-group>
  </b-form>
</template>

<!--<login-form/>-->

<script>
  import util from '../utils/util'
  import axios from '../utils/axios'
  import publicApi from '../commonApi/publicApi'

  export default {
    name: "loginForm",
    data() {
      return {
        userForm: {username: null, password: null,}
      }
    },
    methods: {
      login: function () {
        publicApi.login(this.userForm.username, this.userForm.password)
          .then(res => {
            axios.setToken(res)
            this.userForm = {username: null, password: null,}
            util.successInfo('登录成功')
            window.location.href='/admin/editArticle';
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
