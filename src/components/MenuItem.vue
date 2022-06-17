<template lang="html">
  <h3 class="title">
    {{ menu.day }} {{ format_date(repeated.mondayDate, menu.id - 1) }}
  </h3>
  <div class="menu-item" v-if="menu.open">
    <span class="menu-item__value">0,3l</span>
    <span class="menu-item__meal">{{ menu.meal01 }}</span>
    <span class="menu-item__price">{{
      menu.price01 != null ? menu.price01 : "35,-"
    }}</span>

    <span class="menu-item__value">1.</span>
    <span class="menu-item__meal">{{ menu.meal02 }}</span>
    <span class="menu-item__price">{{
      menu.price02 != null ? menu.price02 : "110,-"
    }}</span>

    <span class="menu-item__value">2.</span>
    <span class="menu-item__meal">{{ menu.meal03 }}</span>
    <span class="menu-item__price">{{
      menu.price03 != null ? menu.price03 : "120,-"
    }}</span>

    <span class="menu-item__value">3.</span>
    <span class="menu-item__meal">{{ repeated.meal04 }}</span>
    <span class="menu-item__price">{{
      repeated.price04 != null ? repeated.price04 : "125,-"
    }}</span>

    <span class="menu-item__value">4.</span>
    <span class="menu-item__meal">{{ repeated.meal05 }}</span>
    <span class="menu-item__price">{{
      repeated.price05 != null ? repeated.price05 : "120,-"
    }}</span>
  </div>
  <div v-else>
    <p>Zavřeno</p>
  </div>
</template>
<script>
import { Box } from "@/components";
import moment from "moment";

export default {
  props: {
    menu: Object,
    repeated: Object,
  },
  components: {
    Box,
  },
  methods: {
    format_date(value, day) {
      if (value) {
        return moment(String(value))
          .locale("cs")
          .add(day, "days")
          .format("DD. MMMM");
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/Base/Mixins/responsive";

.title {
  margin-bottom: var(--gap-md);
  font-weight: 500;
}

.menu-item {
  display: grid;
  grid-template-columns: 3rem 1fr auto;
  grid-gap: var(--gap-md);
  font-weight: 500;

  @include mq("tablet", max) {
    grid-template-columns: auto 1fr auto;
  }

  &__value {
    grid-column: 1;
  }

  &__meal {
    grid-column: 2;
  }

  &__price {
    grid-column: 3;
  }
}
</style>
