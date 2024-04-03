<template>
  <div>
    <v-list>
        <v-list-item>
          <v-list-item-title>
            <v-icon>mdi-help</v-icon>
            <b>Active</b>
          </v-list-item-title>
          <v-list-item-subtitle>
            {{isBanActive}}
          </v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            <v-icon>dns</v-icon>
          </v-list-item-title>
          <v-list-item-subtitle>
            <b>Server</b>
            {{banServer}}
          </v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            <v-icon>schedule</v-icon>
          </v-list-item-title>
          <v-list-item-subtitle>
            <b>Created</b>
            {{banStart}}
          </v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            <v-icon>schedule</v-icon>
          </v-list-item-title>
          <v-list-item-subtitle>
            <b>Expires</b>
            {{banEnd}}
          </v-list-item-subtitle>
        </v-list-item>
    </v-list>
  </div>
</template>

<script>
export default {
  name: 'BanDetail',
  props: {
    isBanActive: {
      type: Boolean,
      required: true,
    },
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
  },
};
</script>
