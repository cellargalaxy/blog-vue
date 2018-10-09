<template>
  <b-form>
    <b-input-group>
      <b-form-input v-model="articleForm.title" type="text" placeholder="title"/>
      <b-form-select v-model="articleForm.sortId" :options="sortOptions"/>
    </b-input-group>

    <b-form-group>
      <mavon-editor v-model="articleForm.markdown" @save="postArticle" :defaultOpen="'edit'" :toolbars="toolbars"/>
    </b-form-group>
  </b-form>
</template>

<edit-article :sorts="sorts" :articleForm="articleForm"/>

<script>
  import util from '../utils/util'
  import adminArticle from '../adminApi/adminArticle'

  export default {
    name: "editArticle",
    data() {
      return {
        sortOptions: [],
        toolbars: {
          bold: true, // 粗体
          italic: true, // 斜体
          header: false, // 标题
          underline: true, // 下划线
          strikethrough: true, // 中划线
          mark: true, // 标记
          superscript: true, // 上角标
          subscript: true, // 下角标
          quote: true, // 引用
          ol: false, // 有序列表
          ul: false, // 无序列表
          link: false, // 链接
          imagelink: false, // 图片链接
          code: true, // code
          table: true, // 表格
          fullscreen: true, // 全屏编辑
          readmodel: false, // 沉浸式阅读
          htmlcode: false, // 展示html源码
          help: false, // 帮助
          undo: false, // 上一步
          redo: false, // 下一步
          trash: false, // 清空
          save: true, // 保存（触发events中的save事件）
          navigation: true, // 导航目录
          alignleft: true, // 左对齐
          aligncenter: true, // 居中
          alignright: true, // 右对齐
          subfield: false, // 单双栏模式
          preview: true, // 预览
        },
      }
    },
    props: {
      sorts: {
        default: function () {
          return [{"sortId": 1, "sort": "分类",},]
        }
      },
      articleForm: {
        default: function () {
          return {articleId: 0, userId: 0, sortId: 0, title: null, markdown: '', view: 0, tags: ''}
        }
      },
    },
    watch: {
      sorts(val) {
        this.sortOptions = []
        for (let i = 0; i < val.length; i++) {
          this.sortOptions.push({value: val[i].sortId, text: val[i].sort})
        }
      },
    },
    created: function () {
      this.sortOptions = []
      for (let i = 0; i < this.sorts.length; i++) {
        this.sortOptions.push({value: this.sorts[i].sortId, text: this.sorts[i].sort})
      }
      util.exitWarm('文章可能还没保存，确认离开？')
    },
    methods: {
      postArticle(value, render) {
        if (this.articleForm.articleId == 0) {
          adminArticle.addArticle(this.articleForm, this.articleForm.tags)
            .then(res => {
              util.successInfo('保存成功')
              this.articleForm = {articleId: 0, userId: 0, sortId: 0, title: null, markdown: '', view: 0, tags: ''}
            })
        } else {
          adminArticle.changeArticle(this.articleForm)
            .then(res => {
              util.successInfo('修改成功')
            })
        }
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
