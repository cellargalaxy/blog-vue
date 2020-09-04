<template>
<!--    <aomponent/>-->
</template>

<script>
  import aomponent from '../components/articleView'

  export default {
    name: "test",
    data() {
      return {
        article: {
          "title": "测试标题-1-1", "url": "#",
          "attributes": [
            {"name": "时间", "value": "2020-01-01"}, {"name": "分类", "value": "类别1", "url": "#"},
            {"name": "时间", "value": "2020-01-01"}, {"name": "分类", "value": "类别1", "url": "#"},
            {"name": "时间", "value": "2020-01-01"}, {"name": "分类", "value": "类别1", "url": "#"},
            {"name": "时间", "value": "2020-01-01"}, {"name": "分类", "value": "类别1", "url": "#"},
            {"name": "时间", "value": "2020-01-01"}, {"name": "分类", "value": "类别1", "url": "#"},
          ],
          "summary": "",
          "markdown": "# Heading 1\n" +
            "## Heading 2\n" +
            "### Heading 3\n" +
            "#### Heading 4\n" +
            "##### Heading 5\n" +
            "###### Heading 6\n" +
            "\n" +
            "# 字符效果和横线等\n" +
            "\n" +
            "----\n" +
            "\n" +
            "~~删除线~~ <s>删除线（开启识别HTML标签时）</s>\n" +
            "*斜体字*      _斜体字_\n" +
            "**粗体**  __粗体__\n" +
            "***粗斜体*** ___粗斜体___\n" +
            "\n" +
            "上标：X<sub>2</sub>，下标：O<sup>2</sup>\n" +
            "\n" +
            "# 引用\n" +
            "\n" +
            "> 引用：如果想要插入空白换行`即<br />标签`，在插入处先键入两个以上的空格然后回车即可，[普通链接](http://localhost/)。\n" +
            "\n" +
            "# 锚点与链接\n" +
            "\n" +
            "[链接](http://localhost/)\n" +
            "\n" +
            "# 列表\n" +
            "\n" +
            "* 列表一\n" +
            "* 列表二\n" +
            "\n" +
            "1. 第一行\n" +
            "2. 第二行\n" +
            "\n" +
            "- [x] GFM task list 1\n" +
            "- [ ] GFM task list 3\n" +
            "    - [ ] GFM task list 3-1\n" +
            "\n" +
            "# 表格\n" +
            "\n" +
            "| 项目        | 价格   |  数量  |\n" +
            "| --------   | -----:  | :----:  |\n" +
            "| 计算机      | $1600   |   5     |\n" +
            "| 手机        |   $12   |   12   |\n" +
            "| 管线        |    $1    |  234  |\n" +
            "\n" +
            "# 图片\n" +
            "\n" +
            "![](https://i.loli.net/2018/08/21/5b7bb5dd4f0df.png)\n" +
            "\n" +
            "\n" +
            "> Follow your heart.\n" +
            "\n" +
            "# 代码\n" +
            "\n" +
            "行内代码`啊啊啊`哈哈哈\n" +
            "\n" +
            "```javascript\n" +
            "function test(){\n" +
            "\tconsole.log(\"Hello world!\");\n" +
            "}\n" +
            " \n" +
            "(function(){\n" +
            "    var box = function(){\n" +
            "        return box.fn.init();\n" +
            "    };\n" +
            "\n" +
            "    box.prototype = box.fn = {\n" +
            "        init : function(){\n" +
            "            console.log('box.init()');\n" +
            "\n" +
            "\t\t\treturn this;\n" +
            "        },\n" +
            "\n" +
            "\t\tadd : function(str){\n" +
            "\t\t\talert(\"add\", str);\n" +
            "\n" +
            "\t\t\treturn this;\n" +
            "\t\t},\n" +
            "\n" +
            "\t\tremove : function(str){\n" +
            "\t\t\talert(\"remove\", str);\n" +
            "\n" +
            "\t\t\treturn this;\n" +
            "\t\t}\n" +
            "    };\n" +
            "    \n" +
            "    box.fn.init.prototype = box.fn;\n" +
            "    \n" +
            "    window.box =box;\n" +
            "})();\n" +
            "\n" +
            "var testBox = box();\n" +
            "testBox.add(\"jQuery\").remove(\"jQuery\");\n" +
            "```\n" +
            "\n" +
            "# 图表\n" +
            "\n" +
            "```chart\n" +
            "graph TD\n" +
            "  A[Christmas] -->|Get money| B(Go shopping)\n" +
            "  B --> C{Let me think}\n" +
            "  C -->|One| D[Laptop]\n" +
            "  C -->|Two| E[iPhone]\n" +
            "  C -->|Three| F[fa:fa-car Car]\n" +
            "```\n" +
            "\n" +
            "```chart\n" +
            "pie title What Voldemort doesn't have?\n" +
            "         \"FRIENDS\" : 2\n" +
            "         \"FAMILY\" : 3\n" +
            "         \"NOSE\" : 45\n" +
            "```\n" +
            "\n" +
            "```chart\n" +
            "sequenceDiagram\n" +
            "    Alice ->> Bob: Hello Bob, how are you?\n" +
            "    Bob-->>John: How about you John?\n" +
            "    Bob--x Alice: I am good thanks!\n" +
            "    Bob-x John: I am good thanks!\n" +
            "    Note right of John: Bob thinks a long<br/>long time, so long<br/>that the text does<br/>not fit on a row.\n" +
            "\n" +
            "    Bob-->Alice: Checking with John...\n" +
            "    Alice->John: Yes... John, how are you?\n" +
            "```\n" +
            "\n" +
            "# 数学公式\n" +
            "\n" +
            "When $a \\ne 0$, there are two solutions to \\\\(ax^2 + bx + c = 0\\\\) and they are\n" +
            "$$x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}.$$\n" +
            "\n" +
            "The Lorenz Equations\n" +
            "\n" +
            "\\begin{align}\n" +
            "\\dot{x} &amp; = \\sigma(y-x) \\\\\\\\\n" +
            "\\dot{y} &amp; = \\rho x - y - xz \\\\\\\\\n" +
            "\\dot{z} &amp; = -\\beta z + xy\n" +
            "\\end{align}\n" +
            "\n" +
            "The Cauchy-Schwarz Inequality\n" +
            "\n" +
            "\\\\[\n" +
            "\\left( \\sum_{k=1}^n a_k b_k \\right)^{\\!\\!2} \\leq\n" +
            " \\left( \\sum_{k=1}^n a_k^2 \\right) \\left( \\sum_{k=1}^n b_k^2 \\right)\n" +
            "\\\\]\n" +
            "\n" +
            "A Cross Product Formula\n" +
            "\n" +
            "\\\\[\n" +
            "  \\mathbf{V}_1 \\times \\mathbf{V}_2 =\n" +
            "   \\begin{vmatrix}\n" +
            "    \\mathbf{i} &amp; \\mathbf{j} &amp; \\mathbf{k} \\\\\\\\\n" +
            "    \\frac{\\partial X}{\\partial u} &amp; \\frac{\\partial Y}{\\partial u} &amp; 0 \\\\\\\\\n" +
            "    \\frac{\\partial X}{\\partial v} &amp; \\frac{\\partial Y}{\\partial v} &amp; 0 \\\\\\\\\n" +
            "   \\end{vmatrix}\n" +
            "\\\\]\n" +
            "\n" +
            "The probability of getting \\(k\\) heads when flipping \\(n\\) coins is:\n" +
            "\n" +
            "\\\\[P(E) = {n \\choose k} p^k (1-p)^{ n-k} \\\\]\n" +
            "\n" +
            "An Identity of Ramanujan\n" +
            "\n" +
            "\\\\[\n" +
            "   \\frac{1}{(\\sqrt{\\phi \\sqrt{5}}-\\phi) e^{\\frac25 \\pi}} =\n" +
            "     1+\\frac{e^{-2\\pi}} {1+\\frac{e^{-4\\pi}} {1+\\frac{e^{-6\\pi}}\n" +
            "      {1+\\frac{e^{-8\\pi}} {1+\\ldots} } } }\n" +
            "\\\\]\n" +
            "\n" +
            "A Rogers-Ramanujan Identity\n" +
            "\n" +
            "\\\\[\n" +
            "  1 +  \\frac{q^2}{(1-q)}+\\frac{q^6}{(1-q)(1-q^2)}+\\cdots =\n" +
            "    \\prod_{j=0}^{\\infty}\\frac{1}{(1-q^{5j+2})(1-q^{5j+3})},\n" +
            "     \\quad\\quad \\text{for $|q| &lt; 1$}.\n" +
            "\\\\]\n" +
            "\n" +
            "Maxwell's Equations\n" +
            "\n" +
            "\\\\begin{align}\n" +
            "  \\nabla \\times \\vec{\\mathbf{B}} -\\, \\frac1c\\, \\frac{\\partial\\vec{\\mathbf{E}}}{\\partial t} &amp; = \\frac{4\\pi}{c}\\vec{\\mathbf{j}} \\\\\\\\\n" +
            "  \\nabla \\cdot \\vec{\\mathbf{E}} &amp; = 4 \\pi \\rho \\\\\\\\\n" +
            "  \\nabla \\times \\vec{\\mathbf{E}}\\, +\\, \\frac1c\\, \\frac{\\partial\\vec{\\mathbf{B}}}{\\partial t} &amp; = \\vec{\\mathbf{0}} \\\\\\\\\n" +
            "  \\nabla \\cdot \\vec{\\mathbf{B}} &amp; = 0\n" +
            "\\\\end{align}"
          ,
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