// import { EventBusSetup, bus } from './lib/EventBusSetup';
// import { EventBus } from "ts-bus";
import { ImgFast } from "./lib/img-fast";
import { globalContainer } from "./lib/stateKeeper";
declare global {
  interface Window {
    imgFastGlobalContainer: globalContainer;
  }
}

export function globalInit() {
  if (window.imgFastGlobalContainer !== undefined) {
    if (window.imgFastGlobalContainer.config == undefined) {
      console.warn("imgFastGlobal already defined, but no config is set");
    } else {
      console.log("Global config is set (TODO: typeguard this config)");
    }
  } else {
    console.log("Defining global behaviorSubject");
    window.imgFastGlobalContainer = new globalContainer();
  }
}

globalInit();
// export ImgFast?
customElements.define("img-fast", ImgFast);
