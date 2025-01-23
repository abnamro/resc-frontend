<template>
  <!-- Easter Egg -->
  <ProgressBar
    v-if="idToken"
    :value="timeLeft"
    class="fixed bottom-0 w-full h-2 z-20 scale-x-[-1] rounded-none"
    :pt:label:class="'hidden'"
    :pt:value:class="'bg-yellow-520'"
  ></ProgressBar>
</template>
<script setup lang="ts">
import { dispatchError, dispatchMessage } from '@/configuration/config';
import { useAuthUserStore } from '@/store';
import * as jose from 'jose';
import { storeToRefs } from 'pinia';
import ProgressBar from 'primevue/progressbar';
import { onMounted, ref } from 'vue';

const store = useAuthUserStore();
const { idToken } = storeToRefs(store);
const timeLeft = ref(0);

function updateTimer(): void {
  if (idToken.value === null) {
    return;
  }

  try {
    const claims = jose.decodeJwt(idToken.value);
    if (claims.exp === undefined) {
      dispatchMessage('Token is null');
      return;
    }

    timeLeft.value = Math.floor(((claims.exp - Math.floor(Date.now() / 1000)) * 100) / 3600);
  } catch (error) {
    dispatchError(error);
  }
}

onMounted(() => window.setInterval(updateTimer, 1000));
</script>
