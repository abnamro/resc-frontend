<template>
  <div>
    <BContainer class="login-container justify-content-md-center col-8">
      <BRow class="resc-header">
        <BCol>
          <!-- Application Name -->
          <div>Repository Scanner (RESC)</div>
        </BCol>
      </BRow>
      <BRow>
        <BCol>
          <!-- Auth warning -->
          <div class="warning-msg text-start fw-bold">
            Unauthorized access prohibited.<br />
            {{ ssoLoginPageMessage }}
          </div>
        </BCol>
      </BRow>
      <BRow>
        <BCol>
          <BButton variant="primary" class="mx-auto" v-on:click="login"> LOGIN </BButton>
        </BCol>
      </BRow>
    </BContainer>
  </div>
</template>

<script setup lang="ts">
import AuthService from '@/services/auth-service';
import AxiosConfig from '@/configuration/axios-config';
import Config from '@/configuration/config';
import { useAuthUserStore } from '@/store/index';
import { useRouter } from 'vue-router';
import { onKeyStroke } from '@vueuse/core';
import { BButton, BCol, BContainer, BRow } from 'bootstrap-vue-next';

const ssoLoginPageMessage = `${Config.value('ssoLoginPageMessage')}`;
const router = useRouter();
const store = useAuthUserStore();

function login() {
  AuthService.requestLoginPage();
}

/* istanbul ignore if -- @preserve */
if (store.idToken && !AuthService.isTokenExpired(store.idToken)) {
  if (store.destinationRoute) {
    router.push(store.destinationRoute).catch((error) => {
      AxiosConfig.handleError(error);
    });
  } else {
    router.push('/').catch((error) => {
      AxiosConfig.handleError(error);
    });
  }
}
onKeyStroke('Enter', login, { eventName: 'keydown' });
</script>

<style scoped>
.warning-msg {
  color: red;
}
.page-title {
  color: #939393;
}
.login-container {
  margin-top: 10%;
  border: 1px solid #6c757d;
  border-radius: 3px;
}
.login-container .row {
  padding-top: 15px;
  padding-bottom: 15px;
}
.resc-header {
  background: #01857a;
  color: white;
  font-weight: bold;
}
</style>
