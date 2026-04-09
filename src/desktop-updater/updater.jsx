import { isTauri } from "@tauri-apps/api/core";
import { check } from "@tauri-apps/plugin-updater";
import { showError } from "../utils/toast";

export async function checkForUpdates() {
  if (!isTauri()) return;

  try {
    const update = await check();
    if (update?.available) {
      await update.downloadAndInstall();
    }
  } catch (err) {
    showError("Desktop update failed contact admin");
  }
}