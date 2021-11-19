<template lang="html">
    <Section>
        <Box title="Pivo" titleCenter >
            <div v-for="b in beer" class="drinks-list">
                <span> {{b.unit}}</span>
                <span> {{b.name}}</span>
                <span> {{b.price}}</span>
            </div>
        </Box>
        
        <Box title="Víno" titleCenter >
            <div v-for="w in wine" class="drinks-list">
                <span> {{w.unit}}</span>
                <span> {{w.name}}</span>
                <span> {{w.price}}</span>
            </div>
        </Box>
    </Section>
</template>
<script>
import { Box, Section } from "@/components"

export default {
    components: {
        Box,
        Section
    },
    data() {
        return {
            beer: [
                {
                    name: 'Březňák ležák 11°',
                    price: '28,-',
                    unit: '0,5l'
                },
                {
                    name: 'Březňák ležák 11°',
                    price: '19,-',
                    unit: '0,3l'
                },
                {
                    name: 'Nealkoholické pivo°',
                    price: '25,-',
                    unit: '0,5l'
                }
            ],
            wine: [
                {
                    name: 'Vino bíle rozlévané – dle denní nabídky',
                    price: '35,-',
                    unit: '0,2l'
                },
                {
                    name: 'Vino červené rozlévané – dle denní nabídky',
                    price: '35,-',
                    unit: '0,2l'
                },
                {
                    name: 'Láhev vína – dle nabídky',
                    price: 'od 190,-',
                    unit: '0,75l'
                },
                {
                    name: 'Sekt',
                    price: '230,-',
                    unit: '0,75l'
                }
            ]
        }
    }
}
</script>
<style lang="scss" scoped>
    .section__content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .box {
        max-width: 40rem;
        margin-left: auto;
        margin-right: auto;
    }

    .drinks-list {
        display: grid;
        grid-template-columns: 3rem 1fr auto;
    }
</style>