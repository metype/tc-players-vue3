<template>
        <v-flex>
           <v-progress-linear indeterminate v-if="player == null"></v-progress-linear>
            <v-card v-if="name == ''">
              <h3 class="justify-center"
              style="text-align:center;">Please provide a UUID.</h3>
            </v-card>
            <v-card v-else-if="player == null">
              <h3 class="justify-center"
              style="text-align:center;">Player not found.</h3>
            </v-card>
              <v-img
                :src="playerAvatarUrl"
                style="width:20%;
                left:40%"
                loading="Loading Avatar..."
              >
              </v-img>
              <h1 class="text-center">
                <v-chip :color="player.connectedTo!=null?'green':'red'">
                  <p v-if="player.connectedTo!=null">Online</p>
                  <p v-else>Offline</p>
                </v-chip>
                {{player.lastSeenName}}
              </h1>
              <h2 class="text-center">
                <v-icon>mdi-account-outline</v-icon>
                {{player.uuid}}
              </h2>
              <v-divider style="margin-top:10px;margin-bottom:10px"></v-divider>
              <h2 class="text-center"  v-if="!noGroups()">
                <v-icon>mdi-star</v-icon>
                <b style="margin-right:20px"> Ranks</b>
                <v-chip
                  v-for="(rank) in playerRanks"
                  :key="rank"
                  class="mr-4">
                    {{rank}}
                  </v-chip>
              </h2>
              <h2 v-else class="text-center">
                <v-icon>mdi-star-outline</v-icon>
                <b style="margin-right:20px"> User Has No Ranks</b>
              </h2>
              <v-divider style="margin-top:10px;margin-bottom:10px"></v-divider>
              <h2 class="text-center">
                <v-icon>mdi-clock-outline</v-icon>
                <b> First Login</b>
                {{playerFirstLogin}} | {{fromNow(player.firstLogin)}}
              </h2>
              <h2 class="text-center">
                <v-icon>mdi-clock-outline</v-icon>
                <b> Last Login</b>
                {{playerLastLogin}} | {{fromNow(player.lastLogin)}}
              </h2>
              <v-divider style="margin-top:10px;margin-bottom:10px"
               v-if="!noInfractions()"></v-divider>
              <h2 class="text-center" v-if="!noInfractions()">
                <v-icon>account_balance</v-icon>
                <b> Bans</b>
              </h2>
              <v-expansion-panels multiple>
                <BanListItem
                  v-for="(ban, i) in playerBans"
                  :key="i"
                  :banStaff="ban.staff"
                  :banReason="ban.reason"
                  :isBanActive="ban.active"
                  :banServer="ban.server"
                  :banStart="ban.start"
                  :banEnd="ban.end">
                </BanListItem>
              </v-expansion-panels>
        </v-flex>
</template>

<script>
import gql from 'graphql-tag';
import countdown from 'countdown';
import BanListItem from './BanListItem.vue';

export default {
  name: 'PlayerProfile',
  components: { BanListItem },
  props: {
    name: {
      default: '',
      type: String,
    },
  },
  data() {
    return {
      player: this.executeQuery(),
    };
  },
  computed: {
    playerAvatarUrl() {
      if (this.player?.uuid === undefined) {
        return '';
      }
      return `https://crafatar.com/avatars/${this.player.uuid}?size=300&overlay`;
    },
    playerFirstLogin() {
      return this.formatDate(this.player.firstLogin * 1);
    },
    playerLastLogin() {
      return this.formatDate(this.player.lastLogin * 1);
    },
    playerRanks() {
      if (this.player.groups === undefined) return null;
      return this.player.groups.map((group) => group.id.toUpperCase());
    },
    playerBans() {
      if (this.player.infractions === undefined) return false;
      return this.player.infractions.bans.map((ban) => ({
        active: ban.isActive,
        server: (ban.server == null) ? 'Tallcraft Network' : ban.server.name,
        reason: ban.reason,
        staff: ban.staffName,
        start: `${this.formatDate(ban.createdAt * 1)}`,
        end: `${this.formatDate(ban.expiresAt * 1)}`,
      }));
    },
  },
  watch: {
    $route: 'executeQuery',
  },
  methods: {
    noGroups() {
      return this.player.groups?.length === 0;
    },
    noInfractions() {
      return this.player.infractions?.bans?.length === 0;
    },
    fromNow(date) {
      return `${countdown(new Date(), date, countdown.ALL, 1)} ago`;
    },
    formatDate(date) {
      if (!date) {
        return '-';
      }
      const d = new Date(date);
      return d.toLocaleString();
    },
    async executeQuery() {
      if (this.name.length <= 16) {
        this.$router.push(`/search/${this.name}/page/1`);
      }
      const player = await this.$apollo.query({
        query: gql`
        query {
          player(uuid: "${this.name}") {
            lastSeenName
            uuid
            lastLogin
            firstLogin
            groups {
              id
            }
            connectedTo{
              name
            }
            infractions {
              bans {
                reason
                isActive
                staffName
                server {
                  name
                }
                createdAt
                expiresAt
              }
            }
          }
        }`,
      });
      this.player = player.data.player;
      return this.player;
    },
  },
};
</script>
