<script setup lang="ts"></script>

<template>
  <div
    class="max-w-[500px] w-[90vw] m-auto border border-gray-200 rounded-lg py-8 px-5"
  >
    <div class="text-center">
      <h1 class="text-2xl font-bold">
        <slot name="title" />
      </h1>
      <slot name="header" />
    </div>
    <slot />
  </div>
</template>
