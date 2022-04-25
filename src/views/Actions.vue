<template>
  <Box title="Akce" class="gallery__action">
    <VuePictureSwipe :items="items"> </VuePictureSwipe>
  </Box>
</template>

<script>
import { ref } from "vue";
import { Box } from "@/components";

import VuePictureSwipe from "vue3-picture-swipe";

export default {
  components: {
    Box,
    VuePictureSwipe,
  },
  setup() {
    const imgSelected = ref(false);

    const items = [
      {
        src: "akce/carodky_plakat.jpg",
        thumbnail: "akce/carodky_plakat.jpg",
        w: 2481,
        h: 3508,
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
