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

         <Box title="Nealkoholické nápoje" titleCenter >
            <div v-for="na in nonalkoholic" class="drinks-list">
                <span> {{na.unit}}</span>
                <span> {{na.name}}</span>
                <span> {{na.price}}</span>
            </div>
        </Box>

         <Box title="Teplé nápoje" titleCenter >
            <div v-for="w in warm" class="drinks-list">
                <span></span>
                <span> {{w.name}}</span>
                <span> {{w.price}}</span>
            </div>
        </Box>
        
         <Box title="Lihoviny" titleCenter >
             <div class="drinks-list--alco">
                <span></span><span></span><span>0,02l</span><span>0,04l</span>
             </div>
            <div v-for="a in alkohol" class="drinks-list--alco">
                <span></span>
                <span> {{a.name}}</span>
                <span> {{a.price02}}</span>
                <span> {{a.price04}}</span>
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
                { name: 'Březňák ležák 11°', price: '28,-', unit: '0,5l' },
                { name: 'Březňák ležák 11°', price: '19,-', unit: '0,3l' },
                { name: 'Nealkoholické pivo', price: '25,-', unit: '0,5l' }
            ],
            wine: [
                { name: 'Vino bíle rozlévané – dle denní nabídky', price: '35,-', unit: '0,2l' },
                { name: 'Vino červené rozlévané – dle denní nabídky', price: '35,-', unit: '0,2l' },
                { name: 'Láhev vína – dle nabídky', price: 'od 190,-', unit: '0,75l' },
                { name: 'Sekt', price: '230,-', unit: '0,75l' }
            ],
            nonalkoholic: [
                { name: 'Točená limonáda', price:'25,-', unit: '0,5l' },
                { name: 'Točená limonáda', price:'15,-', unit: '0,3l' },
                { name: 'Voda – jemně perlivá', price:'20,-', unit: '0,33l' },
                { name: 'Voda – neperlivá', price:'20,-', unit: '0,33l' },
                { name: 'Voda – perlivá', price:'20,-', unit: '0,33l' },
                { name: 'RC Cola', price:'30,-', unit: '0,25l' },
                { name: 'Vinea', price:'30,-', unit: '0,25l' },
                { name: 'Semtex', price:'50,-', unit: '0,5l' },
                { name: 'Juice', price:'30,-', unit: '0,5l' },
                { name: 'Tonic – zázvor', price:'25,-', unit: '0,25l' },
                { name: 'Voda s citronem', price:'20,-', unit: '1l' },
            ],
            warm: [
                { name: 'Turecká káva', price:'20,-'},
                { name: 'Vídeňská káva', price:'30,-'},
                { name: 'Espresso', price:'25,-'},
                { name: 'Cappuccino', price:'30,-'},
                { name: 'Latte Macchiato', price:'30,-'},
                { name: 'Čaj dle nabídky', price:'25,-'},
                { name: 'Smetana do kávy', price:'3,-'},
                { name: 'Svařáček 0,2l', price:'40,-'},
                { name: 'Groček 0,2l', price:'35,-'},
                { name: 'Horká hruška / brusinka', price:'35,-'}
            ],
            alkohol: [
                { name: 'Rum', price02: '12,-', price04: '24,-' },
                { name: 'Vodka', price02: '12,-', price04: '24,-' },
                { name: 'Zelená', price02: '12,-', price04: '24,-' },
                { name: 'Švestka 40%', price02: '15,-', price04: '30,-' },
                { name: 'Božkov Jablko', price02: '12,-', price04: '24,-' },
                { name: 'Božkov Švestka', price02: '12,-', price04: '24,-' },
                { name: 'Fernet Stock', price02: '15,-', price04: '30,-' },
                { name: 'Becherovka', price02: '15,-', price04: '30,-' },
                { name: 'Jägermeister', price02: '20,-', price04: '40,-' },
                { name: 'Tullamore Dew', price02: '25,-', price04: '50,-' },
                { name: 'Finská vodka', price02: '20,-', price04: '40,-' },
                { name: 'Hruškovice 40%', price02: '15,-', price04: '30,-' },
                { name: 'Gin', price02: '15,-', price04: '30,-' },
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
        font-weight: 500;

        &--alco {
            display: grid;
            grid-template-columns: 3rem 1fr 3rem 3rem;
        }
    }

    
</style>