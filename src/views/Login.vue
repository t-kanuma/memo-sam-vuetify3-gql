<template>
  <div class="d-flex justify-center align-center login-container">
    <v-card rounded="lg">
      <v-img
        src="/login-img.jpg"
        width="30rem"
        class="text-white align-end"
        gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
      >
        <v-card-title>サンプルシンプルメモアプリ</v-card-title>
      </v-img>

      <v-form ref="form">
        <v-card-text>
          <v-text-field
            v-model="loginName"
            variant="underlined"
            label="ユーザー名"
            prepend-icon="mdi-account-circle"
            color="accent"
            :counter="8"
            :rules="userNameRules"
            class="mb-3"
          ></v-text-field>
          <v-text-field
            v-model="password"
            variant="underlined"
            autocomplete
            :type="passwordHidden ? 'password' : 'text'"
            label="パスワード"
            prepend-icon="mdi-lock"
            :append-icon="passwordHidden ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append="passwordHidden = !passwordHidden"
            color="accent"
            :counter="8"
            :rules="passwordRules"
          ></v-text-field>
          <div class="mt-2 text-error d-flex justify-center align-center">
            {{ loginFailedMessage ?? "" }}
          </div> </v-card-text
        ><v-card-actions
          ><v-spacer></v-spacer
          ><v-btn
            variant="flat"
            color="accent"
            @click="login"
            :loading="loginLoader"
            >ログイン</v-btn
          >
        </v-card-actions></v-form
      ></v-card
    >
  </div>
</template>
<script setup lang="ts">
import { ref, type Ref } from "vue";
import { authenticate, completeNewPasswordChallenge } from "../modules/auth";
import { useRouter } from "vue-router";
import { type ErrorMessage, type ValidationRule } from "@/types";
const router = useRouter();

const loginName: Ref<string> = ref("");

const password: Ref<string> = ref("");
const passwordHidden = ref(true);

const form: Ref<any> = ref(null);
const loginFailedMessage: Ref<ErrorMessage | undefined> = ref();

const userNameRules: ValidationRule[] = [
  (v: string) => !!v || "必須です",
  (v: string) => {
    const reg = new RegExp(/^[a-zA-Z1-9]+$/);
    return reg.test(v) || "英字または数字のみにしてください";
  },
];

const passwordRules: ValidationRule[] = [
  (v: string) => !!v || "必須です",
  (v: string) => (v || "").length >= 8 || "8文字以上にしてください",
  // (v) => {
  //   const reg = new RegExp(/^[a-zA-Z1-9]+$/);
  //   return reg.test(v) || "英字または数字のみにしてください。";
  // },
];

const loginLoader = ref(false);
const login = async () => {
  if ((await form.value.validate()).valid) {
    loginLoader.value = true;
    try {
      const session = await authenticate(loginName.value, password.value);

      if ("idToken" in session) {
        router.push("/");
      } else {
        // とりあえず初回パスワードをそのまま使ってしまう。
        // TODO 本来はサインアップ画面を用意して、ユーザーにパスワード設定してもらうので
        // NewPasswordChallenge自体が不要になる。
        const passwordChallengeResult = await completeNewPasswordChallenge(
          loginName.value,
          password.value
        );
        console.debug(passwordChallengeResult);
        router.push("/");
      }
    } catch (e) {
      loginLoader.value = false;
      console.debug(e);
      loginFailedMessage.value = "ログインまたはパスワードに誤りがあります。";
    }
  }
};
</script>
<style scoped>
.login-container {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(to left, rgb(var(--v-theme-on-primary)), #4bbfc3);
}
</style>
