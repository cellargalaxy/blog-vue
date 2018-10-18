<template>
  <b-button-group vertical class="gotoTop" size="sm">
    <b-button @click="gotoTop" variant="outline-success">回到顶部</b-button>

    <b-button variant="outline-success">
      <b-link target="_blank" href="https://github.com/cellargalaxy">github</b-link>
    </b-button>
  </b-button-group>
</template>

<goto-top/>

<script>
  export default {
    name: "gotoTop",
    methods: {
      gotoTop: function () {
        var timer = null;
        cancelAnimationFrame(timer);
        //获取当前毫秒数
        var startTime = +new Date();
        //获取当前页面的滚动高度
        var b = document.body.scrollTop || document.documentElement.scrollTop;
        var d = 500;
        var c = b;
        timer = requestAnimationFrame(function func() {
          var t = d - Math.max(0, startTime - (+new Date()) + d);
          document.documentElement.scrollTop = document.body.scrollTop = t * (-c) / d + b;
          timer = requestAnimationFrame(func);
          if (t == d) {
            cancelAnimationFrame(timer);
          }
        });
      },
    },
  }
</script>

<style scoped>
  .gotoTop {
    position: fixed;
    bottom: 3em;
    right: 1em;
    z-index: 9999;
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
