import Vue from "vue"
import VueLazyload from "vue-lazyload"
import error from "@/assets/image/error.svg"
import loading from "@/assets/image/loading.svg"

Vue.use(VueLazyload, {
  preLoad: 1,
  attempt: 1,
  error: error,
  loading: loading,
})
