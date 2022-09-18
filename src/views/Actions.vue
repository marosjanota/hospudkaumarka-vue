<template>
  <Box title="" class="gallery__action" v-if="visible">
    <h2>
      <span class="text--bold" style="color: #9b47b2">KUK OPTIK</span> - Nová
      oční optika v Chrudimi
    </h2>
    <p>
      Kompletní péče o Váš zrak na jednom místě - meření zraku, prodej brýlí a
      kontaktních čoček.
    </p>
    <p>
      Více informac na:
      <a href="https://kukoptik.cz/" target="_blank">kukoptik.cz</a>
    </p>
    <VuePictureSwipe :items="items"> </VuePictureSwipe>
  </Box>
</template>

<script>
import { ref } from "vue";
import { Box } from "@/components";

import VuePictureSwipe from "vue3-picture-swipe";

export default {
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    Box,
    VuePictureSwipe,
  },
  setup() {
    const imgSelected = ref(false);

    const items = [
      {
        src: "akce/banner_sarka_a_terka.png",
        thumbnail: "akce/banner_sarka_a_terka.png",
        w: 1200,
        h: 628,
      },
    ];

    return {
      imgSelected,
      items,
    };
  },
};
</script>
<style>
.gallery__action img {
  max-height: 50rem;
  max-width: 100%;
}
</style>
