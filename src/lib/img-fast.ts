import { ExifParserFactory, ExifData } from "ts-exif-parser";
import { ExifParser } from "ts-exif-parser/lib/ExifParser";
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
const css = "<style>" + require("../styles/main.css") + "</style>";
const template: string = require("../templates/component.html");

export class ImgFast extends HTMLElement {
  // private parser: ExifParser | undefined;
  private data: ExifData | undefined;
  private parser: ExifParser | undefined;
  private glob: globalContainer = window.imgFastGlobalContainer;
  private loaderId: number = this.glob.getUniqueID();
  // private status: elementStatusType = {
  //   id: this.glob.getUniqueID(),
  //   dlStatus: dlStatusEnum.Stopped,
  //   isInViewport: false,
  //   hasJustEnteredViewport: false,
  // };
  private downloadSubscription: Subscription;

  constructor() {
    super();
    // Attach a shadow root to the element.
    let shadowRoot = this.attachShadow({ mode: "open" });

    // Subscribe to global subject
    // this.obs.areSVGsRendered.subscribe((input) => {
    //   console.log("yey! ");
    // });

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
        loader.getHTTPonLoadPromise().then((result: ArrayBuffer) => {
          //Do parsing
          this.parser = ExifParserFactory.create(result);
          this.data = this.parser.parse();
          if (this.data.hasThumbnail("image/jpeg")) {
            // console.log(srcArray[i].substr(srcArray[i].length - 10));
            // console.log(result);

            //Make blob from thumbnail
            let thumbnailArBu = this.data.getThumbnailBuffer();
            let blob = new Blob([thumbnailArBu], { type: "image/jpeg" });
            let urlCreator = window.URL || window.webkitURL;
            let imageUrl = urlCreator.createObjectURL(blob);

            //Append thumbnail
            let img = document.createElement("img");
            img.src = imageUrl;
            let tmp: HTMLElement | null = shadowRoot.getElementById(
              "ratio_keeper"
            );
            if (tmp != null) {
              tmp.appendChild(img);
            } else {
              console.error();
            }
          }
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
