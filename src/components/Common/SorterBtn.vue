<template>
  <i v-if="!props.is" class="pi pi-sort-alt"></i>
  <i v-else-if="props.by === 1" class="pi pi-sort-amount-up-alt"></i>
  <i v-else class="pi pi-sort-amount-down"></i>
</template>
<script setup lang="ts">
const props = defineProps<{
  is: boolean;
  by: 1 | -1;
}>();
</script>
