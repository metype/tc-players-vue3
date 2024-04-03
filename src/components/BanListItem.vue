<template>
  <v-expansion-panel variant="accordion">
    <v-expansion-panel-title>
      <v-icon class="flex-grow-0 pr-4">mdi-alert-octagon</v-icon>
      <v-chip :color="isBanActive ? 'red' : 'gray'">
        <p v-if="isBanActive">Active</p>
        <p v-else>Inactive</p>
      </v-chip>
      <v-chip class="mr-2 ml-2">
        {{banStaff}}
      </v-chip>
      <b>{{banReason}}</b>
    </v-expansion-panel-title>
    <v-expansion-panel-text>
      <v-lazy>
        <BanDetail
          :banServer="banServer"
          :banStart="banStart"
          :banEnd="banEnd"
        :pardoned="pardoned">
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
    pardoned: {
      type:Boolean,
      required: true,
    }
  }
};
</script>
