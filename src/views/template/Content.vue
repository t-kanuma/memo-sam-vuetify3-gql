<template>
  <div>
    <!--  ヘッダー -->
    <v-app-bar color="primary" app>
      <v-app-bar-nav-icon
        color="white"
        @click.stop="navDrawn = !navDrawn"
      ></v-app-bar-nav-icon>
      <v-toolbar-title class="white--text">{{ pageName }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="success" icon v-show="pageName === 'メモ'">
        <v-progress-circular
          :model-value="todoDonePercentage"
          color="white"
        ></v-progress-circular>
      </v-btn>
      <v-btn color="white" icon v-show="pageName === 'メモ'">
        <v-icon class="white--text">mdi-heart</v-icon>
        <span class="white--text">{{ favTotal }} </span>
      </v-btn>

      <v-tooltip location="bottom" :text="userName">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon color="white">
            <v-icon class="white--text">mdi-account</v-icon>
          </v-btn>
        </template>
      </v-tooltip>

      <v-btn icon color="white" @click="logout()">
        <v-icon class="white--text">mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- サイドバー -->
    <v-navigation-drawer v-model="navDrawn" app temporary>
      <v-list-item class="my-3">
        <v-list-item-title class="text-h6"
          >シンプルメモアプリ</v-list-item-title
        >
        <v-list-item-subtitle> ただのサンプルアプリです</v-list-item-subtitle>
      </v-list-item>
      <v-divider></v-divider>

      <v-list nav dense>
        <v-list-item
          v-for="(menu, i) in menus"
          :key="`menu-${i}`"
          link
          @click="closeMenu()"
          :to="menu.to"
          :prepend-icon="menu.icon"
          color="primary"
        >
          <v-list-item-title>{{ menu.text }}</v-list-item-title>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <v-list>
          <v-list-item>
            <v-switch
              @click="toggleTheme"
              inset
              label="ダークモード"
            ></v-switch>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>

    <!-- メインエリア -->
    <v-main>
      <router-view @todoDone="setDonePercentage" @pageName="setPageName" />
    </v-main>
  </div>
</template>
<script setup lang="ts">
import { useTheme } from "vuetify";
import { ref, onMounted, type Ref } from "vue";
import { logout as doLogout } from "@/modules/auth.js";
import { useFavTotalStore } from "@/stores/favoriteTotal";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { getUsername } from "@/modules/auth";
import { type PageName, type PagePath } from "@/types";

const router = useRouter();

// theme section
const theme = useTheme();
const toggleTheme = (): void => {
  theme.global.name.value =
    theme.global.name.value === "myCustomLightTheme"
      ? "myCustomDarkTheme"
      : "myCustomLightTheme";
};

// navigation section
const menusRaw: { icon: string; text: PageName; to: PagePath }[] = [
  { icon: "mdi-collage", text: "メモ", to: "/memos" },
  { icon: "mdi-archive", text: "アーカイブ", to: "/archives" },
];

const menus = ref(menusRaw);

const navDrawn = ref(false);
const closeMenu = () => {
  navDrawn.value = false;
};

// 画面上部の共通セクション
const pageName: Ref<string | null> = ref(null);
// emitハンドリング
const setPageName = (pageNameHandled: string) => {
  pageName.value = pageNameHandled;
};

// memo:storeの取得
const favTotalStore = useFavTotalStore();
// memo:storeから値を取得してrefに格納
const { favTotal } = storeToRefs(favTotalStore);

const todoDonePercentage: Ref<number> = ref(0);
// emitハンドリング
const setDonePercentage = (percentageHandled: number) => {
  todoDonePercentage.value = percentageHandled;
};

const logout = async () => {
  await doLogout();
  router.push("/login");
};

const userName: Ref<string | undefined> = ref(undefined);
onMounted(async () => {
  userName.value = await getUsername();
});
</script>
<style scoped></style>
