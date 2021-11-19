<template>
  <div class="body-wrapper">
    <Navigation/>
    <main>
      <router-view/>
    </main>
    <Footer/>
  </div>
</template>

<script>
import { Footer, Navigation } from "@/components"

export default {
  components: {
    Footer,
    Navigation
  }
}

</script>

<style lang="scss">
@import "@/styles/style.scss";

.body-wrapper {
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

</style>
