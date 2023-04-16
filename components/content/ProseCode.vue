<template>
    <div v-if="code" class="my-2 shadow">
        <div class="flex p-1 rounded-t bg-gray-500/50">
            <div class="flex-grow text-left overflow-y-auto scrollbar-thin scrollbar-thumb-gray-100/50">
                <ProseCodeInline v-if="filename">
                    {{ filename }}
                </ProseCodeInline>
                <ProseCodeInline v-if="language">
                    {{ language }}
                </ProseCodeInline>
            </div>
            <div class="flex-grow text-right">
                <ButtonIcon name="ic:round-unfold-less" @click="show=!show"/>
                <ButtonCopy :text="code"/>
            </div>
        </div>

        <div v-show="show">
            <div v-if="language==='mermaid'">
                <MermaidText :text="code"/>
            </div>
            <div v-else :class="[`highlight-${language}`]"
                 class="p-1 rounded-b overflow-y-auto scrollbar-thin scrollbar-thumb-gray-100/50 bg-gray-100/50">
                <slot/>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            show: true,
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
}
</script>

<style lang="postcss" scoped>

</style>
