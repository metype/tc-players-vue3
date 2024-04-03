<template>
  <div>
    <v-card class="mt-2 pt-2 pb-2">
      <p class="text-grey-lighten-1 text-lg-h6 text-center">Server</p>
      <h2 class="text-center">
        {{banServer}}
      </h2>
    </v-card>
    <v-card class="mt-2 pt-2 pb-2">
      <p class="text-grey-lighten-1 text-lg-h6 text-center">Created</p>
      <h2 class="text-center">
        {{banStart}}
      </h2>
    </v-card>
    <v-card class="mt-2 pt-2 pb-2">
      <p class="text-grey-lighten-1 text-lg-h6 text-center">Expires</p>
      <h2 class="text-center" v-if="banEnd !== 'Null'">
        {{banEnd}}
      </h2>
      <h2 class="text-center text-amber-accent-4" v-if="banEnd === 'Null' && !pardoned">
        Permanent
      </h2>
      <h2 class="text-center text-amber-accent-1" v-if="banEnd === 'Null' && pardoned">
        Permanent, but pardoned
      </h2>
    </v-card>
  </div>
</template>

<script>

export default {
  name: 'BanDetail',
  props: {
    banServer: {
      type: String,
      required: true,
    },
    banStart: {
      type: String,
      required: true,
    },
    banEnd: {
      type: String,
      required: true,
    },
    pardoned: {
      type:Boolean,
      required: true,
    }
  },
};
</script>
