import type { Ref } from "vue";

export function useDarkMode(dark: Ref<boolean>) {

    function setDarkMode() {
        if (dark.value) {
            document.getElementById('app')?.classList.add('dark');
        } else {
            document.getElementById('app')?.classList.remove('dark');
        }
    }
    function toggleDarkMode() {
        dark.value = !dark.value;
        setDarkMode();
    }
      
    return { setDarkMode, toggleDarkMode }
}