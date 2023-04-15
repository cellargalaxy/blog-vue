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
                <ButtonIcon name="ic:round-unfold-less" @click="show=!show"/>
                <ButtonCopy :text="code"/>
            </div>
        </div>

        <div :class="[`highlight-${language}`]" class="p-1 rounded-b overflow-y-auto scrollbar-thin scrollbar-thumb-gray-100/50 bg-gray-100/50" v-show="show">
            <slot/>
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
