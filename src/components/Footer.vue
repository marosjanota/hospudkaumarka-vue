<template lang="html">
    <footer>
        <Section secondary>
            <div class="d-f jc-c">
                &copy; Hospůdka u Marka {{ new Date().getFullYear() }} | Vytvořil: <a href="https://marosjanota.cz" target="_blank" class="ml-md">Maroš Janota </a>
            </div>
         </Section>
    </footer>
</template>
<script>
import { Section } from "@/components"
export default {
    components: {
        Section
    }
}
</script>
<style lang="scss" scoped>
    footer {
        background-color: var(--color-background-sec);
        padding: var(--gap-md);
        font-weight: 500;
    }
</style>