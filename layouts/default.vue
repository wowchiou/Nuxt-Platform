<script setup lang="ts"></script>

<template>
  <div class="w-full min-h-screen relative flex flex-col">
    <AppAside class="fixed top-0 left-0 w-[200px] h-full" />
    <AppHeader
      class="fixed top-0 right-0 w-[calc(100%-200px)] h-[56px] bg-slate-200 border border-b-white"
    />
    <div class="box-border pl-[200px] pt-[56px] flex-1 flex flex-col">
      <div class="p-5 flex-1 flex flex-col">
        <slot />
      </div>
    </div>
  </div>
</template>
