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

const authStore = useAuthStore();

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

    <div v-if="!authStore.isLogin" class="flex items-center gap-2 text-[14px]">
      <div class="hover:text-blue-500" @click="authStore.checkIsLogin">
        登入
      </div>
      /
      <nuxt-link class="hover:text-blue-500" to="/signup">註冊</nuxt-link>
    </div>

    <AppAvatar v-else />
  </header>
</template>

<style scoped></style>
