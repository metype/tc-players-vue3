<template>
  <v-expansion-panel variant="accordion">
    <v-expansion-panel-title>
      <v-icon class="flex-grow-0 pr-4">mdi-alert-octagon</v-icon>
      <b>{{banReason}}</b>
       <v-chip class="mr-0 ml-auto">
        {{banStaff}}
      </v-chip>
    </v-expansion-panel-title>
    <v-expansion-panel-text>
      <v-lazy>
        <BanDetail
          :isBanActive="isBanActive"
          :banServer="banServer"
          :banStart="banStart"
          :banEnd="banEnd">
        </BanDetail>
      </v-lazy>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script>
import BanDetail from './BanDetail.vue';

export default {
  name: 'BanListItem',
  components: { BanDetail },
  props: {
    banReason: {
      type: String,
      required: true,
    },
    banStaff: {
      type: String,
      required: true,
    },
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
