<template lang="html">
    <Box title="Fotogalerie">
        <div class="gallery">
            <img src="https://via.placeholder.com/1500" class="gallery__item" alt="Photo 01"/>
            <img src="https://via.placeholder.com/1500" class="gallery__item" alt="Photo 02"/>
            <img src="https://via.placeholder.com/1500" class="gallery__item" alt="Photo 03"/>
            <img src="https://via.placeholder.com/1500" class="gallery__item" alt="Photo 03"/>
            <img src="https://via.placeholder.com/1500" class="gallery__item" alt="Photo 03"/>
        </div>
    </Box>

    <div class="gallery--opened" v-if="imgSelected">
        <div class="popup">
            <div class="popup__close">X</div>
            <div class="popup__content">

            </div>
        </div>
    </div>
</template>
<script>
import { ref } from 'vue'
import { Box } from '@/components'

export default {
    components: {
        Box
    }, 
    setup() {
        const imgSelected = ref(false)

        return {
            imgSelected
        }
    }
}
</script>
<style lang="scss" scoped>
    .gallery {
        display: flex;
        gap: var(--gap-md);
        margin-top: var(--gap-md);

        &__item {
            width: 12rem;

        }

        &--opened {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            display: grid;
            place-items: center;
        }
    }

    .popup {
        display: flex;
        flex-direction: column;
        align-items: flex-end;

        &__close {

        }

        &__content {
            max-width: 50rem;
            max-height: 50rem
        }
    }
</style>
