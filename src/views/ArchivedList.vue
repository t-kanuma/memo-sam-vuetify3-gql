<template>
  <template v-if="renderReady">
    <v-list>
      <v-list-item v-for="(memo, i) in archives" :key="`list-${i}`">
        <v-list-item-title class="font-weight-bold">
          {{ memo.title }}
        </v-list-item-title>
        <span>{{ memo.text }}</span>
        <template v-slot:append>
          <v-list-item-action>
            <v-btn variant="flat" icon @click="unarchiveMemo(i)"
              ><v-icon color="secondary">mdi-package-up</v-icon></v-btn
            >
          </v-list-item-action>

          <v-list-item-action>
            <v-dialog v-model="deletionDialogShown" max-width="30%">
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" icon variant="flat">
                  <v-icon color="secondary">mdi-delete</v-icon>
                </v-btn>
              </template>
              <v-card>
                <v-toolbar color="accent" class="px-4 text-white"
                  >Warn!</v-toolbar
                >
                <v-card-text class="pa-4">
                  <span class="text-glay">{{ MESSAGE_ON_DELETION }}</span>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    :loading="removeLoader"
                    color="accent"
                    variant="flat"
                    @click="removeArchive(i)"
                  >
                    OK
                  </v-btn>
                  <v-btn
                    color="accent"
                    variant="text"
                    @click="cancelDeletion()"
                  >
                    キャンセル
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-list-item-action>
        </template>
        <v-divider></v-divider>
      </v-list-item>
    </v-list>
    <v-snackbar
      :timeout="2000"
      v-model="noticeAfterUnarchive"
      centered
      variant="tonal"
      location="center"
      close-on-content-click
      color="primary"
    >
      {{ MESSAGE_UNARCHIVED }}
    </v-snackbar>
  </template>
  <template v-else>
    <v-progress-linear
      indeterminate
      color="accent-lighten-2"
    ></v-progress-linear>
  </template>
</template>
<script setup lang="ts">
import { ref, onMounted, type Ref } from "vue";
import { getArchives, deleteArchive } from "@/modules/archive";
import { updateMemo } from "@/modules/memo";
import { type Memo, type InfoMessage } from "@/types";
import { isMemoArchiveResp } from "@/modules/common";

const renderReady = ref(false);
const noticeAfterUnarchive = ref(false);
const archives: Ref<Memo[]> = ref([]);

const MESSAGE_UNARCHIVED: InfoMessage = "メモに戻しました。";
const MESSAGE_ON_DELETION: InfoMessage =
  "このメモは完全に削除されます。よろしいですか？";

// const emit = defineEmits<EmitPattern>();
const emit = defineEmits<{
  (e: "todoDone", percentage: number): void;
  (e: "pageName", pageName: string): void;
}>();
const showArchive = async () => {
  const archiveResp = await getArchives();
  if (isMemoArchiveResp(archiveResp)) {
    archives.value = archiveResp.memos;
  }

  emit("pageName", "アーカイブ");
};

const unarchiveMemo = async (i: number) => {
  const archiveToUnarchive = archives.value[i];
  archiveToUnarchive.archived = false;
  await updateMemo(archiveToUnarchive);
  await showArchive();
  noticeAfterUnarchive.value = true;
};

// delete section
const deletionDialogShown = ref(false);
const removeLoader = ref(false);
const cancelDeletion = () => {
  deletionDialogShown.value = false;
};

const removeArchive = async (i: number) => {
  removeLoader.value = true;
  const archiveToRemove = archives.value[i];
  await deleteArchive(archiveToRemove.id);
  removeLoader.value = false;
  deletionDialogShown.value = false;
  await showArchive();
};

onMounted(async () => {
  await showArchive();
  renderReady.value = true;
});
</script>
<style scoped></style>
