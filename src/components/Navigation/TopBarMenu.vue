<template>
  <KeybindingModal v-model:visible="isKeybindingModalOpen" />
  <div class="absolute right-4 top-2 flex gap-2">
    <div @click="toggleDarkMode" class="p-button-icon-only p-button-rounded p-button-secondary cursor-pointer flex justify-center items-center opacity-0 hover:opacity-100 transition-opacity duration-300 dark:hidden pt-1 bg-gray-840 fill-gray-50">
        <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#f2f2f2" d="M362.005 149.115s-7 55.77-79 83.36v-24.69c-2.76-1-4.63 7.88-7.26 9.15h-39.49c-2.63-1.27-4.5-10.11-7.26-9.15v24.69c-72-27.59-79-83.36-79-83.36-60.71 67.68-121.41 80-121.41 80 102.53-16.11 101.36 44.89 101.36 44.89 69.71-11.91 65.64 36.31 65.64 36.31 60.63-6.9 60.41 52.57 60.41 52.57s-.22-59.47 60.41-52.57c0 0-4.07-48.22 65.64-36.31 0 0-1.16-61 101.37-44.88.02.01-60.69-12.33-121.41-80.01z"></path></g></svg>
      </div>
    <Button rounded class="hidden dark:flex" icon="pi pi-sun" severity="secondary" @click="toggleDarkMode"></Button>
    <Button rounded icon="pi pi-question" severity="secondary" @click="isKeybindingModalOpen = true"></Button>
    <Button rounded icon="pi pi-user" v-if="displayLoggedInUser" @click="toggle"></Button>
    <Popover ref="op" v-if="displayLoggedInUser">
      <div class="flex flex-col gap-4 w-[25rem]">
        <div class="flex gap-2">
          <Avatar :label="avatarText" size="large" />
          <div class="flex flex-col justify-end">
            <span class="font-bold text-xl">{{ userFullName }}</span>
            <span class="text-sm text-muted-color">{{ userEmail }}</span>
          </div>
        </div>
        <div class="flex justify-end">
          <Button text icon="pi pi-sign-out" @click="logout" label="Logout"></Button>
        </div>
      </div>
    </Popover>
  </div>
</template>

<script lang="ts" setup>
import KeybindingModal from '@/components/Help/KeybindingModal.vue';
import AuthService from '@/services/auth-service';
import Config from '@/configuration/config';
import { useAuthUserStore } from '@/store/index';
import { computed, ref } from 'vue';
import Popover from 'primevue/popover';
import Button from 'primevue/button';
import Avatar from 'primevue/avatar';
import { useDarkMode } from '@/composables/useDarkmode';
import { storeToRefs } from 'pinia';

const isKeybindingModalOpen = ref(false);
const op = ref();

const store = useAuthUserStore();
const { dark } = storeToRefs(store);
const { toggleDarkMode } = useDarkMode(dark);

const displayLoggedInUser = computed(() => {
  const authenticationRequired = `${Config.value('authenticationRequired')}`;
  return authenticationRequired === 'true' ? true : false;
});

const avatarText = computed(() => {
  const store = useAuthUserStore();
  return store.firstName && store.lastName
    ? `${store.firstName.charAt(0)}${store.lastName.charAt(0)}`
    : undefined;
});

const userFullName = computed(() => {
  const store = useAuthUserStore();
  return store.firstName && store.lastName ? `${store.firstName} ${store.lastName}` : null;
});

const userEmail = computed(() => {
  const store = useAuthUserStore();
  return store.email ? `${store.email}` : null;
});

function toggle(event: Event) {
  op.value.toggle(event);
}

function logout() {
  AuthService.doLogOut();
}

</script>
