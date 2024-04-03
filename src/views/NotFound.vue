<template>
  <div>
    <div class="d-flex justify-center mb-6 w-100 text-center">
      <div class="d-inline-block w-100">
        <h1 class="text-xl-h1 text-amber-accent-4"> {{ errCode }} </h1>
        <h2> {{ err }} </h2>
        <h4>Have a squid for your woes</h4>
        <img style = "margin:20px" :src="squidSrc" alt="Image of a Minecraft squid">
        <v-btn @click="toHome()" class="d-block justify-center mr-auto ml-auto">Return to Home</v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Squid from '../assets/squid.png';
import {useRoute} from "vue-router";
export default {
  name: 'NotFound',
  computed: {
    squidSrc() {
      return Squid;
    },
    err() {
      useRoute();
      return `Sorry! We couldn't find the page : "${this.$route.fullPath}"`;
    },
    errCode() {
      return '404!';
    },
  },
  methods: {
    toHome() {
      this.$router.push("/main");
      console.log("huh?")
    },
  }
};
</script>
