function init() {
  const script = `<script type="module" src="https://unpkg.com/giscus?module"></script>`
  const html = `<giscus-widget id="comments"
        repo="cellargalaxy/blog-vue"
        repoid="MDEwOlJlcG9zaXRvcnkxNTA3MzE2NzU="
        category="Announcements"
        categoryid="DIC_kwDOCPv7m84CPANS"
        mapping="pathname"
        reactionsenabled="1"
        emitmetadata="1"
        inputposition="top"
        theme="light"
        lang="zh-CN"
        loading="lazy"
        crossorigin="anonymous"
        ></giscus-widget>`
  $("#comment").append(script, html).css("padding", "1em")
}

export default {
  init: init,
}
