<template>
  <div
    id="intro"
    class="w-full h-svh absolute top-0 left-0 bg-black z-30 flex justify-center overflow-hidden items-center pointer-events-none animate-landingIntroFadeOut"
  >
    <div class="h-1/2 w-1/2 flex justify-center">
      <img src="/RESC.png" class="max-w-full max-h-full shimmer" />
    </div>
  </div>
</template>

<script setup lang="ts">
// Insert Nosferatu laugh
</script>

<style>
.shimmer {
  mask: linear-gradient(-60deg, #000 30%, #0005, #000 70%) right/350% 100%;
  animation:
    shimmer 2s 1s forwards,
    popIn 2s forwards cubic-bezier(0.27, 0.05, 0.3, 0.94);
  font-size: 50px;
}

@keyframes shimmer {
  100% {
    mask-position: left;
  }
}
</style>
