<template>
  <KeybindingModal ref="keybindingModal"></KeybindingModal>
  <div class="topbar-menu-group me-4 mt-2">
    <div
      class="square float-start px-3 d-flex align-items-center cursor-help justify-content-center rounded-circle bg-warning text-white font-weight-bold"
      @click="showKeybindingHelp"
    >
      ?
    </div>

    <b-button-toolbar
      aria-label="Toolbar with button groups and dropdown menu"
      class="float-end"
      v-if="displayLoggedInUser"
    >
      <b-dropdown class="mx-1" right toggle-class="rounded-circle" no-caret>
        <template #button-content>
          <FontAwesomeIcon icon="user" />
        </template>

        <b-dropdown-item disabled>
          <table aria-hidden="true">
            <tr>
              <td class="user-avatar-badge">
                <b-avatar
                  button
                  v-bind:text="avatarText"
                  class="align-baseline user-avatar"
                ></b-avatar>
              </td>
              <td>
                <span class="profile-menu-username">{{ userFullName }}</span
                ><br /><span class="profile-menu-email">{{ userEmail }}</span>
              </td>
            </tr>
          </table>
        </b-dropdown-item>

        <div>
          <b-dropdown-divider></b-dropdown-divider>
          <b-dropdown-item v-on:click="logout">
            <FontAwesomeIcon class="sign-out-icon" icon="sign-out-alt" />
            <span class="sign-out-text">Logout</span></b-dropdown-item
          >
        </div>
      </b-dropdown>
    </b-button-toolbar>
  </div>
</template>

<script lang="ts" setup>
import KeybindingModal from '@/components/Help/KeybindingModal.vue';
import AuthService from '@/services/auth-service';
import Config from '@/configuration/config';
import { useAuthUserStore } from '@/store/index';
import { computed, ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const keybindingModal = ref();

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

function logout() {
  AuthService.doLogOut();
}

function showKeybindingHelp() {
  keybindingModal.value.show();
}
</script>
<style scoped>
.topbar-menu-group {
  float: right;
}

.square {
  height: 38px;
  width: 40px;
}

.cursor-help {
  cursor: help;
}
</style>
