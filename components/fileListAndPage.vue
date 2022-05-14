<template>
  <div>
    <breadcrumb-path :rootPath="rootPath" :crumbs="crumbs"/>
    <file-list :files="files"/>
    <pagination-page :total="total" :size="pageSize" :current="currentPage"/>
  </div>
</template>

<file-list-and-page :rootPath="rootPath" :crumbs="crumbs" :files="files"
                    :currentPage="currentPage" :pageSize="pageSize" :total="total"/>

<script>
import breadcrumbPath from './breadcrumbPath'
import fileList from './fileList'
import paginationPage from './paginationPage'

export default {
  name: "fileListAndPage",
  props: {
    rootPath: {
      default() {
        return undefined
      }
    },
    crumbs: {
      default() {
        return undefined
      }
    },
    files: {
      default() {
        return undefined
      }
    },
    total: {
      default() {
        return undefined
      }
    },
    pageSize: {
      default() {
        return undefined
      }
    },
    currentPage: {
      default() {
        return undefined
      }
    },
  },
  components: {
    breadcrumbPath,
    fileList,
    paginationPage,
  },
}
</script>
