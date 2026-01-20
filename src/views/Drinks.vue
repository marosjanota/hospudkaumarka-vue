<template lang="html">
  <Section>
    <Box title="Alkoholické nápoje" titleCenter>
      <div v-for="b in beer" class="drinks-list">
        <span> {{ b.unit }}</span>
        <span> {{ b.name }}</span>
        <span> {{ b.price }}</span>
      </div>
    </Box>

    <Box title="Nealkoholické nápoje" titleCenter>
      <div v-for="na in nonalkoholic" class="drinks-list">
        <span> {{ na.unit }}</span>
        <span> {{ na.name }}</span>
        <span> {{ na.price }}</span>
      </div>
    </Box>

    <Box title="Teplé nápoje" titleCenter>
      <div v-for="w in warm" class="drinks-list">
        <span></span>
        <span> {{ w.name }}</span>
        <span> {{ w.price }}</span>
      </div>
    </Box>

    <Box title="Lihoviny" titleCenter>
      <div v-for="a in alkohol" class="drinks-list">
        <span> 0,4l </span>
        <span> {{ a.name }}</span>
        <span> {{ a.price04 }}</span>
      </div>
    </Box>

    <Box title="Něco k pivu" titleCenter>
      <div v-for="f in food" class="drinks-list">
        <span></span>
        <span> {{ f.name }}</span>
        <span> {{ f.price }}</span>
      </div>
    </Box>
  </Section>
</template>
<script>
import { Box, Section } from "@/components";

export default {
  components: {
    Box,
    Section,
  },
  data() {
    return {
      beer: [
        { name: "Pivo velké", price: "40,-", unit: "0,5l" },
        { name: "Pivo malé", price: "25,-", unit: "0,3l" },
        {
          name: "Vino bíle rozlévané – dle denní nabídky",
          price: "40,-",
          unit: "0,2l",
        },
        {
          name: "Vino červené rozlévané – dle denní nabídky",
          price: "40,-",
          unit: "0,2l",
        },
        { name: "Láhev vína – dle nabídky", price: "od 220,-", unit: "0,75l" },
        { name: "Sekt", price: "230,-", unit: "0,75l" },
      ],
      nonalkoholic: [
        { name: "Zulu cola velká", price: "30,-", unit: "0,5l" },
        { name: "Zulu cola malá", price: "18,-", unit: "0,3l" },
        { name: "Birel plech", price: "35,-", unit: "0,5l" },
        { name: "Voda – jemně perlivá", price: "20,-", unit: "0,33l" },
        { name: "Juice", price: "35,-", unit: "0,25l" },
        { name: "Limo relax", price: "35,-", unit: "0,33l" },
        { name: "Tonic, Vinea, Cola River", price: "35,-", unit: "0,33l" },
      ],
      warm: [
        { name: "Čaj dle nabídky", price: "30,-" },
        { name: "Turecká káva", price: "30,-" },
        { name: "Espresso", price: "35,-" },
        { name: "Svařené víno", price: "50,-" },
        { name: "Grog", price: "40,-" },
      ],
      alkohol: [
        { name: "Rum Božkov", price04: "30,-" },
        { name: "Destilát dle nabídky", price04: "35,-" },
        { name: "Becherovka", price04: "35,-" },
        { name: "Vodka", price04: "35,-" },
        { name: "Jägermeister", price04: "45,-" },
        { name: "Božkov Republika", price04: "45,-" },
        { name: "Legendario", price04: "50,-" },
        { name: "Zelená", price04: "30,-" },
      ],
      food: [
        { name: "Arašidy", price: "35,-" },
        { name: "Tyčinky", price: "35,-" },
      ],
    };
  },
};
</script>
<style lang="scss" scoped>
.section__content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.box {
  max-width: 40rem;
  margin-left: auto;
  margin-right: auto;
}

.drinks-list {
  display: grid;
  grid-template-columns: 3rem 1fr auto;
  font-weight: 500;

  &--alco {
    display: grid;
    grid-template-columns: 3rem 1fr 3rem 3rem;
  }
}
</style>
