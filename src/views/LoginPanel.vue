<template>
  <BatView></BatView>
  <div class="flex justify-center mt-[10%]">
    <Panel
      header="Repository Scanner (RESC)"
      :pt:header:class="'justify-center  bg-teal-850 text-surface-0'"
      class="max-w-2xl rounded overflow-hidden"
    >
      <div class="flex flex-col items-center">
        <!-- Auth warning -->
        <div class="text-red-500 text-center font-bold p-8">
          Unauthorized access prohibited.<br />
          {{ ssoLoginPageMessage }}
        </div>
        <Button @click="login">Login</Button>
      </div>
    </Panel>
  </div>
</template>

<script setup lang="ts">
import AuthService from '@/services/auth-service';
import Config, { dispatchError } from '@/configuration/config';
import { useAuthUserStore } from '@/store/index';
import { useRouter } from 'vue-router';
import { onKeyStroke } from '@vueuse/core';
import Panel from 'primevue/panel';
import Button from 'primevue/button';
import BatView from '@/components/Login/BatView.vue';

const ssoLoginPageMessage = `${Config.value('ssoLoginPageMessage')}`;
const router = useRouter();
const store = useAuthUserStore();

function login() {
  AuthService.requestLoginPage();
}

/* istanbul ignore if -- @preserve */
if (store.idToken && !AuthService.isTokenExpired(store.idToken)) {
  if (store.destinationRoute) {
    router.push(store.destinationRoute).catch(dispatchError);
  } else {
    router.push('/').catch(dispatchError);
  }
}
onKeyStroke('Enter', login, { eventName: 'keydown' });
</script>
