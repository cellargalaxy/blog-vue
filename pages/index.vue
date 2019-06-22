<template>
    <div>
        <h2 v-if="config.brandHello" class="white" :style="{'font-size': (100/config.brandHello.length)+'vw'}">
            <b>{{config.brandHello}}</b>
        </h2>
        <b-card v-if="config.brandTexts&&config.brandTexts.length>0&&config.navs&&config.navs.length>0"
                class="translucent-black">
            <p v-if="config.brandTexts&&config.brandTexts.length>0"
               v-for="(brandText,brandTextsIndex) in config.brandTexts" :key="brandTextsIndex" class="white">
                {{brandText}}</p>

            <b-nav v-if="config.navs&&config.navs.length>0" class="transparent" align="center">
                <b-nav-item v-for="(nav,navIndex) in config.navs" :key="navIndex" :href="nav.url" target="_blank">
                    {{nav.text}}
                </b-nav-item>
            </b-nav>
        </b-card>
    </div>
</template>

<script>
    import config from '../assets/config'

    export default {
        name: "index",
        computed: {
            config: function () {
                return config.getHomeConfig()
            }
        },
        layout: 'home',
    }
</script>

<style scoped>
    .white {
        color: rgba(255, 255, 255, 1);
    }

    .transparent {
        background-color: rgba(255, 255, 255, 0);
        border-color: rgba(255, 255, 255, 0);
    }

    .translucent-black {
        background-color: rgba(0, 0, 0, 0.5);
        border-color: rgba(0, 0, 0, 0);
    }
</style>

