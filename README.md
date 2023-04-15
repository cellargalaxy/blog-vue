function enableScroll() {
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
}
