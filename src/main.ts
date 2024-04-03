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

// const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
//
// vuetify.theme.global.name.value = mq?.matches ? "dark" : "light";
//
// // eslint-disable-next-line no-unused-expressions
// mq?.addEventListener?.('change', (e) => {
//   vuetify.theme.global.name.value = e.matches ? "dark" : "light";
// });

// Hopefully temporary, but I have some hardcoded colors in the UI that
// provide rather bad contrast in light mode and the simple fix is to disable
// light mode until I figure out an easy way to make those colors dynamic
// and always-readable
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
