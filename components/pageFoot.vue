<template>
    <b-card class="text-center blue-translucent white">
        <b-container>
            <p v-for="(contents,contentsIndex) in config" :key="contentsIndex">
                <b-badge v-for="(content,contentIndex) in contents" :key="contentIndex" class="transparent"
                         style="margin-left: 1em;margin-right: 1em;">
                    <a v-text="content.text" :href="content.url" target="_blank" class="white"/>
                </b-badge>
            </p>
        </b-container>
    </b-card>
</template>

<page-foot/>

<script>
    import configService from '../assets/service/configService'

    export default {
        name: "pageFoot",
        computed: {
            config: function () {
                return configService.getPageFootConfig()
            }
        },
    }
</script>

<style scoped>
    .blue-translucent {
        background-color: rgba(83, 154, 196, 0.7);
        border-color: rgba(83, 154, 196, 0.7);
    }

    .transparent {
        background-color: rgba(255, 255, 255, 0);
        border-color: rgba(255, 255, 255, 0);
    }

    .white {
        color: rgba(255, 255, 255, 1);
    }
</style>
