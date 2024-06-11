<template>
  <div>
    <v-app :dark="darkTheme">
      <v-main class="mt-12">
        <v-container fluid>
          <router-view></router-view>
        </v-container>
      </v-main>
      <v-toolbar color="primary" dark
      class="position-fixed w-100 pa-0">
        <v-text-field
          flat
          solo-inverted
          hide-details
          append-inner-icon="mdi-magnify"
          label="Player search"
          v-model="playerInput"
          @click:append-inner="playerLookup"
          @keyup.enter="playerLookup"
          class="position-fixed w-75"
          style="left:50%;translate: -50% 0"
        ></v-text-field>
      </v-toolbar>
    </v-app>
  </div>
</template>

<style scoped>
a {
  color: white;
  text-decoration: none;
}
</style>

<script lang="ts">

import "vue-router";

export default {
  name: 'App',
  data() {
    return {
      playerInput: '',
      darkTheme: false,
    };
  },
  watch: {
    // Save darkTheme state in localStorage
    darkTheme() {
      if (localStorage) localStorage.setItem('darkTheme', this.darkTheme);
    },
  },
  beforeMount() {
    this.darkTheme = this.getThemeState();
  },
  methods: {
    playerLookup() {
      this.$router.push({path:`/search/${this.playerInput}/1`, refresh:true});
      // This is gross, but doing it without a small delay causes undesired results and a reload *is* neccesary.
      setTimeout(() => {
        this.$router.go(0);
      }, 10);
    },
    getThemeState() {
      if (!localStorage) {
        return false;
      }
      try {
        return JSON.parse(localStorage.getItem('darkTheme'));
      } catch (error) {
        return false;
      }
    },
  },
};
</script>

<style scoped>
#title {
  color: white !important;
}
body {
  overflow:hidden
}
</style>
