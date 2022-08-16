<template>
  <Box title="" class="gallery__action" v-if="visible">
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
        src: "akce/kukoptik_chrudim.svg",
        thumbnail: "akce/kukoptik_chrudim.svg",
        w: 900,
        h: 1273,
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
