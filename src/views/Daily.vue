<template lang="html">
    <Section>
         <Box title="Polední menu">
            <div class="menu" v-for="m in menu" :key="m.id" > 
                <MenuItem :menu="m"/>
            </div>
        </Box>
    </Section>
</template>
<script>
import { useStore } from  'vuex'

import { Section, MenuItem, Box } from '@/components' 

export default {
    components: {
        Section,
        MenuItem,
        Box
    },
    setup () {
        const store = useStore()
        const menu = store.state.dailyMenu 
        
        return {
            menu
        }
    }
}
</script>
<style lang="scss">
    .menu + .menu {
        margin-top: var(--gap-lg);
    }
</style>