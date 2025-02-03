<template>
  <SessionTimeout />
  <ErrorView />
  <Toast />
  <SidebarMenu
    :menu="sidebarNavigationMenu"
    v-model:collapsed="sidebarCollapsed"
    :show-one-child="true"
    :disable-hover="true"
    width="250px"
    @update:collapsed="onToggleCollapse"
    v-if="showMenu"
  />
  <TopBarMenu v-if="showMenu" />
  <div
    id="content-wrapper"
    :class="{
      'overflow-x-hidden': true,
      'sidebar-closed': sidebarCollapsed,
      'sidebar-opened': !sidebarCollapsed,
    }"
  >
    <div class="container-fluid pb-8">
      <RouterView />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, RouterView } from 'vue-router';
import { SidebarMenu } from 'vue-sidebar-menu';
import TopBarMenu from '@/components/Navigation/TopBarMenu.vue';
import { sidebarMenu } from '@/components/Navigation/Navigation';
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css';
import { disableScrollingWithArrowsAndCtrlA, shouldIgnoreKeystroke } from './utils/keybind-utils';
import { onKeyStroke } from '@vueuse/core';
import ErrorView from './views/ErrorView.vue';
import Toast from 'primevue/toast';
import SessionTimeout from './components/Login/SessionTimeout.vue';
import { useDarkMode } from './composables/useDarkmode';
import { useAuthUserStore } from './store';
import { storeToRefs } from 'pinia';

const route = useRoute();

const sidebarNavigationMenu = sidebarMenu;
const sidebarCollapsed = ref(false);
const store = useAuthUserStore();
const { dark } = storeToRefs(store);
const { toggleDarkMode, setDarkMode } = useDarkMode(dark);

function onToggleCollapse(collapsed: boolean) {
  sidebarCollapsed.value = collapsed;
}

const showMenu = computed(() => {
  /* istanbul ignore if -- @preserve */
  if (route?.name === 'Login') {
    onToggleCollapse(true);
    return false;
  }
  return true;
});

/* istanbul ignore next @preserve */
onKeyStroke(
  ['`', '§', '@'],
  () => !shouldIgnoreKeystroke() && (sidebarCollapsed.value = !sidebarCollapsed.value),
  {
    eventName: 'keydown',
  },
);

/* istanbul ignore next @preserve */
onKeyStroke('b', () => !shouldIgnoreKeystroke() && toggleDarkMode(), { eventName: 'keydown' });
disableScrollingWithArrowsAndCtrlA();
onMounted(setDarkMode);
</script>
