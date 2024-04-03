<template>
  <!-- Ewwwwwww, would like to figure out how to better achieve my goals here. -->

  <div style="position: absolute; width:100vw; top:50%; translate: 0 -50%">
    <div class="d-inline-flex justify-center align-center w-100">
      <img alt="The Tallcraft Logo" :src="logoSrc" style="width:8rem" class="mr-2">
      <h1 class="text-lg-h3">Players</h1>
    </div>
    <v-text-field
      autofocus
      flat
      solo-inverted
      hide-details
      prepend-inner-icon="mdi-magnify"
      label="Player search"
      v-model="playerInput"
      @change="playerLookup"
      class="w-50 mr-auto ml-auto mt-5"
    ></v-text-field>
  </div>
</template>

<script>

import gql from 'graphql-tag';
import logo from '@/assets/logo.svg';

export default {
  name: 'MainView',
  props: {
    name: {
      default: '',
      type: String,
    },
  },
  data() {
    return {
      playerInput: '',
    };
  },
  computed: {
    logoSrc() {
      return logo;
    },
  },
  methods: {
    playerLookup() {
      this.$router.push(`/search/${this.playerInput}`);
    },
  },
};
</script>
