/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';

import 'roboto-fontface/css/roboto/roboto-fontface.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'
import { createApolloProvider } from '@vue/apollo-option'
import vuetify from "./plugins/vuetify";
import router from "./router";
import {ApolloClient} from "apollo-boost";
import {registerPlugins} from "./plugins";

// https://github.com/Tallcraft/tc-players/issues/19
vuetify.theme.global.name.value = "dark";

const cache = new InMemoryCache();
const link = new HttpLink({
  uri: 'https://api.tallcraft.com/',
});

const client = new ApolloClient({
  cache,
  link,
});

const apolloProvider = createApolloProvider({
  defaultClient: client,
})

const app = createApp(App, {
  router,
  vuetify,
})

app.use(apolloProvider);

registerPlugins(app)

app.mount('#app')
