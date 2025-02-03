import type { Ref } from 'vue';

export function useDarkMode(dark: Ref<boolean>) {
  function setDarkMode() {
    if (dark.value) {
      document.getElementsByTagName('body')[0].classList.add('dark');
    } else {
      document.getElementsByTagName('body')[0].classList.remove('dark');
    }
  }
  function toggleDarkMode() {
    dark.value = !dark.value;
    setDarkMode();
  }

  return { setDarkMode, toggleDarkMode };
}
