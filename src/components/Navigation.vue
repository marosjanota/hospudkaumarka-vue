<template lang="html">
    <Section>
        <nav class="nav d-f fd-r jc-sb ai-c">
            <router-link to="/" class="logo">
                <!-- <img :src="require('@/assets/logo.svg')" class="logo"/> -->
                <div class="box ta-c" >
                    Hospůdka<br/> u Marka
                </div>
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
import Section from "@/components/Section.vue"

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
                position: relative;
                text-transform: uppercase;
                color: var(--color-font);
                padding: var(--gap-md) var(--gap-md);
                margin: 0 var(--gap-lg);
                text-decoration: none;
                font-weight: 600;
                letter-spacing: 1px;

                &.active {
                    color: var(--color-primary)
                }

                &:before, &:after {
                    position: absolute;
                    width: 35px;
                    height: 2px;
                    background: var(--color-font);
                    content: '';
                    opacity: 0.2;
                    transition: all 0.3s;
                    pointer-events: none;
                }

                &:before {
                    top: 0;
                    left: 0;
                    transform: rotate(90deg);
                    transform-origin: 0 0;
                }

                
                &:after {
                    right: 0;
                    bottom: 0;
                    transform: rotate(90deg);
                    transform-origin: 100% 0;
                }

                &:hover, &.router-link-active {
                    &:before {
                        left: 50%;
                        transform: rotate(0deg) translateX(-50%);
                        opacity: 1;
                    }
                    &:after {
                        right: 50%;
                        transform: rotate(0deg) translateX(50%);
                        opacity: 1;
                    }
                }
            }
        }
        
    }

    .logo {
        display: block;
        font-size: 2rem;
        line-height: 1;
        text-decoration: none;
        color: black;

        .box {
            padding: 5px 2rem;
            margin: 0;
        }
    }
</style>
