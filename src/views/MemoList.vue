<template>
  <template v-if="renderReady">
    <!-- コンテナで適切にパディングする。fluidで横幅伸びる。 -->
    <v-container fluid>
      <!-- dense:行間が狭くなる。 -->
      <v-row dense>
        <!-- レスポンシブ:  デフォルトは1列(12/12)して、viewportがsm以上であれば3列(12/4)にする。-->
        <v-col v-for="(memo, i) in memos" :key="i" cols="12" sm="4">
          <v-card>
            <v-card-title
              :class="{ 'text-decoration-line-through': memo.done }"
              >{{ memo.title }}</v-card-title
            >
            <v-card-text :class="{ 'text-decoration-line-through': memo.done }">
              {{ memo.text }}
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn icon color="secondary" @click="toggleTodoCheckmark(i)">
                <v-icon v-if="memo.done">mdi-checkbox-outline</v-icon>
                <v-icon v-else>mdi-checkbox-blank-outline</v-icon>
              </v-btn>
              <v-btn icon @click="toggleFavorite(i)">
                <v-icon color="pink" v-show="!memo.favorite"
                  >mdi-heart-outline</v-icon
                >
                <v-icon color="pink" v-show="memo.favorite">mdi-heart</v-icon>
              </v-btn>
              <v-btn color="accent" icon @click="archiveMemo(i)">
                <v-icon>mdi-archive</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-snackbar
        :timeout="2000"
        v-model="noticeAfterArchive"
        centered
        variant="tonal"
        location="center"
        close-on-content-click
        color="primary"
      >
        {{ MESSAGE_AFTER_ARCHIVE }}
      </v-snackbar>
    </v-container>
    <NewMemoDialog @newMemoCreated="showMemos()" />
  </template>
  <template v-else>
    <!-- <div class="prog-circ-on-init">
      <v-progress-circular
        size="200"
        width="5"
        color="secondary"
        indeterminate
      ></v-progress-circular>
    </div> -->
    <v-progress-linear
      indeterminate
      color="accent-lighten-2"
    ></v-progress-linear>
  </template>
</template>
<script setup lang="ts">
import { getMemos, updateMemo } from "@/modules/memo";
import { onMounted, ref, computed, type Ref } from "vue";
import { useFavTotalStore } from "@/stores/favoriteTotal";
import NewMemoDialog from "@/components/NewMemoDialog.vue";
import { type Memo, type InfoMessage } from "@/types";

const renderReady = ref(false);
const memos: Ref<Memo[]> = ref([]);
const MESSAGE_AFTER_ARCHIVE: InfoMessage = "アーカイブしました。";

// const emit = defineEmits(["todoDone", "pageName"]);

// const emit = defineEmits<EmitPattern>();
const emit = defineEmits<{
  (e: "todoDone", percentage: number): void;
  (e: "pageName", pageName: string): void;
}>();
// memo:storeの取得
const favTotalStore = useFavTotalStore();

const showMemos = async () => {
  const memoResp = await getMemos();
  memos.value = memoResp.memos;

  favTotalStore.set(memos.value);
  emit("todoDone", todoDonePercentage.value);
  emit("pageName", "メモ");
};

const toggleFavorite = async (i: number) => {
  const currentMemo = memos.value[i];
  currentMemo.favorite = !currentMemo.favorite;

  await updateMemo(currentMemo);
  // pinia使っているのでemitで更新する必要はない。
  favTotalStore.set(memos.value);
};

const todoDonePercentage = computed(() => {
  const todoDoneTotal = memos.value.filter((memo) => {
    return memo.done === true;
  }).length;
  return (todoDoneTotal / memos.value.length) * 100;
});

const toggleTodoCheckmark = async (i: number) => {
  const currentMemo = memos.value[i];
  currentMemo.done = !currentMemo.done;
  await updateMemo(currentMemo);
  emit("todoDone", todoDonePercentage.value);
};

const noticeAfterArchive = ref(false);
const archiveMemo = async (i: number) => {
  const memoToArchive = memos.value[i];
  memoToArchive.archived = true;
  await updateMemo(memoToArchive);
  await showMemos();
  noticeAfterArchive.value = true;
};

onMounted(async () => {
  await showMemos();
  renderReady.value = true;
});
</script>

<style scoped>
.prog-circ-on-init {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
