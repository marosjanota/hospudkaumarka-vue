<template>
  <Section>
    <Box title="Dnešní menu" v-if="getCurrentDay">
      <MenuItem
        :menu="getCurrentDay"
        :repeated="getRepeated"
        v-if="getCurrentDay"
      />
      <div class="d-f jc-c mt-xl" date="20.03.2022">
        <p class="text--bold mt-lôg">Polévka k menu malá 15Kč, velká 20kč</p>
      </div>
      <!-- <h3>28.2. - 4.3.2022 &nbsp;&nbsp; Zavřeno</h3> -->
    </Box>
    <Gallery />
    <Contact />
  </Section>
</template>

<script>
import { Section, Box, MenuItem } from "@/components";
import Contact from "@/views/Contact.vue";
import Gallery from "@/views/Gallery.vue";

export default {
  components: {
    Section,
    Box,
    Contact,
    MenuItem,
    Gallery,
  },
  computed: {
    getCurrentDay() {
      return this.$store.getters.getCurrentDay;
    },
    getRepeated() {
      return this.$store.getters.getRepeated;
    },
  },
};
</script>
