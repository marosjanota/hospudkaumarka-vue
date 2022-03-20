<template>
  <Section>
    <Box title="Polední menu">
      <div class="menu" v-for="m in getMenu" :key="m.id">
        <MenuItem :menu="m" :repeated="getRepeated" />
      </div>
      <div class="d-f jc-c mt-xl">
        <p class="text--bold mt-lôg">Polévka k menu malá 15Kč, velká 20kč</p>
      </div>
      <!-- <h3>28.2. - 4.3.2022 &nbsp;&nbsp; Zavřeno</h3> -->
    </Box>
  </Section>
</template>
<script>
import { Section, MenuItem, Box } from "@/components";

export default {
  components: {
    Section,
    MenuItem,
    Box,
  },
  computed: {
    getMenu() {
      return this.$store.getters.getMenu;
    },
    getRepeated() {
      return this.$store.getters.getRepeated;
    },
  },
};
</script>
<style lang="scss">
.menu + .menu {
  margin-top: var(--gap-lg);
}
</style>
