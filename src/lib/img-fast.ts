
import {
  globalConfigType,
  globalDefaultConfig,
  isConfigType,
  elementStatusType,
  dlStatusEnum,
  elementConfigType,
  fileType,
  parseReturn,
} from "./types";
import { httpLoader } from "./httpWrapper";
import { Subscription } from "rxjs";
import { globalContainer } from "./stateKeeper";
import { verboseLog, searchStrForFileType } from "./helpers";
import { dataHandler2 } from "./dataHandler";
import { set100Height, setPaddingRatio } from "./domWrapper"
const css = "<style>" + require("../styles/main.css") + "</style>";
const template: string = require("../templates/component.html");

export class ImgFast extends HTMLElement {
  // private parser: ExifParser | undefined;

  private glob: globalContainer = window.imgFastGlobalContainer;
  private loaderId: number = this.glob.getUniqueID();
  private downloadSubscription: Subscription;
  private intrinsicRatio: number
  private currentConf: globalConfigType

  constructor() {
    super();
    // Attach a shadow root to the element.
    let shadowRoot = this.attachShadow({ mode: "open" });

    //setup configuration
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
    this.currentConf = {
      ...globalDefaultConfig,
      ...this.glob.config,
      ...providedElementConfig,
    }
    this.intrinsicRatio = this.currentConf.expectedRatio

    //Determine filetype from searchstring
    if (this.currentConf.expectedFileType == fileType.unknown) {
      this.currentConf.expectedFileType = searchStrForFileType(this.src)

    }

    //Init HTTP
    let loader = new httpLoader(
      this.src + "?" + Math.round(Math.random() * 100)
    );

    //Init dataHandler
    let DH = new dataHandler2(this.currentConf.expectedFileType, this.src)

    //Subscriptions
    this.downloadSubscription = this.glob.$dlDictator.subscribe((input) => {
      if (
        input.ids.includes(this.loaderId) &&
        input.dlCommand == dlStatusEnum.FetchFewKB
      ) {
        loader.setRequestRange("0-15000");
        //Process onload
        loader.getHTTPonLoadPromise().then(result => {

          //Append thumbnail if found in exif (else imgURL is just empty)
          let img = document.createElement("img");
          let parseRes = DH.parse(result);
          img.src = parseRes.imgURL

          //Update placeholder ratio
          if (parseRes.ratio == undefined) {
            if (!parseRes.parseFail) {
              let imgLoaded = false;
              img.onload = () => {
                console.log("width: " + img.width);
                this.intrinsicRatio = img.height / img.width;
                setPaddingRatio(ratioEl, this.intrinsicRatio)
                imgLoaded = parseRes.imgURL == undefined ? false : true;
                img.style.visibility = "initial"
                ratioEl.removeChild(this.shadowRoot.getElementById("svgContainer"))
              }
              img.style.visibility = "hidden"
              ratioEl.appendChild(img);
              setTimeout(() => {
                if (!imgLoaded) {
                  verboseLog("Error while trying to load thumbnail image to dom: " + this.src, true)
                }
              }, 20);
            }

            //No size found in metadata: add image hidden -> check ratio -> then update container ratio

          } else {
            this.intrinsicRatio = parseRes.ratio
            setPaddingRatio(ratioEl, this.intrinsicRatio)
            if (!parseRes.parseFail) {
              ratioEl.appendChild(img);
              ratioEl.removeChild(this.shadowRoot.getElementById("svgContainer"))
            } else {
              verboseLog("Parse fail, fetchFewKB: " + this.src, true)
            }
          }

        });

        //Send HTTP
        loader.sendHTTP();
      }
    });

    //Register this component
    this.glob.$elementRegistered.subscribe(() => {

    });
    this.glob.registerElement(this.loaderId);

    //Create svg-loaders
    let shadowTmpContainer = document.createElement("div");
    shadowRoot.innerHTML = css + template;
    let ratioEl: HTMLElement | null = this.shadowRoot.getElementById("ratio_keeper");
    if (this.currentConf.expectedRatio == 0) {
      set100Height(ratioEl)
    } else {
      setPaddingRatio(ratioEl, this.currentConf.expectedRatio)
    }
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
