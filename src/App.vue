<template>
  <div class="body-wrapper">
    <Navigation/>
    <main>
      <router-view v-slot="{ Component }">
        <transition name="route" mode="out-in">
            <component :is="Component"></component>
        </transition>
      </router-view>
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
  },
  data() {
    return {
      menu: [
        { monday: []}
      ]
    }
  }
}

</script>

<style lang="scss">
@import "@/styles/style.scss";
@import "@/styles/Base/Mixins/responsive";

.body-wrapper {
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
  margin-top: 7rem;

  @include mq('tablet', max) {
    margin-top: 5rem;
  }
}

.route-enter-from {
  opacity: 0;
  transform: translateX(-100px);
}

.route-enter-active {
  transition: all .3s ease-out
}

.route-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

.route-leave-active {
  transition: all .3s ease-out
}
</style>