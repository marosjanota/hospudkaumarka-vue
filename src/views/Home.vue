<template>
  <Section>
    <Box title="Dnešní menu" v-if="getCurrentDay" >
      <MenuItem :menu="getCurrentDay" v-if="getCurrentDay"/>
    </Box>
    <Gallery/>
    <Contact/>
  </Section>

</template>

<script>
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
  computed: {
      getCurrentDay () {
        console.log('asd')
          console.log(this.$store.getters.getCurrentDay.open)
          return this.$store.getters.getCurrentDay
      }
  }
}
</script>
