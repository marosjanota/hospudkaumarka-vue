<template lang="html">
  <Section class="contact-box">
    <Box title="Otevírací doba" class="box--hours w-50 ml-a mr-a" titleCenter>
      <div class="hours jc-c mt-md">
        <span class="text--bold">po:</span>
        <span>10:30 - 13:00</span>
        <span></span>

        <span class="text--bold">út:</span>
        <span>10:30 - 13:00</span>
        <span></span>

        <span class="text--bold">st:</span>
        <span>10:30 - 13:00</span>
        <span class="ml-lg">18:00 - 22:00</span>

        <span class="text--bold">čt:</span>
        <span>10:30 - 13:00</span>
        <span></span>

        <span class="text--bold">pá:</span>
        <span>10:30 - 13:00</span>
        <span class="ml-lg">19:00 - 23:00</span>
      </div>
    </Box>
    <Box title="Kontakt">
      <div class="contact">
        <div class="contact__info d-f fd-c">
          <span class="text--bold">Adresa:</span>
          <span>Hospůdka u Marka,</span>
          <span>Medlešice 51</span>
          <span>538 31</span>

          <span class="text--bold mt-lg">Telefon:</span>
          <a href="tel:+420606917959">+420 606 917 959</a>

          <span class="text--bold mt-lg">Email:</span>
          <a href="mailto:hattanmarek@seznam.cz">hattanmarek@seznam.cz</a>
        </div>
        <div class="contact__map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d10263.043208034644!2d15.7755773!3d49.9783442!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xc72202e0da68db63!2sHosp%C5%AFdka%20u%20Marka!5e0!3m2!1scs!2scz!4v1594299600246!5m2!1scs!2scz"
            width="600"
            height="450"
            frameborder="0"
            style="border: 0"
            allowfullscreen=""
            aria-hidden="false"
            tabindex="0"
          ></iframe>
        </div>
      </div>
    </Box>
  </Section>
</template>
<script>
import { Section, Box } from "@/components";

export default {
  components: {
    Section,
    Box,
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/Base/Mixins/responsive";
.hours {
  display: grid;
  grid-template-columns: auto auto auto;
  gap: var(--gap-md);
}

.contact {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-items: center;

  &__info {
    text-align: center;
  }

  @include mq("tablet", max) {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
    grid-gap: var(--gap-md);

    &__map iframe {
      max-width: 100%;
      height: auto;
      margin-top: var(--gap-lg);
    }
  }
}

@include mq("tablet", max) {
  .w-50 {
    width: 100%;
  }
}
</style>
