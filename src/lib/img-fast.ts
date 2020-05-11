
import {
  globalConfigType,
  globalDefaultConfig,
  isConfigType,
  elementStatusType,
  dlStatusEnum,
  elementConfigType,
} from "./types";
import { Loader } from "./Loader";
import { Subscription } from "rxjs";
import { globalContainer } from "./stateKeeper";
import { verboseLog } from "./helpers";
import { main } from "./dataHandler";
const css = "<style>" + require("../styles/main.css") + "</style>";
const template: string = require("../templates/component.html");

export class ImgFast extends HTMLElement {
  // private parser: ExifParser | undefined;
  
  private glob: globalContainer = window.imgFastGlobalContainer;
  private loaderId: number = this.glob.getUniqueID();
  private downloadSubscription: Subscription;

  constructor() {
    super();
    // Attach a shadow root to the element.
    let shadowRoot = this.attachShadow({ mode: "open" });

    //Subscriptions
    this.downloadSubscription = this.glob.$dlDictator.subscribe((input) => {
      if (
        input.ids.includes(this.loaderId) &&
        input.dlCommand == dlStatusEnum.FetchFewKB
      ) {
        //HTTP-setup
        let loader = new Loader(
          this.src + "?" + Math.round(Math.random() * 100)
        );
        //Process onload
        loader.getHTTPonLoadPromise().then( result => {
          main(result, this.shadowRoot)
        });

        //Send HTTP
        loader.sendHTTP();
      }
    });

    //Register this component
    this.glob.$elementRegistered.subscribe(() => {
      console.log("yay new element");
    });
    this.glob.registerElement(this.loaderId);

    //setup configuration
    {
      let providedElementConfig: Partial<elementConfigType>;
      try {
        providedElementConfig = JSON.parse(this.children[0].innerHTML);
        if (!isConfigType(providedElementConfig)) {
          throw "config misconfigured";
        }
      } catch (ex) {
        verboseLog("No configuration stated, fallback to default: " + ex, true);
        providedElementConfig = {};
      }
      //Base globalDefaultConfig, overwrite with possible given global configuration, then element configuration
      let currentConf: globalConfigType = {
        ...globalDefaultConfig,
        ...this.glob.config,
        ...providedElementConfig,
      };
    }

    //Create svg-loaders
    let shadowTmpContainer = document.createElement("div");
    shadowRoot.innerHTML = css + template;
    // this.subj.SVGRender.next(true);

    //Intersection start
    this.glob.observeViewportEnter(this.loaderId, this);
  }

  //Getters
  get src() {
    let tmp = this.getAttribute("src");
    if (tmp == null) {
      console.error("No src defined");
      return "";
    } else {
      return tmp;
    }
  }

  //Setters
}
