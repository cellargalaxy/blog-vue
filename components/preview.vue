<template>
  <div>
    <b-row>
      <b-col>
        <b-input-group>
          <b-form-input @input="changeArticle" placeholder="path" v-model="filePath"></b-form-input>
          <b-input-group-append>
            <b-button @click="showTextarea" variant="info">edit</b-button>
            <b-button @click="showArticleView" variant="success">preview</b-button>
            <b-button @click="copyContent" variant="info">copy</b-button>
          </b-input-group-append>
        </b-input-group>
      </b-col>
    </b-row>

    <b-row>
      <b-col>
        <b-input-group>
          <b-form-input :state="cryptSuccess" placeholder="secret" v-model="secret"></b-form-input>
          <b-input-group-append>
            <b-button @click="encrypt" variant="success">encrypt</b-button>
            <b-button @click="decrypt" variant="info">decrypt</b-button>
          </b-input-group-append>
        </b-input-group>
      </b-col>
    </b-row>

    <b-row no-gutters>
      <b-col :cols="textareaCol" v-if="textareaCol>0">
        <b-form-textarea @input="changeArticle" class="white-background-8" max-rows="10000" rows="3"
                         v-model="article.content"/>
      </b-col>
      <b-col :cols="articleViewCol" v-if="articleViewCol>0">
        <article-view :article="article" :isSummary="false"/>
      </b-col>
    </b-row>
  </div>
</template>

<preview/>

<script>
  import articleView from './articleView'
  import utils from '../middleware/utils/utils'
  import fileService from '../middleware/service/fileService'
  import articleService from '../middleware/service/articleService'

  export default {
    name: "preview",
    data() {
      return {
        filePath: 'preview/' + utils.formatDate(new Date(), 'YYYYMMDD') + '/preview markdown.md',
        article: {content: '# content', isEncrypt: false},
        textareaCol: 6,
        articleViewCol: 6,
        secret: 'secret',
        cryptSuccess: true,
      }
    },
    mounted() {
      window.onbeforeunload = () => {
        this.copyContent()
        return "确认离开当前页面"
      }
    },
    created() {
      this.changeArticle()
    },
    methods: {
      changeArticle() {
        const file = fileService.createFile(this.filePath, this.article.content)
        this.article = articleService.createArticle(file)
      },
      showTextarea() {
        if (this.textareaCol == 6 && this.articleViewCol == 6) {
          this.textareaCol = 12
          this.articleViewCol = 0
        } else {
          this.textareaCol = 6
          this.articleViewCol = 6
        }
      },
      showArticleView() {
        if (this.textareaCol == 6 && this.articleViewCol == 6) {
          this.textareaCol = 0
          this.articleViewCol = 12
        } else {
          this.textareaCol = 6
          this.articleViewCol = 6
        }
      },
      copyContent() {
        this.writeClipboard(this.article.content)
      },
      writeClipboard(text) {
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
      encrypt() {
        if (this.article.isEncrypt) {
          return
        }
        const content = fileService.encryptText(this.article.content, this.secret)
        if (content === undefined || content == null || content === '') {
          this.cryptSuccess = false
          setTimeout(() => this.cryptSuccess = true, 1000 * 3)
          return
        }
        this.article.content = content
        this.article.isEncrypt = true
      },
      decrypt() {
        if (!this.article.isEncrypt) {
          return
        }
        const content = fileService.decryptText(this.article.content, this.secret)
        if (content === undefined || content == null || content === '') {
          this.cryptSuccess = false
          setTimeout(() => this.cryptSuccess = true, 1000 * 3)
          return
        }
        this.article.content = content
        this.article.isEncrypt = false
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