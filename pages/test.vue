<template>
  <!--  <aomponent/>-->
</template>

<script>
  import aomponent from '../components/pageHead.vue'

  export default {
    name: "test",
    data() {
      return {
        article: {
          "title": "测试文章标题-1-1", "url": "#",
          "attributes": [
            {"name": "时间", "value": "2020-01-01"}, {"name": "分类", "value": "类别1", "url": "#"},
            {"name": "时间", "value": "2020-01-01"}, {"name": "分类", "value": "类别1", "url": "#"},
            {"name": "时间", "value": "2020-01-01"}, {"name": "分类", "value": "类别1", "url": "#"},
            {"name": "时间", "value": "2020-01-01"}, {"name": "分类", "value": "类别1", "url": "#"},
            {"name": "时间", "value": "2020-01-01"}, {"name": "分类", "value": "类别1", "url": "#"},
          ],
          "summary": "# Editor.md\n" +
            "\n" +
            "![](https://pandao.github.io/editor.md/images/logos/editormd-logo-180x180.png)\n" +
            "\n" +
            "![](https://img.shields.io/github/stars/pandao/editor.md.svg) ![](https://img.shields.io/github/forks/pandao/editor.md.svg) ![](https://img.shields.io/github/tag/pandao/editor.md.svg) ![](https://img.shields.io/github/release/pandao/editor.md.svg) ![](https://img.shields.io/github/issues/pandao/editor.md.svg) ![](https://img.shields.io/bower/v/editor.md.svg)\n" +
            "\n" +
            "**目录 (Table of Contents)**\n" +
            "\n" +
            "# Heading 1\n" +
            "## Heading 2\n" +
            "### Heading 3\n" +
            "#### Heading 4\n" +
            "##### Heading 5\n" +
            "###### Heading 6\n" +
            "# Heading 1 link [Heading link](https://github.com/pandao/editor.md \"Heading link\")\n" +
            "## Heading 2 link [Heading link](https://github.com/pandao/editor.md \"Heading link\")\n" +
            "### Heading 3 link [Heading link](https://github.com/pandao/editor.md \"Heading link\")\n" +
            "#### Heading 4 link [Heading link](https://github.com/pandao/editor.md \"Heading link\") Heading link [Heading link](https://github.com/pandao/editor.md \"Heading link\")\n" +
            "##### Heading 5 link [Heading link](https://github.com/pandao/editor.md \"Heading link\")\n" +
            "###### Heading 6 link [Heading link](https://github.com/pandao/editor.md \"Heading link\")",
          "markdown": "# Editor.md\n" +
            "\n" +
            "![](https://pandao.github.io/editor.md/images/logos/editormd-logo-180x180.png)\n" +
            "\n" +
            "![](https://img.shields.io/github/stars/pandao/editor.md.svg) ![](https://img.shields.io/github/forks/pandao/editor.md.svg) ![](https://img.shields.io/github/tag/pandao/editor.md.svg) ![](https://img.shields.io/github/release/pandao/editor.md.svg) ![](https://img.shields.io/github/issues/pandao/editor.md.svg) ![](https://img.shields.io/bower/v/editor.md.svg)\n" +
            "\n" +
            "**目录 (Table of Contents)**\n" +
            "\n" +
            "[TOCM]\n" +
            "\n" +
            "[TOC]\n" +
            "\n" +
            "# Heading 1\n" +
            "## Heading 2\n" +
            "### Heading 3\n" +
            "#### Heading 4\n" +
            "##### Heading 5\n" +
            "###### Heading 6\n" +
            "# Heading 1 link [Heading link](https://github.com/pandao/editor.md \"Heading link\")\n" +
            "## Heading 2 link [Heading link](https://github.com/pandao/editor.md \"Heading link\")\n" +
            "### Heading 3 link [Heading link](https://github.com/pandao/editor.md \"Heading link\")\n" +
            "#### Heading 4 link [Heading link](https://github.com/pandao/editor.md \"Heading link\") Heading link [Heading link](https://github.com/pandao/editor.md \"Heading link\")\n" +
            "##### Heading 5 link [Heading link](https://github.com/pandao/editor.md \"Heading link\")\n" +
            "###### Heading 6 link [Heading link](https://github.com/pandao/editor.md \"Heading link\")\n" +
            "\n" +
            "#### 标题（用底线的形式）Heading (underline)\n" +
            "\n" +
            "This is an H1\n" +
            "=============\n" +
            "\n" +
            "This is an H2\n" +
            "-------------\n" +
            "\n" +
            "### 字符效果和横线等\n" +
            "                \n" +
            "----\n" +
            "\n" +
            "~~删除线~~ <s>删除线（开启识别HTML标签时）</s>\n" +
            "*斜体字*      _斜体字_\n" +
            "**粗体**  __粗体__\n" +
            "***粗斜体*** ___粗斜体___\n" +
            "\n" +
            "上标：X<sub>2</sub>，下标：O<sup>2</sup>\n" +
            "\n" +
            "**缩写(同HTML的abbr标签)**\n" +
            "\n" +
            "> 即更长的单词或短语的缩写形式，前提是开启识别HTML标签时，已默认开启\n" +
            "\n" +
            "The <abbr title=\"Hyper Text Markup Language\">HTML</abbr> specification is maintained by the <abbr title=\"World Wide Web Consortium\">W3C</abbr>.\n" +
            "\n" +
            "### 引用 Blockquotes\n" +
            "\n" +
            "> 引用文本 Blockquotes\n" +
            "\n" +
            "引用的行内混合 Blockquotes\n" +
            "                    \n" +
            "> 引用：如果想要插入空白换行`即<br />标签`，在插入处先键入两个以上的空格然后回车即可，[普通链接](http://localhost/)。\n" +
            "\n" +
            "### 锚点与链接 Links\n" +
            "\n" +
            "[普通链接](http://localhost/)\n" +
            "\n" +
            "[普通链接带标题](http://localhost/ \"普通链接带标题\")\n" +
            "\n" +
            "直接链接：<https://github.com>\n" +
            "\n" +
            "[锚点链接][anchor-id] \n" +
            "\n" +
            "[anchor-id]: http://www.this-anchor-link.com/\n" +
            "\n" +
            "GFM a-tail link @pandao\n" +
            "\n" +
            "> @pandao\n" +
            "\n" +
            "### 多语言代码高亮 Codes\n" +
            "\n" +
            "#### 行内代码 Inline code\n" +
            "\n" +
            "执行命令：`npm install marked`\n" +
            "\n" +
            "#### HTML代码 HTML codes\n" +
            "\n" +
            "```html\n" +
            "<!DOCTYPE html>\n" +
            "<html>\n" +
            "    <head>\n" +
            "        <mate charest=\"utf-8\" />\n" +
            "        <title>Hello world!</title>\n" +
            "    </head>\n" +
            "    <body>\n" +
            "        <h1>Hello world!</h1>\n" +
            "    </body>\n" +
            "</html>\n" +
            "```\n" +
            "\n" +
            "[![](https://pandao.github.io/editor.md/examples/images/7.jpg)](https://pandao.github.io/editor.md/examples/images/7.jpg \"李健首张专辑《似水流年》封面\")\n" +
            "\n" +
            "### 列表 Lists\n" +
            "\n" +
            "#### 无序列表（减号）Unordered Lists (-)\n" +
            "                \n" +
            "- 列表一\n" +
            "- 列表二\n" +
            "- 列表三\n" +
            "     \n" +
            "#### 无序列表（星号）Unordered Lists (*)\n" +
            "\n" +
            "* 列表一\n" +
            "* 列表二\n" +
            "* 列表三\n" +
            "\n" +
            "#### 无序列表（加号和嵌套）Unordered Lists (+)\n" +
            "                \n" +
            "+ 列表一\n" +
            "+ 列表二\n" +
            "    + 列表二-1\n" +
            "    + 列表二-2\n" +
            "    + 列表二-3\n" +
            "+ 列表三\n" +
            "    * 列表一\n" +
            "    * 列表二\n" +
            "    * 列表三\n" +
            "\n" +
            "#### 有序列表 Ordered Lists (-)\n" +
            "\n" +
            "1. 第一行\n" +
            "2. 第二行\n" +
            "3. 第三行\n" +
            "\n" +
            "#### GFM task list\n" +
            "\n" +
            "- [x] GFM task list 1\n" +
            "- [x] GFM task list 2\n" +
            "- [ ] GFM task list 3\n" +
            "    - [ ] GFM task list 3-1\n" +
            "    - [ ] GFM task list 3-2\n" +
            "    - [ ] GFM task list 3-3\n" +
            "- [ ] GFM task list 4\n" +
            "    - [ ] GFM task list 4-1\n" +
            "    - [ ] GFM task list 4-2\n" +
            "\n" +
            "### 绘制表格 Tables\n" +
            "\n" +
            "| 项目        | 价格   |  数量  |\n" +
            "| --------   | -----:  | :----:  |\n" +
            "| 计算机      | $1600   |   5     |\n" +
            "| 手机        |   $12   |   12   |\n" +
            "| 管线        |    $1    |  234  |",
        },
      }
    },
    components: {
      aomponent,
    },
  }
</script>

<style scoped>

</style>