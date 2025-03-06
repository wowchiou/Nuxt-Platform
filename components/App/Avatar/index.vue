<script setup lang="ts">
const router = useRouter();
const { signout } = useAuthStore();

const avatarMenuList = [
  {
    icon: 'material-symbols:settings',
    label: '帳戶設定',
    action: () => navigateTo('/'),
  },
  {
    icon: 'material-symbols:exit-to-app',
    label: '登出',
    action: handleSignout,
  },
];

async function handleSignout() {
  const isLogout = await signout();
  if (!isLogout) return;
  router.go(0);
}
</script>

<template>
  <el-dropdown placement="bottom-end" trigger="click">
    <el-avatar
      :size="34"
      src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
    />
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="itm in avatarMenuList"
          :key="itm.label"
          @click="itm.action"
        >
          <Icon class="app-icon" :name="itm.icon" />
          <span class="ml-2">{{ itm.label }}</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style scoped></style>
