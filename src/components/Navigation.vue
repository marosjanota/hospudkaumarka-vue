<template lang="html">
    <nav class="nav" :class="{'opened': burgerCheck}" >
        <div class="nav__body">
            <router-link to="/" class="logo">
                <!-- <img :src="require('@/assets/logo.svg')" class="logo"/> -->
                <div class="box ta-c" >
                    Hospůdka<br/> u Marka
                </div>
            </router-link>
            <div class="nav__items">
                <router-link to="/poledni-menu" class="nav__items--item">Denní nabídka</router-link>
                <router-link to="/napojovy-lister" class="nav__items--item">Nápojový lístek</router-link>
                <router-link to="/pronajem" class="nav__items--item">Pronájem </router-link>
                <router-link to="/kontakt" class="nav__items--item">Kontakt</router-link>
            </div>

            <div class="nav__burger" @click="openBurger">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    </nav>
</template>
<script>
import { ref, watch } from 'vue' 
import { useRoute } from 'vue-router'

export default {
    setup () {
        const route = useRoute()
        const burgerCheck = ref(false)

        function openBurger() {
            burgerCheck.value = !burgerCheck.value
        }
        
        watch(route, () => {
            window.scrollTo({top: 0})
            burgerCheck.value = false
        })

        return {
            burgerCheck,
            openBurger
        }
    }
}
</script>
<style lang="scss" scoped>
@import "@/styles/Base/Mixins/responsive";

$hamburger-item-width: 32px;
$hamburger-item-height: 4px;
$hamburger-item-gap: 6px;
$hamburger-item-color: var(--color-primary);
$hamburger-size: calc(var(--gap-lg) * 2 + #{$hamburger-item-width});

.nav {
    --color-navigation: rgb(255, 255, 255);
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 100;
    transition: all ease;
    background-color: var(--color-background);
    padding: var(--gap-md);
    box-shadow: 0 0 3px 2px rgb(0 0 0 / 11%);

    &__body {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 1150px;
        max-width: 100%;
        margin: 0 auto;
    }

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

            &:before, &:after {
                position: absolute;
                width: 35px;
                height: 2px;
                background: var(--color-primary);
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

    
     &.opened .nav__burger span {
        opacity: 1;
        transform: rotate(45deg) translate(2px, -2px);
        background: #232323;

        &:nth-child(2) {
          opacity: 0;
          transform: rotate(0deg) scale(0.2, 0.2);
        }

        &:nth-child(3) {
          transform: rotate(-45deg) translate(0, -1px);
        }
    }

    &.opened .nav__items {
      transform: none;
    }

    &__burger {
        display: block;
        position: relative;
        margin: var(--gap-lg) var(--gap-lg) var(--gap-lg) auto;
        -webkit-user-select: none;
        user-select: none;
        cursor: pointer;
    
        @include mq('desktop-large') {
            display: none;
        }

        span {
            display: block;
            width: $hamburger-item-width;
            height: $hamburger-item-height;
            margin-bottom: $hamburger-item-gap;
            position: relative;
            background: $hamburger-item-color;
            border-radius: 3px;
            z-index: 1;
            transform-origin: $hamburger-item-height 0px;
            transition: transform 0.5s cubic-bezier(0.77,0.2,0.05,1.0),
                        background 0.5s cubic-bezier(0.77,0.2,0.05,1.0),
                        opacity 0.55s ease;
    
            &:first-child {
                transform-origin: 0% 0%;
            }
            &:nth-last-child(2) {
            transform-origin: 0% 100%;
            }
        }
    }

    
        
    @include mq('tablet', max) {
        min-height: 60px;

        &__body {
            min-height: 60px;
            padding: var(--gap-md) 0;
        }

        &__burger {
            margin: var(--gap-md) var(--gap-lg) var(--gap-md) auto;
        }
    }

    
    &__items {
        display: flex;
        flex-direction: row;
        justify-content: center;
    
        @include mq('desktop-large', max) {
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            position: absolute;
            top: 80px;
            left: 0;
            width: 100%;
            //min-height: calc(100vh - 96px);
            padding: 4rem var(--gap-lg);
            background-color: var(--color-navigation);
            list-style-type: none;
            -webkit-font-smoothing: antialiased;
            transform-origin: 0% 0%;
            transform: translate(100%, 0);
            transition: transform 0.5s cubic-bezier(0.77,0.2,0.05,1.0);

            .nav__items--item {
                margin: var(--gap-md) 0;
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

    @include mq('tablet', max) {
        display: flex;
        font-size: 1.2rem;
    }
}
</style>
