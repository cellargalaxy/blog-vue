<template>
    <div v-if="code" class="my-2 shadow">
        <div class="flex p-1 rounded-t bg-gray-500/50">
            <div class="flex-grow text-left">
                <ProseCodeInline v-if="filename">
                    {{ filename }}
                </ProseCodeInline>
                <ProseCodeInline v-if="language">
                    {{ language }}
                </ProseCodeInline>
            </div>
            <div class="flex-grow text-right">
                <ButtonIcon name="ic:round-unfold-less" @click="mermaid"/>
                <ButtonIcon name="ic:round-unfold-less" @click="show=!show"/>
                <ButtonCopy :text="code"/>
            </div>
        </div>

        <div v-if="language==='mermaid'">
            <div v-html="html"></div>
        </div>
        <div v-if="language!=='mermaid'">
            <div :class="[`highlight-${language}`]" v-show="show"
                 class="p-1 rounded-b overflow-y-auto scrollbar-thin scrollbar-thumb-gray-100/50 bg-gray-100/50">
                <slot/>
            </div>
        </div>

    </div>
</template>

<script>
import mermaid from 'mermaid'

export default {
    data() {
        return {
            show: true,
            html: '',
        }
    },
    props: {
        language: {
            default() {
                return ''
            }
        },
        filename: {
            default() {
                return ''
            }
        },
        code: {
            default() {
                return ''
            }
        },
    },
    methods: {
        async mermaid() {
            const {svg} = await mermaid.render('graphDiv', this.code);
            this.html = svg
            console.log('html', svg)
        },
    }
}
</script>

<style lang="postcss" scoped>

</style>
