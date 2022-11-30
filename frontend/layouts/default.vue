<template>
  <v-app dark>
    <!--v-if="$route.name!=='login'"-->
    <Header />
    <v-main>
      <nuxt />
    </v-main>
    <!-- <Footer /> -->
  </v-app>
</template>

<script>
import { initWeb3 } from '@/web3';
export default {
  head() {
    return {
      title: "NuxtJs UI kit | Free UI kit built with Vuetify",
      meta: [
        {
          hid: "description",
          name: "NuxtJs UI kit",
          content: "NuxtJs UI kit is the best way"
        }
      ]
    };
  },
  components: {
    Header: () => import("@/layouts/sections/Header2"),
    Footer: () => import("@/layouts/sections/Footer")
  },
  methods: {},
  mounted() {
    initWeb3()
  }
};
</script>

<style>

</style>
