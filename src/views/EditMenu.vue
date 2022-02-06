<template>
  <Section class="editmenu-box">
    <Box title="Upravit polední menu">
      {{ menuItems }}
      <div class="menu" v-for="m in menuItems" :key="m.id">
        <h3 class="menu-title">{{ m.day }}</h3>
        <div class="menu-item" v-if="m.open">
          <span class="menu-item__value">0,3l</span>
          <input class="menu-item__meal" v-model="m.meal01" />
          <input class="menu-item__price" v-model="m.price01" />
          <!-- <input class="menu-item__price" v-model="m.price01 != null ? m.price01 : '25,-'"/> -->

          <span class="menu-item__value">1.</span>
          <input class="menu-item__meal" v-model="m.meal02" />
          <input class="menu-item__price" v-model="m.price02" />

          <span class="menu-item__value">2.</span>
          <input class="menu-item__meal" v-model="m.meal03" />
          <input class="menu-item__price" v-model="m.price03" />

          <span class="menu-item__value">3.</span>
          <input class="menu-item__meal" v-model="repeatedItems.meal04" />
          <input class="menu-item__price" v-model="repeatedItems.price04" />

          <span class="menu-item__value">4.</span>
          <input class="menu-item__meal" v-model="repeatedItems.meal05" />
          <input class="menu-item__price" v-model="repeatedItems.price05" />
        </div>
      </div>
      <div class="editmenu-btns mt-xl">
        <button v-on:click="printMenu">Print</button>
        <button v-on:click="updateMenu" class="ml-xl">Uložit</button>
      </div>
    </Box>
  </Section>
</template>

<script>
import axios from "axios";
import { Section, Box, MenuItem } from "@/components";

const baseUrl = "http://localhost:3311/dailyMenu";

export default {
  components: {
    Section,
    Box,
    MenuItem,
  },
  data() {
    return {
      menuItems: [],
      repeatedItems: [],
    };
  },
  async created() {
    try {
      const m = await axios.get(baseUrl);
      this.menuItems = m.data[0].menu;
      this.repeatedItems = m.data[0].repeated;
    } catch (e) {
      console.error(e);
    }
  },
  methods: {
    async updateMenu() {
      try {
        await axios
          .post("http://localhost:3311/dailyMenu", { menu: this.menuItems })
          .then(console.log("updated"))
          .catch(console.log(e));
      } catch (e) {
        console.error(e);
      }
    },
    printMenu() {
      console.log(this.menuItems);
    },
  },
};
</script>

<style lang="scss" scoped>
input {
  padding: var(--gap-md);
  font-size: 1rem;
}

button {
  padding: var(--gap-md) var(--gap-lg);
  background: var(--color-primary);
  color: var(--color-primary-text);
  border: 1px solid var(--color-primary);
  border-radius: 5px;
}
</style>
