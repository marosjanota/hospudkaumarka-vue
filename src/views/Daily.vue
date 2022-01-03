<template>
    <Section>
         <Box title="Polední menu">
            <div class="menu" v-for="m in getMenu" :key="m.id" > 
                <MenuItem :menu="m" :repeated="getRepeated"/>
            </div>
        </Box>
    </Section>
</template>
<script>
import { Section, MenuItem, Box } from '@/components' 

export default {
    components: {
        Section,
        MenuItem,
        Box,
    },
    computed: {
        getMenu() {
            return this.$store.getters.getMenu
        },
        getRepeated() {
            return this.$store.getters.getRepeated
        }
    }
}
</script>
<style lang="scss">
    .menu + .menu {
        margin-top: var(--gap-lg);
    }
</style>