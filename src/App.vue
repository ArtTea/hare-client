<template>
  <p>{{$store.state.username}}</p>
  <p>{{$store.getters['updateName']}}</p>
</template>
<script>
import { useStore } from 'vuex'
export default {
  name: 'App',
  setup () {
    const store = useStore()
    console.log(store.state.username)
  }
}
</script>

<style lang="less">

</style>
