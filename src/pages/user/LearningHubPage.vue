<template>
  <div
    class="min-h-screen flex flex-col bg-gradient-to-b from-purple-400 via-pink-300 to-yellow-200 overflow-hidden"
  >
    <Topbar class="flex-shrink-0 fixed top-0 left-0 w-full z-20" />

    <!-- Main Content -->
    <main
      class="flex-1 overflow-y-auto mt-[72px] sm:mt-[80px] flex flex-col items-center px-4 py-10 sm:py-20"
    >
      <div
        class="bg-white rounded-3xl shadow-2xl p-6 sm:p-12 w-full max-w-5xl text-center"
      >
        <h2
          class="text-2xl sm:text-4xl font-black text-purple-700 mb-6 sm:mb-10"
        >
          Sight Words Learning Hub
        </h2>

        <LearnCVCView />
      </div>
    </main>
  </div>
</template>

<script setup>
import LearnCVCView from "./LearnCVCView.vue";
import Topbar from "../../components/Topbar.vue";
</script>

<style scoped>
/* Optional: Smooth scrolling for better UX */
main {
  scroll-behavior: smooth;
}
</style>