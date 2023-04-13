<template>
    <nuxt-img :src="src" loading="lazy" class="cursor-pointer my-2" @click="click(src)"/>
</template>

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
            container.onclick = () => {
                container.remove()
                this.enableScroll()
            }
            //创建预览图片
            let img = document.createElement("img")
            img.src = src
            img.classList.add("preview-img")
            //绑定滚动事件
            container.onwheel = (event) => {
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
            this.disableScroll()
        },
        preventDefault(e) {
            e.preventDefault();
        },
        preventDefaultForScrollKeys(e) {
            // left: 37, up: 38, right: 39, down: 40
            const keys = {37: 1, 38: 1, 39: 1, 40: 1};
            if (keys[e.keyCode]) {
                this.preventDefault(e);
                return false;
            }
        },
        disableScroll() {
            //https://blog.51cto.com/u_12471633/4626317

            let supportsPassive = false;
            try {
                window.addEventListener("test", null, Object.defineProperty({}, "passive", {
                        get: () => {
                            supportsPassive = true;
                        },
                    })
                );
            } catch (e) {
            }

            const wheelOpt = supportsPassive ? {passive: false} : false;
            const wheelEvent = "onwheel" in document.createElement("div") ? "wheel" : "mousewheel";

            window.addEventListener("DOMMouseScroll", this.preventDefault, false); // older FF
            window.addEventListener(wheelEvent, this.preventDefault, wheelOpt); // modern desktop
            window.addEventListener("touchmove", this.preventDefault, wheelOpt); // mobile
            window.addEventListener("keydown", this.preventDefaultForScrollKeys, false);
        },
        enableScroll() {
            let supportsPassive = false;
            try {
                window.addEventListener("test", null, Object.defineProperty({}, "passive", {
                        get: () => {
                            supportsPassive = true;
                        },
                    })
                );
            } catch (e) {
            }

            const wheelOpt = supportsPassive ? {passive: false} : false;
            const wheelEvent = "onwheel" in document.createElement("div") ? "wheel" : "mousewheel";

            window.removeEventListener("DOMMouseScroll", this.preventDefault, false);
            window.removeEventListener(wheelEvent, this.preventDefault, wheelOpt);
            window.removeEventListener("touchmove", this.preventDefault, wheelOpt);
            window.removeEventListener("keydown", this.preventDefaultForScrollKeys, false);
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
}

.preview-img-container .preview-img {
    @apply object-contain;
    min-width: 10%;
    max-width: 90%;
    min-height: 10%;
    max-height: 90%;
}
</style>