<template>
    <nuxt-img :src="src" loading="lazy" class="cursor-pointer my-2" @click="click(src)"/>
</template>

<!--    <div class="items-center flex w-mix justify-center my-2">-->
<!--        <nuxt-img :src="src" loading="lazy" class="cursor-pointer" @click="click(src)"/>-->
<!--    </div>-->

<script>
export default {
    props: {
        src: {
            default() {
                return ''
            }
        },
    },
    methods: {
        click(src) {
            //创建预览器
            let container = document.createElement("div")
            container.classList.add("preview-img-container")
            container.onclick = function () {
                container.remove()
            }
            //创建预览图片
            let img = document.createElement("img")
            img.src = src
            img.classList.add("preview-img")
            //绑定滚动事件
            container.onwheel = function (event) {
                const width = getComputedStyle(img).width.slice(0, -2)
                const height = getComputedStyle(img).height.slice(0, -2)
                if (event.deltaY > 0) { //向下滚动放大
                    img.style.width = parseInt(width) * 0.9 + "px"
                    img.style.height = parseInt(height) * 0.9 + "px"
                } else if (event.deltaY < 0) {//向上滚动缩小
                    img.style.width = parseInt(width) * 1.1 + "px"
                    img.style.height = parseInt(height) * 1.1 + "px"
                }
            }
            //将图片添加到预览器
            container.append(img)
            //将预览器添加到 body 中
            document.body.append(container)
        },
    },
}
</script>

<style lang="postcss">
.preview-img-container {
    @apply fixed;
    @apply inset-0;
    @apply bg-gray-500/50;
    @apply flex;
    @apply items-center;
    @apply justify-center;
    @apply cursor-pointer;
    @apply overscroll-contain;
}
.preview-img-container .preview-img {
    @apply object-contain;
    min-width: 10%;
    max-width: 90%;
    min-height: 10%;
    max-height: 90%;
}
</style>