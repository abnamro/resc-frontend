<template>
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
      'sidebar-closed': sidebarCollapsed,
      'sidebar-opened': !sidebarCollapsed,
    }"
  >
    <div class="container-fluid">
      <RouterView />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, RouterView } from 'vue-router';
import { SidebarMenu } from 'vue-sidebar-menu';
import TopBarMenu from '@/components/Navigation/TopBarMenu.vue';
import { sidebarMenu } from '@/components/Navigation/Navigation';
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css';
import { disableScrollingWithArrowsAndCtrlA, shouldIgnoreKeystroke } from './utils/keybind-utils';
import { onKeyStroke } from '@vueuse/core';
import ErrorView from './views/ErrorView.vue';
import Toast from 'primevue/toast';

const route = useRoute();

const sidebarNavigationMenu = sidebarMenu;
const sidebarCollapsed = ref(false);

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

disableScrollingWithArrowsAndCtrlA();
</script>
