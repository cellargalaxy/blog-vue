<template>
  <div>
    <page-head :sort="sort"/>

    <br/>

    <b-container>
      <nuxt/>
    </b-container>

    <page-foot class="footer"/>
  </div>
</template>

<script>
  import pageHead from '../components/pageHead'
  import pageFoot from '../components/pageFoot'

  export default {
    name: "home",
    props: {
      sort: {
        default: function () {
          return ''
        }
      },
    },
    components: {
      pageHead,
      pageFoot,
    },
  }
</script>

<style scoped>
  body {
    /*background-color: yellow;*/
    /*background-image: url(http://119.23.235.95:83/image/background.jpg);*/
    background-image: url(https://ws1.sinaimg.cn/large/71785a53ly1frllhp1suvj21r60ygwr7.jpg);
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: cover;
  }
  .footer {
    position: absolute;
    bottom: 0;
    width: 100%;
  }
</style>
