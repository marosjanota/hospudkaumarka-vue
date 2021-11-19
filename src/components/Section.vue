<template lang="html">
    <section class="section" 
        :class="{ 
            'section--full-width' : fullWidth,
            'section--sec' : secondary
        }">
        <div class="section__content">
            <slot/>
        </div>
    </section>
</template>
<script>
export default {
    props: {
        fullWidth : {
            type: Boolean,
            default: false
        },
        secondary: {
            type: Boolean,
            default: false
        }
    }
}
</script>
<style lang="scss">
    .section {
        padding: var(--gap-lg) 0;

        &:not(.section--full-width) {
            .section__content {
                width: 1150px;
                margin: 0 auto;
            }
        }

        &--sec {
            background-color: var(--color-background-sec);
        }
    }
</style>