<template>
  <div class="flex flex-col justify-start">
    <label for="comment" class="font-bold text-lg text-left text-muted-color-emphasis">
      Comment
    </label>
    <Textarea v-model="comment" :invalid="invalid" placeholder="Enter comment." rows="5" > </Textarea>
    <Message severity="error" class="mt-2" v-if="props.invalid">
      Comment must be at most {{ MAX_COMMENT_LENGTH }} characters.
    </Message>
  </div>
</template>
<script setup lang="ts">
import { MAX_COMMENT_LENGTH } from '@/configuration/config';
import Message from 'primevue/message';
import Textarea from 'primevue/textarea';
import type { Ref } from 'vue';

const props = defineProps<{ invalid: boolean }>();
const comment = defineModel('comment') as Ref<string>;
</script>
