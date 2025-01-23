<template>
  <div v-if="errors.length > 0" class="absolute p-2 bottom-0 right-0">
    <Button
      icon="pi pi-exclamation-triangle"
      class="rounded-full z-50"
      @click="isOpen = !isOpen"
    ></Button>
  </div>
  <Collapse
    class="v-collapse w-full flex flex-col z-50 justify-center absolute bg-black/90 text-left"
    :when="isOpen && errors.length > 0"
  >
    <h1 class="font-bold text-green-400 text-xl px-4 pt-4 pb-2 underline">Error logs:</h1>
    <div v-for="(error, idx) in errors" class="px-4 text-green-300" :key="'error' + idx">
      <span v-if="isJsError(error)">
        {{ error.message }} in {{ error.filename }}:{{ error.lineno }}
      </span>
      <span v-else-if="isAxiosEvent(error)">
        {{ error.code }} : {{ error.config.url }} -- {{ error.message }}
      </span>
      <span v-else-if="isReponseEvent(error) && error.data === ''">
        {{ error.status }} : {{ error.config.method }} -- {{ error.config.baseURL }}
      </span>
      <span v-else-if="isReponseEvent(error)">
        {{ error.status }} : {{ error.header }} -- {{ error.data }}
      </span>
      <span v-else-if="isMessageEvent(error)">{{ error.message }}</span>
      <span v-else>{{ error }}</span>
    </div>
  </Collapse>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { Collapse } from 'vue-collapsed';
import Button from 'primevue/button';
import { onKeyStroke } from '@vueuse/core';
import { shouldIgnoreKeystroke } from '@/utils/keybind-utils';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

type ErrorEvent = {
  message: string;
  filename: string;
  lineno: number;
  colno: number;
  error: Error;
};

type MessageEvent = {
  type: 'message';
  message: string;
};

type ResponseEvent = {
  status: number;
  data: string;
  header: any;
  config: {
    method: string;
    baseURL: string;
  };
};

type AxiosEvent = {
  config: { url: string };
  code: string;
  message: string;
};

type ERAEvent = ErrorEvent | ResponseEvent | AxiosEvent | MessageEvent;

const isOpen = ref(false);
const errors = ref<ERAEvent[]>([]);

window.addEventListener('error', errorHandler);

function errorHandler(e: Event | CustomEvent) {
  // @ts-expect-error
  if (e.detail !== undefined) {
    // @ts-expect-error
    const details = e.detail;

    if (details.axios !== undefined) {
      errors.value.push(details.axios);
    } else if (details.response !== undefined) {
      errors.value.push(details.response);
      toast.add({
        severity: 'error',
        summary: details.response.data,
        life: 3000,
      });
    } else {
      errors.value.push(details);
    }
  } else {
    // @ts-expect-error
    errors.value.push(e as ErrorEvent);
  }
}

function isJsError(e: ERAEvent): e is ErrorEvent {
  // @ts-expect-error
  return e.filename !== undefined;
}

function isAxiosEvent(e: ERAEvent): e is AxiosEvent {
  // @ts-expect-error
  return e.code !== undefined;
}

function isReponseEvent(e: ERAEvent): e is ResponseEvent {
  // @ts-expect-error
  return e.status !== undefined;
}

function isMessageEvent(e: ERAEvent): e is MessageEvent {
  // @ts-expect-error
  return e.type === 'message';
}

function openOrToast() {
  if (errors.value.length === 0) {
    toast.add({
      severity: 'success',
      summary: 'NSTR',
      detail: 'No errors have been reported.',
      life: 3000,
    });
  } else {
    isOpen.value = !isOpen.value;
  }
}

onKeyStroke('~', () => !shouldIgnoreKeystroke() && openOrToast());
</script>

<style lang="css">
.v-collapse {
  transition: height 10ms ease-out;
  /* or transition: height var(--vc-auto-duration) ease-in-out */
}
</style>
