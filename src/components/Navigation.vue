<template lang="html">
    <Section>
        <nav class="nav d-f fd-r jc-sb ai-c">
            <router-link to="/" class="">
                <img :src="require('@/assets/logo.svg')" class="logo"/>
            </router-link>
            

            <div class="nav__items">
                <router-link to="/denni-nabidka" class="nav__items--item">Denní nabídka</router-link>
                <router-link to="/napojovy-lister" class="nav__items--item">Nápojový lístek</router-link>
                <router-link to="/pronajem" class="nav__items--item">Pronájem </router-link>
                <router-link to="/kontakt" class="nav__items--item">Kontakt</router-link>
            </div>

            <div class="nav__burger">

            </div>
        </nav>
    </Section>        
</template>
<script>
import { Section } from "@/components"

export default {
    components: {
        Section   
    }
}
</script>
<style lang="scss" scoped>
    .nav {

        &__items {
            &--item {
                text-transform: uppercase;
                color: var(--color-font);
                padding: var(--gap-md) var(--gap-lg);
                text-decoration: none;
                font-weight: 600;
                letter-spacing: 1px;

                &.active {
                    color: var(--color-primary)
                }
            }
        }
        
    }

    .logo {
        display: block;
        height: 5rem;
    }
</style>