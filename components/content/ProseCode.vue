<template>
    <div v-if="code" class="my-2">
        <div class="flex p-1 rounded-t bg-gray-500/50">
            <div class="flex-grow text-left w-max">
                <ProseCodeInline v-if="language">
                    {{ language }}
                </ProseCodeInline>
            </div>
            <div class="flex-shrink-0 text-center w-max">
                <ProseCodeInline v-if="filename">
                    {{ filename }}
                </ProseCodeInline>
            </div>
            <div class="flex-grow text-right w-max">
                <ButtonIcon name="ic:round-unfold-less" @click="show=!show"/>
                <ButtonCopy :text="code"/>
            </div>
        </div>

        <div :class="[`highlight-${language}`]" class="p-1 rounded-b bg-gray-100/50" v-show="show">
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
