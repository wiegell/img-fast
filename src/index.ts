// import { EventBusSetup, bus } from './lib/EventBusSetup';
// import { EventBus } from "ts-bus";
import { ImgFast } from "./lib/img-fast";
import { globalObservableContainer, globalSubjectContainer } from "./lib/types";
import { BehaviorSubject, Subject } from "rxjs";
import { sequenceEqual, map } from "rxjs/operators";

declare global {
  interface Window {
    imgFastGlobalSubjects: globalSubjectContainer;
    imgFastGlobalObservables: globalObservableContainer;
  }
}
if (
  window.imgFastGlobalSubjects !== undefined ||
  window.imgFastGlobalObservables !== undefined
) {
  console.warn("imgFastGlobal already defined");
} else {
  console.log("Defining global behaviorSubject");
  window.imgFastGlobalSubjects = {
    howManyFastImg: new BehaviorSubject<number>(0),
    smallRangeLoaded: new Subject<boolean>(),
  };
  window.imgFastGlobalObservables = {
    areAllSmallRangesLoaded: window.imgFastGlobalSubjects.smallRangeLoaded.asObservable().pipe(
      sequenceEqual(window.imgFastGlobalSubjects.howManyFastImg.asObservable(), )
      map((inputArray) => true)
    ),
  };
}

// export ImgFast?
customElements.define("img-fast", ImgFast);
