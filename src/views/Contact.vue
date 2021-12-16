<template lang="html">
    <Section>
        <Box title="Otevírací doba" class="box--hours w-50 ml-a mr-a" titleCenter> 
            <div class="hours jc-c mt-md">
                <span class="text--bold">po:</span>
                <span>10:30 - 13:30</span>
                <span class="text--bold">út:</span>
                <span>10:30 - 13:30</span>
                <span class="text--bold">st:</span>
                <span>10:30 - 13:30</span>
                <span class="text--bold">čt:</span>
                <span>10:30 - 13:30</span>
                <span class="text--bold">pá:</span>
                <span>10:30 - 13:30</span>
            </div>
        </Box>
        <Box title="Kontakt">
            <div class="contact">
                <div class="contact__info d-f fd-c">
                    <span class="text--bold">Adresa:</span>
                    <span>Hospůdka u Marka,</span>
                    <span>Medlešice 51</span>
                    <span>538 31</span>

                    <span class="text--bold mt-lg">Telefon:</span>
                    <span>+420 606 917 959</span>

                    <span class="text--bold mt-lg">Email:</span>
                    <span>hattanmarek@seznam.cz</span>
                </div>
                <div class="contact__map">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d10263.043208034644!2d15.7755773!3d49.9783442!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xc72202e0da68db63!2sHosp%C5%AFdka%20u%20Marka!5e0!3m2!1scs!2scz!4v1594299600246!5m2!1scs!2scz" 
                        width="600" height="450" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>
                </div>
            </div>
        </Box>
    </Section>
</template>
<script>
import { Section, Box } from "@/components"

export default {
    components: {
        Section,
        Box
    }    
}
</script>
<style lang="scss" scoped>
    .box--hours {
    }

    .hours {
        display: grid;
        grid-template-columns: auto auto;
        gap: var(--gap-md)
    }
    
    .contact {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        align-items: center;

        &__info {
            text-align: center;
        }
    }
</style>