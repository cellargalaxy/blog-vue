<template>
  <div>

    <auto-img style="height:100vh;position:fixed;background-attachment:fixed;"
              :url="'https://i.loli.net/2018/08/21/5b7bb5dd4f0df.png'"/>

    <div style="width:100%;position:absolute;">

<!--            <div class="fence" style="height: 50vh"/>-->
      <fence-scrollbar style="height: 50vh">
        <h1>初羽的魔法日记</h1>
        <p>
          🌸这是一个记录有关技术的魔法日记🔮🌸这是一个记录有关技术的魔法日记🔮🌸这是一个记录有关技术的魔法日记🔮🌸这是一个记录有关技术的魔法日记🔮</p>
        <p>🌸这是一个记录有关技术的魔法日记🔮</p>
        <p>🌸这是一个记录有关技术的魔法日记🔮</p>
        <p>🌸这是一个记录有关技术的魔法日记🔮</p>
        <p>🌸这是一个记录有关技术的魔法日记🔮</p>
        <p>🌸这是一个记录有关技术的魔法日记🔮</p>
        <p>🌸这是一个记录有关技术的魔法日记🔮</p>
        <p>🌸这是一个记录有关技术的魔法日记🔮</p>
        <p>🌸这是一个记录有关技术的魔法日记🔮</p>
        <p>🌸这是一个记录有关技术的魔法日记🔮</p>
        <p>🌸这是一个记录有关技术的魔法日记🔮</p>
        <p>🌸这是一个记录有关技术的魔法日记🔮</p>
        <p>🌸这是一个记录有关技术的魔法日记🔮</p>
        <p>🌸这是一个记录有关技术的魔法日记🔮</p>
        <p>🌸这是一个记录有关技术的魔法日记🔮</p>
        <p>🌸这是一个记录有关技术的魔法日记🔮</p>
        <p>🌸这是一个记录有关技术的魔法日记🔮</p>
        <p>🌸这是一个记录有关技术的魔法日记🔮</p>
      </fence-scrollbar>

      <div class="scrub">
        <div v-for="item in 200" :key="item" class="scrollbar-demo-item" style="background-color: aquamarine">
          {{ item }}
        </div>
      </div>
    </div>

  </div>
</template>

<style>
body {
  margin: 0;
  background-color: peru;
}

.bottom{
  position: relative;
  top: 50%;
  transform: translate(0%, -100%);
}
</style>