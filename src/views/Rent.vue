<template lang="html">
    <Section>
        <Box title="Pronájem prostoru">
            <p>Možnost pořádání akcí v Hospůdce:</p>
            <ul>
                <li>narozeninové oslavy</li>
                <li>firemní večírky</li>
                <li>rodinné oslavy</li>
                <li>svatby</li>
            </ul>

            <p>Kapacita hospody je max 40 osob. </p>
            
            <div class="d-f jc-c mb-mb mt-xxl">
                    <img :src="require('@/assets/WorldCoffeeLogo.png')" alt="logo WorldCoffe" class="logo-wc"/>
            </div>
            <p>V případě zájmu o uspořádání akcí pro větší počet osob, nabízíme ve spolupráci s kavárnou World Coffee Medlešice, která se nachází ve stejné budově, pronájem prostor kavárny. Kapacita kavárny je max. 100 osob.</p>
            <p>Cena pronájmu prostor kavárny je 4000kč.</p>

            <p>Pro více informací nás kontaktujte na telefonu +420 606 917 959.</p>
            <br/>

            <div class="mt-xl">
                <VuePictureSwipe
                    :items="items">
                </VuePictureSwipe>
            </div>
        </Box>
    </Section>
</template>
<script>
import { ref } from 'vue'
import VuePictureSwipe from 'vue3-picture-swipe';

import { Section, Box } from '@/components'

export default {
    components: {
        Section,
        Box,
        VuePictureSwipe
    },
    setup() {
        const imgSelected = ref(false)

        const items = [{
            src: 'images/coffe01_1600.jpeg',
            thumbnail: 'images/coffe01_300.jpeg',
            w: 1600,
            h: 1200
        },{
            src: 'images/coffe02_1600.jpeg',
            thumbnail: 'images/coffe02_300.jpeg',
            w: 1600,
            h: 1200
        },{
            src: 'images/coffe03_1600.jpeg',
            thumbnail: 'images/coffe03_300.jpeg',
            w: 1600,
            h: 1200
        },{
            src: 'images/coffe04_1600.jpeg',
            thumbnail: 'images/coffe04_300.jpeg',
            w: 1600,
            h: 1200
        },{
            src: 'images/coffe05_1600.jpeg',
            thumbnail: 'images/coffe05_300.jpeg',
            w: 1600,
            h: 1200
        },{
            src: 'images/coffe06_1600.jpeg',
            thumbnail: 'images/coffe06_300.jpeg',
            w: 1600,
            h: 1200
        },{
            src: 'images/coffe07_1600.jpeg',
            thumbnail: 'images/coffe07_300.jpeg',
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
<style lang="scss" scoped>
    .logo-wc {
        width: 5rem;    
    }

    ul {
        list-style: circle;

        li {
            margin-left: 2rem;
        }
    }
</style>