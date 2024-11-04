<script setup>
import { ref } from 'vue';
const props=defineProps({
    name: {
        type: String,
        default: ''
    },
    size: {
        type: String,
        default: '1'
    },
    color:{
        type: String,
        default: '#FFFFFF'
    }
})

const Size= ref(`${props.size}em`)
const Color= ref(`var(--q-${props.color})`)
</script>

<template>
    <div class="icon-card">
        <span :class="`ui-${name}`"></span>
    </div>
</template>

<style lang="scss">
@import './assets/icons';


.icon-card {
    span {
        font-size: v-bind(Size);
        color: v-bind(Color)
    }
}
</style>