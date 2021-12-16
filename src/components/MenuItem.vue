<template lang="html">
    <h3 class="title">{{menu.day}}</h3>
    <div class="menu-item">
        <span class="menu-item__value">{{menu.value01}}</span>
        <span class="menu-item__meal">{{menu.meal01}}</span>
        <span class="menu-item__price">{{menu.price01}}</span>
        
        <span class="menu-item__value">{{menu.value02}}</span>
        <span class="menu-item__meal">{{menu.meal02}}</span>
        <span class="menu-item__price">{{menu.price02}}</span>

        <span class="menu-item__value">{{menu.value03}}</span>
        <span class="menu-item__meal">{{menu.meal03}}</span>
        <span class="menu-item__price">{{menu.price03}}</span>

        <span class="menu-item__value">{{menu.value04}}</span>
        <span class="menu-item__meal">{{menu.meal04}}</span>
        <span class="menu-item__price">{{menu.price04}}</span>

        <span class="menu-item__value">{{menu.value05}}</span>
        <span class="menu-item__meal">{{menu.meal05}}</span>
        <span class="menu-item__price">{{menu.price05}}</span>
    </div>
</template>
<script>
import { Box } from '@/components'

export default {
    props: {
        menu: Object
    },
    components: {
        Box
    }    
}
</script>
<style lang="scss" scoped>
@import "@/styles/Base/Mixins/responsive";

    .title {
        margin-bottom: var(--gap-md);
        font-weight: 500;
    }

    .menu-item {
        display: grid;
        grid-template-columns: 3rem 1fr auto;
        grid-gap: var(--gap-md);
        font-weight: 500;

        @include mq('mobile', max) {
            grid-template-columns: auto 1fr auto;
        }
        
        &__value {
            grid-column: 1;
        }
        
        &__meal {
            grid-column: 2;
        }
        
        &__price {
            grid-column: 3;
        }
    }
</style>