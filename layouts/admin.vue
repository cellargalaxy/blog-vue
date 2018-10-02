<template>
  <div>
    <page-head :sort="sort"/>

    <br/>

    <b-container fluid>
      <nuxt/>
    </b-container>

    <page-foot/>
    <goto-top/>
  </div>
</template>

<script>
  import pageHead from '../components/pageHead'
  import pageFoot from '../components/pageFoot'
  import gotoTop from '../components/gotoTop'

  export default {
    name: "default",
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
      gotoTop,
    },
  }
</script>

<style>
  body {
    /*background-color: yellow;*/
    /*background-image: url(http://119.23.235.95:83/image/background.jpg);*/
    background-image: url(https://ws1.sinaimg.cn/large/71785a53ly1frllhp1suvj21r60ygwr7.jpg);
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: cover;
  }
</style>
