<template>
  <b-list-group style="margin-bottom: 1em">
    <b-list-group-item class="white-background-8">
      <h1 style="font-size: 2em;">
        <b-link :href="article.url" target="_blank" v-text="article.title"/>
      </h1>

      <auto-color-badge :key="i" :name="attribute.name"
                        :url="attribute.url" :value="attribute.value" style="margin-left: 0.1em;margin-right: 0.1em;"
                        v-for="(attribute,i) in article.attributes"/>
    </b-list-group-item>

    <div v-if="!article.isEncrypt||isDecrypt">
      <!--google: `vue v-html img lazy`-->
      <!--https://yasminzy.com/nuxt/vue-lazyload.html-->
      <!--https://juejin.im/post/6844904030552997896-->
      <b-list-group-item class="white-background-8" v-html="$md.render(markdown)" v-lazy-container="{selector:'img'}"/>
    </div>
    <div v-else>
      <b-list-group-item class="white-background-8">
        <b-row class="text-center">
          <b-col>
            <b-input-group>
              <b-form-input :state="decryptSuccess" placeholder="secret"
                            type="password" v-model="secret"></b-form-input>
              <b-input-group-append>
                <b-button @click="decrypt" variant="outline-success">decrypt</b-button>
              </b-input-group-append>
              <b-form-invalid-feedback>decrypt fail</b-form-invalid-feedback>
            </b-input-group>
          </b-col>
        </b-row>
      </b-list-group-item>
    </div>
  </b-list-group>
</template>

<article-view :article="article" :isSummary="isSummary"/>

<script>
  import autoColorBadge from './autoColorBadge'
  import textService from '../middleware/service/textService'
  import utils from '../middleware/utils/utils'

  export default {
    name: "articleView",
    props: {
      article: {
        default() {
          return {
            "title": "测试文章标题-1-1", "url": "#", "content": "content", "summary": "summary", "isEncrypt": false,
            "attributes": [
              {"name": "时间", "value": "2020-01-01"}, {"name": "分类", "value": "类别1", "url": "#"},
              {"name": "时间", "value": "2020-01-01"}, {"name": "分类", "value": "类别1", "url": "#"},
              {"name": "时间", "value": "2020-01-01"}, {"name": "分类", "value": "类别1", "url": "#"},
              {"name": "时间", "value": "2020-01-01"}, {"name": "分类", "value": "类别1", "url": "#"},
              {"name": "时间", "value": "2020-01-01"}, {"name": "分类", "value": "类别1", "url": "#"},
            ],
          }
        }
      },
      isSummary: {
        default() {
          return false
        }
      },
    },
    data() {
      return {
        secret: '',
        decryptSuccess: true,
        isDecrypt: false,
        decryptContent: '',
      }
    },
    computed: {
      markdown() {
        if (this.article.isEncrypt && this.isDecrypt) {
          return this.decryptContent
        }
        return this.isSummary ? this.article.summary : this.article.content
      },
    },
    mounted() {
      const cipherSecret = this.getUrlQuery('secret')
      if (cipherSecret === undefined || cipherSecret == null || cipherSecret === '') {
        return
      }
      this.secret = this.decryptUrlSecret(this.markdown, cipherSecret)
      this.decrypt()
    },
    watch: {
      article() {
        this.isDecrypt = false
      }
    },
    methods: {
      decrypt() {
        if (this.secret === undefined || this.secret == null || this.secret === '') {
          this.decryptSuccess = false
          setTimeout(() => this.decryptSuccess = true, 1000 * 3)
          return
        }
        const content = textService.decryptText(this.markdown, this.secret)
        if (content === undefined || content == null || content === '') {
          this.decryptSuccess = false
          setTimeout(() => this.decryptSuccess = true, 1000 * 3)
          return false
        }
        this.decryptContent = content
        this.isDecrypt = true
      },
      getUrlQuery(name) {
        const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i")
        const r = window.location.search.substr(1).match(reg)
        if (r != null) {
          return decodeURIComponent(r[2])
        }
        return null
      },
      decryptUrlSecret(markdown, cipherSecret) {
        const content = textService.decryptText(markdown, cipherSecret)
        if (content !== undefined && content != null && content !== '') {
          return cipherSecret
        }
        cipherSecret = textService.deBase64(cipherSecret)
        const string = utils.formatDate(new Date(), 'YYYYMMDDHHmmss')
        let space = ''
        for (let i = string.length; i >= 0; i--) {
          const key = string.substring(0, i) + space
          space = space + '-'
          const secret = textService.decryptText(cipherSecret, key)
          if (secret !== undefined && secret != null && secret !== '') {
            return secret
          }
        }
        return null
      },
    },
    components: {
      autoColorBadge,
    },
  }
</script>

<style scoped>
  .white-background-8 {
    background-color: rgba(255, 255, 255, 0.8);
  }
</style>
