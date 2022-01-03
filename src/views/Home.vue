<template>
  <Section>
    <Box title="Dnešní menu" v-if="getCurrentDay" >
      <MenuItem :menu="getCurrentDay" :repeated="getRepeated" v-if="getCurrentDay"/>
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
          return this.$store.getters.getCurrentDay
      },
      getRepeated () {
        return this.$store.getters.getRepeated
      }
  }
}
</script>
