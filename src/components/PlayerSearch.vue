<template>
  <div v-if="players!=null" :key="name">
    <v-progress-linear
      indeterminate
      v-show="!Array.isArray(players.result) || wait">
    </v-progress-linear>
    <div
      v-if="players.result === undefined || players.result.length === 0"
      v-show="Array.isArray(players.result)">
      <h3 style="text-align:center">There were no results for the query : {{name}}</h3>
    </div>
    <div v-else>
      <h1 v-show="Array.isArray(players.result)">
        Search results for '{{name}}' (Page {{pageNum}}/{{Math.ceil(players.totalCount/20)}}) :
      </h1>
    </div>
  </div>
  <v-container class="playerContainer pa-0" fluid v-if="players != null">
    <div class="d-inline-flex" v-for="(player, index) in players.result" :key="index">
      <v-card
        class="ma-7"
        @click.native="$router.push(`/player/${player.uuid}`)">
        <v-img
          :src="playerAvatarUrl(player.uuid)"
          style="width:min(6rem, 20vw); height:min(6rem, 20vw);"
          class="ma-5"
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
        <h4 class="text-center mb-5">{{player.lastSeenName}}</h4>
      </v-card>
    </div>
  </v-container>
  <div class="d-inline-flex mt-5 w-100" v-if="players != null">
    <v-btn class="btn-text mr-auto w-25"
           @click.native="changePage(-1)"
           :disabled="pageNum<=1 || wait">
      <p class="block" style="margin:auto">Previous</p>
    </v-btn>
    <v-btn class="btn-text ml-auto w-25"
           @click.native="changePage(1)"
           :disabled="nextDisabled">
      <p class="block" style="margin:auto">Next</p>
    </v-btn>
  </div>
</template>

<style scoped>
a {
  text-decoration: none;
}
.btn-text {
  float: left;
}

.playerContainer {
  display: grid;
  grid-template-columns: repeat(auto-fill, calc(min(6rem, 20vw) + 6rem));
  justify-content: center;
}
</style>

<script>

import gql from 'graphql-tag';

export default {
  name: 'MainView',
  props: {
    name: {
      default: '',
      type: String,
    },
    page: {
      default: 1,
      type: String,
    },
  },
  data() {
    return {
      players: undefined,
      wait: false,
      pageNum: 0,
      searchString: "",
    };
  },
  mounted() {
    this.pageNum = this.page*1;
    this.wait = true;
    this.executeQuery().then(result => {
       this.players = result;
       this.wait = false;
       this.checkOneResult();
    });
  },
  computed: {
    nextDisabled() {
      if (this.players.result == null) return null;
      return this.players.result.length < 20 || this.wait;
    },
    length() {
      if (this.players == null) {
        return 0;
      }
      return this.players.result.length;
    },
  },
  methods: {
    playerAvatarUrl(uuid) {
      if (uuid === undefined) {
        return '';
      }
      return `https://crafatar.com/avatars/${uuid}?size=300&overlay`;
    },
    cleanUpSearchString(string) {
      let outputString = string.replace(/\s*$/, ''); // Trim whitespaces off the end
      outputString = outputString.replace('_', '\\\\_'); // Escape underscores so the query is not misinterpreted
      return outputString;
    },
    async executeQuery() {
      this.preTests();
      const page = (this.pageNum <= 0) ? 1 : this.pageNum;
      const searchName = this.cleanUpSearchString(this.searchString);
      const newPlayers = await this.$apollo.query({
        query: (!this.serverQuery) ? gql`
        query {
          players(searchPlayerName:"%${searchName}%", limit:20, offset:${(page - 1) * 20}){
            totalCount
            result{
              lastSeenName
              firstLogin
              lastLogin
              uuid
              groups{
                id
              }
            }
          }
        }
        ` : gql`
        query{
          mcServer(serverId:"${this.serverName}"){
            name
            status{
              onlinePlayers{
                lastSeenName
                firstLogin
                lastLogin
                uuid
                groups{
                  id
                }
              }
            }
          }
        }`,
      });
      let ret = {};
      if (this.serverQuery) {
        if (newPlayers.data.mcServer.status.onlinePlayers === null) {
          ret.result = [];
        } else {
          ret.result = newPlayers.data.mcServer.status.onlinePlayers;
          ret.totalCount = newPlayers.data.mcServer.status.onlinePlayers.length;
        }
      } else {
        ret = newPlayers.data.players;
      }
      ret = (ret === null) ? [] : ret;
      return ret;
    },
    preTests() {
      this.searchString = this.name;
      // Name is fixed beforehand so it's more clear to the user what the page is actually querying.
      let nameWithoutWhitespace = this.cleanUpSearchString(this.searchString);
      if (this.pageNum < 1) {
        this.$router.replace(`/search/${nameWithoutWhitespace}/page/1`);
      }
      this.serverQuery = false;
      this.serverName = '';
      if (this.searchString.length === 36 && this.searchString.split('-').length === 5) {
        this.$router.replace(`/player/${this.searchString}`);
        return;
      }
      if (this.searchString.includes(':')) {
        const nme = this.searchString.split(':');
        if (!Number.isNaN((nme[1] * 1))) {
          [this.searchString, this.pageNum] = nme;
          this.$router.replace(`/search/${nameWithoutWhitespace}/page/${(this.pageNum > Math.ceil(this.players.totalCount / 20))
            ? Math.ceil(this.players.totalCount / 20) : this.pageNum}`);
          return;
        }
        if (nme[0] === ('on')) {
          this.serverQuery = true;
          [nameWithoutWhitespace, this.serverName] = nme;
          this.searchString = nme.join(':');
        }
      }
      if (this.searchString === '') {
        this.$router.replace('/main');
      }
    },
    changePage(amount) {
      this.wait = true;
      if (this.pageNum + amount < 1) {
        this.pageNum = 1;
      } else {
        this.pageNum += amount;
      }
      window.history.replaceState({}, "", `/search/${this.name}/${this.pageNum}`);
      this.executeQuery().then(result => {
        this.players = result;
        this.wait = false;
        this.checkOneResult();
      });
    },
    checkOneResult() {
      if (this.players.result.length === 1 && this.pageNum === 1 && !this.serverQuery) {
        this.$router.replace(`/player/${this.players.result[0].uuid}`);
        return true;
      }
      return false;
    },
  },
};
</script>
