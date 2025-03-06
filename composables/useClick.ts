export const useClick = () => {
  const clickRef = ref();
  const isActive = ref(false);

  const handleClickOutside = (event: MouseEvent) => {
    if (clickRef.value && !clickRef.value.contains(event.target as Node)) {
      isActive.value = false;
    }
  };

  onMounted(() => {
    document.addEventListener('click', handleClickOutside);
  });

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
  });

  return {
    clickRef,
    isActive,
  };
};
