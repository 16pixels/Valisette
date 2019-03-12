import runtime from "offline-plugin/runtime";
import utils from "./modules/utils";

const swRuntime = {
  init: () => {
    return runtime.install({
      onUpdating: () => {
        utils.Debug("SW Event:", "onUpdating");
      },
      onUpdateReady: () => {
        utils.Debug("SW Event:", "onUpdateReady");
        // Tells to new SW to take control immediately
        runtime.applyUpdate();
      },
      onUpdated: () => {
        utils.Debug("SW Event:", "onUpdated");
        // Reload the webpage to load into the new version
        navigator.serviceWorker.getRegistrations().then(registrations => {
          for (let registrationIndex = 0; registrationIndex < registrations.length; registrationIndex += 1) {
            registrations[registrationIndex].unregister();
          }
        });
        window.location.reload();
      },
      onUpdateFailed: () => {
        utils.Debug("SW Event:", "onUpdateFailed");
      }
    });
  }
};
export default swRuntime;
