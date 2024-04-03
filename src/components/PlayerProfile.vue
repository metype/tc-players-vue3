<template>
        <div class="d-inline">
           <v-progress-linear indeterminate v-if="player == null"></v-progress-linear>
            <v-card v-if="name === ''">
              <h3 class="justify-center"
              style="text-align:center;">Please provide a UUID.</h3>
            </v-card>
            <v-card v-else-if="player == null">
              <h3 class="justify-center"
              style="text-align:center;">Player not found.</h3>
            </v-card>
              <v-img
                :src="playerAvatarUrl"
                style="width:15vw; height:15vw; margin-left: auto; margin-right: auto; margin-top:1rem;"
              >
                <template v-slot:placeholder>
                  <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular
                      color="grey-lighten-4"
                      indeterminate
                    ></v-progress-circular>
                  </div>
                </template>
              </v-img>
              <h1 class="text-center">
                <v-chip :color="player.connectedTo!=null?'green':'red'">
                  <p v-if="player.connectedTo!=null">Online</p>
                  <p v-else>Offline</p>
                </v-chip>
                {{player.lastSeenName}}
              </h1>
          <v-card class="mt-2 pt-2 pb-2">
            <p class="text-grey-lighten-1 text-xl-h6 text-center">UUID</p>
            <h2 class="text-center">
              {{player.uuid}}
            </h2>
          </v-card>
              <v-divider class="ma-4"></v-divider>
          <v-card class="mt-2 pt-2 pb-2" v-if="!noGroups()">
            <p class="text-grey-lighten-1 text-xl-h6 text-center">Ranks</p>
            <div class="d-flex w-100 justify-center">
              <v-chip
                v-for="(rank) in playerRanks"
                :key="rank"
              class="ml-2 mr-2">
                {{rank}}
              </v-chip>
            </div>
          </v-card>
          <v-card class="mt-2 pt-2 pb-2" v-else>
            <p class="text-grey-lighten-1 text-xl-h6 text-center">No Ranks</p>
          </v-card>
          <v-card class="mt-2 pt-2 pb-2">
            <p class="text-grey-lighten-1 text-xl-h6 text-center">First Login</p>
            <h2 class="text-center">
              {{playerFirstLogin}} | {{fromNow(player.firstLogin)}}
            </h2>
          </v-card>
          <v-card class="mt-2 pt-2 pb-2">
            <p class="text-grey-lighten-1 text-xl-h6 text-center">Last Login</p>
            <h2 class="text-center">
              {{playerLastLogin}} | {{fromNow(player.lastLogin)}}
            </h2>
          </v-card>
              <v-divider style="margin-top:10px;margin-bottom:10px"
               v-if="!noInfractions()"></v-divider>
          <v-card class="mt-2 pt-2 pb-2" v-if="!noInfractions()">
            <p class="text-grey-lighten-1 text-xl-h6 text-center mb-1">Bans</p>
              <v-expansion-panels multiple>
                <BanListItem
                  v-for="(ban, i) in playerBans"
                  :key="i"
                  :banStaff="ban.staff"
                  :banReason="ban.reason"
                  :isBanActive="ban.active"
                  :banServer="ban.server"
                  :banStart="ban.start"
                  :banEnd="ban.end"
                  :pardoned="ban.pardoned">
                </BanListItem>
              </v-expansion-panels>
          </v-card>
        </div>
</template>

<script>
import gql from 'graphql-tag';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import BanListItem from './BanListItem.vue';

dayjs.extend(relativeTime);

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
        start: `${this.formatDate(ban.createdAt * 1)} | ${this.fromNow(ban.createdAt * 1)}`,
        end: ban.expiresAt * 1 === 0 ? 'Null' : `${this.formatDate(ban.expiresAt * 1)} | ${this.fromNow(ban.createdAt * 1)}`,
        pardoned: ban.expiresAt * 1 === 0 && !ban.isActive,
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
      var useableDate = Number(date);
      return `${dayjs(new Date(useableDate)).fromNow()}`;
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
