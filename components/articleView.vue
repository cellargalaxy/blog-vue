<template>
  <b-list-group style="margin-bottom: 1em">
    <b-list-group-item class="white-background-8">
      <h1 style="font-size: 2em;">
        <b-link :href="article.url" v-text="article.title" target="_blank"/>
      </h1>

      <b-badge v-for="(attribute,i) in article.attributes" :key="i" style="margin-left: 0.1em;margin-right: 0.1em;">
        {{attribute.name+': '}}<a :href="attribute.url" class="white" v-text="attribute.value"/>
      </b-badge>
    </b-list-group-item>

    <div v-if="!article.isEncrypt||isDecrypt">
      <b-list-group-item class="white-background-8" v-html="$md.render(markdown)"/>
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
  import fileService from '../middleware/service/fileService'

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
      }
    },
    mounted() {
      const secret = this.getUrlQuery('secret')
      if (secret === undefined || secret == null || secret === '') {
        return
      }
      this.secret = secret
      this.decrypt()
    },
    watch: {
      article() {
        this.isDecrypt = false
      }
    },
    methods: {
      decrypt() {
        const content = fileService.decryptText(this.markdown, this.secret)
        if (content === undefined || content == null || content === '') {
          this.decryptSuccess = false
          setTimeout(() => this.decryptSuccess = true, 1000 * 3)
          return
        }
        this.decryptContent = content
        this.isDecrypt = true
      },
      getUrlQuery(name) {
        const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i")
        const r = window.location.search.substr(1).match(reg)
        if (r != null) return unescape(r[2])
        return null
      },
    }
  }
</script>

<style scoped>
  .white-background-8 {
    background-color: rgba(255, 255, 255, 0.8);
  }

  .white {
    color: rgba(255, 255, 255, 1);
  }
</style>
