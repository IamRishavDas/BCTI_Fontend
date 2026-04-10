import { isTauri } from "@tauri-apps/api/core";
import { check } from "@tauri-apps/plugin-updater";
import { ask } from "@tauri-apps/plugin-dialog";   
import { relaunch } from "@tauri-apps/plugin-process";    
import { showError } from "../utils/toast";

export async function checkForUpdates() {
  if (!isTauri()) return;

  try {
    const update = await check();

    if (update?.available) {
      const shouldUpdate = await ask(
        `A new version (${update.version}) is available!\n\nRelease notes:\n${update.body || "No release notes provided."}`,
        {
          title: "Update Available",
          kind: "info",           
          okLabel: "Update Now",
          cancelLabel: "Later",
        }
      );

      if (shouldUpdate) {
        await update.downloadAndInstall();
        await relaunch();
      }
    }
  } catch (err) {
    showError("Desktop update check failed. Please contact admin.");
  }
}