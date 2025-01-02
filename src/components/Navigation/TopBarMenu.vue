<template>
  <KeybindingModal ref="keybindingModal"></KeybindingModal>
  <div class="topbar-menu-group me-4 mt-2">
    <div
      class="square float-start px-3 d-flex align-items-center cursor-help justify-content-center rounded-circle bg-warning text-white font-weight-bold"
      @click="showKeybindingHelp"
    >
      ?
    </div>

    <BButtonToolbar
      aria-label="Toolbar with button groups and dropdown menu"
      class="float-end"
      v-if="displayLoggedInUser"
    >
      <BDropdown class="mx-1" right toggle-class="rounded-circle" no-caret>
        <template #button-content>
          <FontAwesomeIcon icon="user" />
        </template>

        <BDropdownItem disabled>
          <table aria-hidden="true">
            <tbody>
            <tr>
              <td class="user-avatar-badge">
                <BAvatar
                  button
                  v-bind:text="avatarText"
                  class="align-baseline user-avatar"
                ></BAvatar>
              </td>
              <td>
                <span class="profile-menu-username">{{ userFullName }}</span
                ><br /><span class="profile-menu-email">{{ userEmail }}</span>
              </td>
            </tr>
            </tbody>
          </table>
        </BDropdownItem>

        <div>
          <BDropdownDivider />
          <BDropdownItem v-on:click="logout">
            <FontAwesomeIcon class="sign-out-icon" icon="sign-out-alt" />
            <span class="sign-out-text">Logout</span></BDropdownItem
          >
        </div>
      </BDropdown>
    </BButtonToolbar>
  </div>
</template>

<script lang="ts" setup>
import KeybindingModal from '@/components/Help/KeybindingModal.vue';
import AuthService from '@/services/auth-service';
import Config from '@/configuration/config';
import { useAuthUserStore } from '@/store/index';
import { computed, ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  BAvatar,
  BButtonToolbar,
  BDropdown,
  BDropdownDivider,
  BDropdownItem,
} from 'bootstrap-vue-next';

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
