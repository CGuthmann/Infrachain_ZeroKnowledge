<template>
  <div>
    <!-- -----------------------------------------------
          Start Header
    ----------------------------------------------- -->
    <v-app-bar app class="app-header position-relative bg-dark" flat>
      <v-container class="py-0 fill-height">
        <!-- Logo -->
        <Logo />
        <!-- <div class="logo">
          <NLink to="/">
            <v-img :src="require('@/assets/images/logos/Logo_large.png')" alt="logo" />
          </NLink>
        </div> -->

        <v-spacer></v-spacer>


        <!-- Desktop view Navigation -->
        <div class="navigation" v-bind:class="[isActive ? 'd-block' : '']" @click="isActive = !isActive">
          <ul class="navbar-nav">
            <li class="nav-item" text>
              <n-link class="nav-link" nuxt to="/test"> Energy consumtion </n-link>
            </li>
            <li class="nav-item" text>
              <n-link class="nav-link" nuxt to="/competition"> Competition </n-link>
            </li>
            <li class="nav-item" text>
              <n-link class="nav-link" nuxt to="/status"> Status </n-link>
            </li>

          </ul>
        </div>
        <!-- login-regiter -->
        <v-btn v-if="!connectedWallet" @click="connectedWallet = true" class=" d-lg-flex btn-custom-nm ml-5" nuxt
          depressed color="primary" to="/" elevation="0">
          Connect wallet
        </v-btn>
        <v-btn v-else @click="connectedWallet = false" class=" d-lg-flex btn-custom-nm ml-5" nuxt depressed
          color="error" to="/" elevation="0">
          Disconnect wallet
        </v-btn>
        <v-btn class="d-block d-md-none" color="white" text @click="toggleClass()">
          <v-app-bar-nav-icon class="white--text" />
        </v-btn>
      </v-container>
    </v-app-bar>
    <!-- -----------------------------------------------
          End Header
    ----------------------------------------------- -->
  </div>
</template>

<script>
export default {
  name: "Header2",
  components: {
    Logo: () => import("@/layouts/sections/Logo")
  },
  data() {
    return {
      connectedWallet: false,
      isActive: false,
    };
  },
  methods: {
    toggleClass: function (event) {
      this.isActive = !this.isActive;
    },
  },
};
</script>
<style lang="scss">
.logo a {
  display: flex;
}
</style>