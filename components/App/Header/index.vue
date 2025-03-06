<script setup lang="ts">
interface Menu {
  title: string;
  icon?: string | undefined;
  path?: string;
  children?: Menu[];
}

interface MenuWithParent extends Omit<Menu, 'children'> {
  parentTitle: string;
}

// 扁平化菜單
const flatMenu = APP_MENU_LIST.reduce<MenuWithParent[]>((acc, itm) => {
  const childWithParent = itm.children.map((c) => ({
    ...c,
    parentTitle: itm.title,
  }));
  return acc.concat(childWithParent);
}, []);

const title = computed(
  () =>
    flatMenu.find((itm) => useRoute().path.startsWith(itm.path!))?.title ??
    undefined
);
</script>

<template>
  <header class="px-5 py-2 flex justify-between items-center">
    <div>
      <p v-if="title" class="font-bold">{{ title }}</p>
    </div>
    <AppAvatar />
  </header>
</template>

<style scoped></style>
