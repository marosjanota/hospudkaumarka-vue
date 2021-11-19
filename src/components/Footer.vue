<template lang="html">
    <footer>
        <Section secondary>
            <div class="d-f jc-c">
                &copy; {{ new Date().getFullYear() }} | Maroš Janota 
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

</style>