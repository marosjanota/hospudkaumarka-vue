<template lang="html">
    <div class="box" :class="{ 'box--title-center': titleCenter }">
        <h2 class="box__title">{{ title }}</h2>
        <div class="box__content">
            <slot></slot>
        </div>
    </div>
</template>
<script>

export default {
    props: {
        
        titleCenter: {
            type: Boolean,
            default: false
        },
        title: String,
    }    
}
</script>
<style lang="scss">
    .box {
        position: relative;
        border: 2px solid var(--color-border);
        margin-top: 2rem;

        &__title {
            position: absolute;
            top: 0;
            left: 2rem;
            transform: translate(0, -50%);
            padding: var(--gap-md) var(--gap-lg);
            margin: 0;
            background-color: var(--color-background);
            text-transform: uppercase;
            white-space: nowrap;
        }

        &--title-center {
            .box__title {
                left: 50%;
                transform: translate(-50%, -50%);
            }
        }

        &__content {
            padding: var(--gap-xl) var(--gap-xl) var(--gap-lg) var(--gap-xl);
        }

        + .box {
            margin-top: 4rem;
        }
    }
</style>