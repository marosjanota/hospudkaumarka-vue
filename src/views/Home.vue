<template>
  <Section>
    <Box title="Dnešní menu" v-if="getCurrentDay">
      <MenuItem
        :menu="getCurrentDay"
        :repeated="getRepeated"
        v-if="getCurrentDay"
      />
      <div class="d-f jc-c mt-xl ta-c" date="8.05.2022">
        <p class="text--bold mt-lg ta-c">
          Polévka k menu malá 15Kč, velká 20kč
        </p>
      </div>
      <!-- <hr/>
      <h3 class="ta-c">6. 3. - 10. 3. 2023 &nbsp;&nbsp; Zavřeno - dovolená</h3> -->
    </Box>
    <Actions :visible="false" />
    <Gallery />
    <Contact />
  </Section>
</template>

<script>
import { Section, Box, MenuItem } from "@/components";
import Actions from "@/views/Actions.vue";
import Contact from "@/views/Contact.vue";
import Gallery from "@/views/Gallery.vue";

export default {
  components: {
    Section,
    Box,
    Actions,
    Contact,
    MenuItem,
    Gallery
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
