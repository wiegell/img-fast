// import { EventBusSetup, bus } from './lib/EventBusSetup';
// import { EventBus } from "ts-bus";
import { ImgFast } from "./lib/img-fast";
import { globalContainer, elementStatusType } from "./lib/types";
import { BehaviorSubject, Subject, range } from "rxjs";
import { sequenceEqual, map } from "rxjs/operators";
import { mergeWithExistingElementMap } from './lib/stateKeeper'

declare global {
    interface Window {
        imgFastGlobalContainer: globalContainer;
    }
}

if (
    window.imgFastGlobalContainer !== undefined
) {
    console.warn("imgFastGlobal already defined");
} else {
    console.log("Defining global behaviorSubject");
    window.imgFastGlobalContainer = new globalContainer()
}

// export ImgFast?
customElements.define("img-fast", ImgFast);
