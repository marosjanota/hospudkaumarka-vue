<template lang="html">
    <footer>
        <Section secondary>
            <div class="ta-c">
                &copy; Hospůdka u Marka {{ new Date().getFullYear() }} 
                <span class="divider">|</span> 
                Vytvořil: <a href="https://marosjanota.cz" target="_blank" class="ml-md">Maroš Janota</a>
                <router-link to="/test" class="btn_inv ml-md" >Admin</router-link>
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
@import "@/styles/Base/Mixins/responsive";
footer {
    background-color: var(--color-background-sec);
    padding: var(--gap-md);
    font-weight: 500;
}

.btn_inv {
    color: transparent;
    font-size: 6px;
    text-decoration: none;
    cursor: default;
}
    
@include mq('mobile', max) {
    .divider {
        display: block;
        opacity: 0;
        height: 2px
    }

    .btn_inv {
        display: block;
    }
}
</style>