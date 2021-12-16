<template>
  <Section>
    <Box title="Dnešní menu" v-if="menu" >
      <MenuItem :menu="menu"/>       
    </Box>
    <Gallery/>
    <Contact/>
  </Section>

</template>

<script lang="ts">
import { useStore } from  'vuex'

import { Section, Box, MenuItem } from "@/components"
import Contact from "@/views/Contact.vue"
import Gallery from "@/views/Gallery.vue"

export default {
  components: {
    Section,
    Box,
    Contact,
    MenuItem,
    Gallery
  },
  setup () {
        const store = useStore()
        const menu = store.getters.getCurrentDay 
        
        return {
            menu
        }
    }
}
</script>
