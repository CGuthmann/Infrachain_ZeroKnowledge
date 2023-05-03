<template>
  <nav id="vue">
    <div class="menu-item">
      <router-link to="/competition">Initiate MPC</router-link>
    </div>
    <Status title="Status"/>

  </nav>
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
<style>
nav {
  width: 100vw;
  background-color: #0d0d0e;
  display: flex;
  align-items: center;
  justify-content: center;
}

nav .menu-item {
  color: #FFF;
  padding: 25px 40px;
  position: relative;
  text-align: center;
  border-bottom: 5px solid transparent;
  display: flex;
  transition: 0.4s;
}

nav .menu-item.active,
nav .menu-item:hover {
  background-color: #0d0d0e;
  border-bottom-color: #5C1A81;
}

nav .menu-item a {
  color: inherit;
  text-decoration: none;
}
</style>
