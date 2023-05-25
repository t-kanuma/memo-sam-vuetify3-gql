import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

// Vuetify

import "@mdi/font/css/materialdesignicons.css";
import { registerPlugins } from "./plugins";

let app = createApp(App);
app = registerPlugins(app);

app.config.errorHandler = (err, vm, info) => {
  console.error(`errorHandler: ${info}`, err);
  router.replace({ name: "ErrorDestination" });
};
// app.use(router).use(vuetify).use(createPinia()).mount("#app");
app.mount("#app");
