<template>
  <b-container fluid>
    <b-row no-gutters>
      <b-col>
        <b-button-group>
          <b-button @click="showTextarea" variant="info">编辑</b-button>
          <b-button @click="showArticleView" variant="success">预览</b-button>
          <b-button @click="copyContent" variant="info">复制</b-button>
        </b-button-group>
      </b-col>
    </b-row>
    <b-row no-gutters>
      <b-col :cols="textareaCol" v-if="textareaCol>0">
        <b-form-textarea @change="changeContent" class="white-background-8" max-rows="10000" rows="3"
                         v-model="article.content"/>
      </b-col>
      <b-col :cols="articleViewCol" v-if="articleViewCol>0">
        <article-view :article="article" :isSummary="false"/>
      </b-col>
    </b-row>
  </b-container>
</template>

<preview/>

<script>
  import articleView from './articleView'
  import utils from '../middleware/utils/utils'

  export default {
    name: "preview",
    data() {
      return {
        article: {
          "title": "preview markdown", "url": "#", "content": "# content", "summary": "# summary",
          "attributes": [
            {"name": "date", "value": utils.formatDate(new Date(), 'YYYY-MM-DD')},
            {"name": "sort", "value": "preview", "url": "#"},
            {"name": "word", "value": "12345"},
            {"name": "read time", "value": "12 min"},
          ],
        },
        textareaCol: 6,
        articleViewCol: 6,
      }
    },
    mounted() {
      window.onbeforeunload = () => {
        this.copyContent()
        return "确认离开当前页面"
      }
    },
    methods: {
      changeContent(content) {
        this.article.content = content
        for (let i = 0; i < this.article.attributes.length; i++) {
          if (this.article.attributes[i].name == 'word') {
            this.article.attributes[i].value = content.length
          }
          if (this.article.attributes[i].name == 'read time') {
            let readTime = Math.round(content.length / 300)
            if (readTime == 0) {
              readTime = 1
            }
            this.article.attributes[i].value = readTime + ' min'
          }
        }
      },
      showTextarea() {
        if (this.textareaCol == 6 && this.articleViewCol == 6) {
          this.textareaCol = 12
          this.articleViewCol = 0
        } else {
          this.textareaCol = 6
          this.articleViewCol = 6
        }
        console.log('this.textareaCol', this.textareaCol)
        console.log('this.articleViewCol', this.articleViewCol)
      },
      showArticleView() {
        if (this.textareaCol == 6 && this.articleViewCol == 6) {
          this.textareaCol = 0
          this.articleViewCol = 12
        } else {
          this.textareaCol = 6
          this.articleViewCol = 6
        }
        console.log('this.textareaCol', this.textareaCol)
        console.log('this.articleViewCol', this.articleViewCol)
      },
      copyContent() {
        this.writeClipboard(this.article.content)
      },
      writeClipboard: (text) => {
        const textarea = document.createElement('textarea')
        textarea.style.opacity = 0
        textarea.style.position = 'absolute'
        textarea.style.left = '-100000px'
        document.body.appendChild(textarea)

        textarea.value = text
        textarea.select()
        textarea.setSelectionRange(0, text.length)
        document.execCommand('copy')
        document.body.removeChild(textarea)
      },
    },
    components: {
      articleView,
    },
  }
</script>

<style scoped>
  .white-background-8 {
    background-color: rgba(255, 255, 255, 0.8);
  }
</style>