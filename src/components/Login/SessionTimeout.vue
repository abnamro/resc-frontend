<template>
  <!-- Easter Egg -->
  <!-- Show the bat only at night ;p ? -->
  <div
    class="fixed bottom-0 w-full h-24 bg-gradient-to-t dark:from-gray-930 z-20 pointer-events-none"
  ></div>
  <div
    class="fixed bottom-0.5 z-20 -translate-x-1/2 h-10 w-14 overflow-hidden"
    :style="`left: ${100 - timeLeft}%`"
    @click="toggleDarkMode"
  >
    <img
      alt="Na na na na na na na na na na na na na na na na... BATMAN!"
      src="/bat.gif"
      class="h-10 w-14 animate-pulse dark:invert"
    />
  </div>
  <ProgressBar
    v-if="idToken"
    :value="timeLeft"
    class="fixed bottom-0 w-full h-2 z-20 scale-x-[-1] rounded-none"
    :pt:label:class="'hidden'"
  ></ProgressBar>
</template>
<script setup lang="ts">
import { useDarkMode } from '@/composables/useDarkmode';
import { dispatchError, dispatchMessage } from '@/configuration/config';
import { useAuthUserStore } from '@/store';
import * as jose from 'jose';
import { storeToRefs } from 'pinia';
import ProgressBar from 'primevue/progressbar';
import { onMounted, ref } from 'vue';

const store = useAuthUserStore();
const { dark, idToken, tokenLength } = storeToRefs(store);
const { toggleDarkMode } = useDarkMode(dark);
const timeLeft = ref(0);

function updateTimer(): void {
  if (idToken.value === null || tokenLength.value === null || tokenLength.value <= 0) {
    return;
  }

  try {
    const claims = jose.decodeJwt(idToken.value);
    if (claims.exp === undefined) {
      dispatchMessage('Token is null');
      return;
    }

    timeLeft.value = ((claims.exp - Math.floor(Date.now() / 1000)) * 100) / tokenLength.value;
  } catch (error) {
    dispatchError(error);
  }
}

onMounted(() => window.setInterval(updateTimer, 1000));
</script>
