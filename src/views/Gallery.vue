<template lang="html">
    <Box title="Fotogalerie" class="gallery">
        <VuePictureSwipe
            :items="items">
        </VuePictureSwipe>
    </Box>
</template>
<script>
import { ref } from 'vue'
import { Box } from '@/components'

import VuePictureSwipe from 'vue3-picture-swipe';

export default {
    components: {
        Box,
        VuePictureSwipe
    }, 
    setup() {
        const imgSelected = ref(false)

        const items = [{
            src: 'images/hospoda02_1600.jpg',
            thumbnail: 'images/hospoda02_300.jpg',
            w: 1600,
            h: 1200
        },{
            src: 'images/hospoda03_1600.jpg',
            thumbnail: 'images/hospoda03_300.jpg',
            w: 1600,
            h: 1200
        },{
            src: 'images/hospoda01_1600.jpg',
            thumbnail: 'images/hospoda01_300.jpg',
            w: 1600,
            h: 1200
        }]

        return {
            imgSelected,
            items
        }
    }
}
</script>
<style lang="scss">
    .my-gallery {
        text-align: center;
    }
    
    .gallery {
        .gallery-thumbnail img {
            max-height: 10rem;
            max-width: 100%;
        }
    }
</style>
