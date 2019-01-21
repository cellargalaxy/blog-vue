<template>
  <div>
    <page-head :name="''" :path="''"/>

    <b-container>
      <b-row>
        <b-col>
          <fool-nav :navs="sorts" :isFool="false"/>

          <br/>

          <p>
            <b-link href="https://www.mokeyjay.com/archives/1063" class="white" target="_blank">Pixiv每日榜Top50</b-link>
          </p>
          <b-carousel controls :interval="3000" class="transparent">
            <b-link v-for="(imageUrl,index) in pixivs.image" :key="index" :href="'https://www.pixiv.net/'+pixivs.url[index]" target="_blank">
              <b-carousel-slide :img-src="imageUrl"/>
            </b-link>
          </b-carousel>

        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import guestSort from '../guestApi/guestSort'
  import pageHead from '../components/pageHead'
  import foolNav from '../components/foolNav'
  import axios from 'axios'

  export default {
    name: "index",
    async asyncData({params}) {
      let listAbleSort = await guestSort.listShowSort()
      for (let i = 0; i < listAbleSort.length; i++) {
        listAbleSort[i].path = 'http://blog.cellargalaxy.top/' + listAbleSort[i].sort + '/1'
        listAbleSort[i].name = listAbleSort[i].sort
      }

      let res = await axios.get('https://cloud.mokeyjay.com/pixiv/pixiv.json')

      return {sorts: listAbleSort, pixivs: res.data}
    },
    components: {
      pageHead,
      foolNav,
    },
    layout: 'home',
  }
</script>

<style scoped>
  .white {
    color: rgba(255, 255, 255, 1);
  }

  .transparent {
    background-color: rgba(255, 255, 255, 0);
    border-color: rgba(255, 255, 255, 0);
  }

  .translucent {
    background-color: rgba(255, 255, 255, 0.7);
    border-color: rgba(255, 255, 255, 0.7);
  }
</style>

