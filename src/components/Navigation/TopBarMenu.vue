<template>
  <KeybindingModal v-model:visible="isKeybindingModalOpen" />
  <div class="absolute right-4 top-2 flex gap-2">
    <div
      class="aspect-square float-start px-3 flex items-center cursor-pointer justify-center rounded-full bg-slate-700 text-white font-bold text-sm"
      @click="toggleDarkMode"
    >
      <i class="pi pi-moon"></i>
    </div>
    <div
      class="aspect-square float-start px-3 flex items-center cursor-help justify-center rounded-full bg-yellow-520 text-white font-bold text-sm"
      @click="isKeybindingModalOpen = true"
    >
      <i class="pi pi-question"></i>
    </div>
    <div
      class="aspect-square float-start px-3 flex items-center cursor-pointer justify-center rounded-full bg-surface-500 text-white font-bold text-xs"
      @click="toggle"
      v-if="displayLoggedInUser"
    >
      <i class="pi pi-user"></i>
    </div>
    <Popover ref="op" v-if="displayLoggedInUser">
      <div class="flex flex-col gap-4 w-[25rem]">
        <div class="flex gap-2">
          <Avatar :label="avatarText" size="large" />
          <div>
            <span class="font-bold">{{ userFullName }}</span
            ><br />
            <span class="text-sm">{{ userEmail }}</span>
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

const isKeybindingModalOpen = ref(false);
const op = ref();

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

function toggleDarkMode() {
  document.getElementById('app')?.classList.toggle('darkMode');
}
</script>
