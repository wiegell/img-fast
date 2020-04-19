import { ExifParserFactory, ExifData } from "ts-exif-parser";
import { ExifParser } from "ts-exif-parser/lib/ExifParser";
import { configType, defaultConfig, isConfigType, exist } from "./types";
import { bus } from "./EventBusSetup";
import { Loader } from "./Loader";
const css = "<style>" + require("../styles/main.css") + "</style>";
const template: string = require("../templates/component.html");

export class ImgFast extends HTMLElement {
  // private parser: ExifParser | undefined;
  private data: ExifData | undefined;
  private parser: ExifParser | undefined;

  constructor() {
    super();
    // Attach a shadow root to the element.
    let shadowRoot = this.attachShadow({ mode: "open" });
    let isFirstInstance = true;

    //Listen for other creates
    bus.subscribe(exist, (event) => {
      console.log("Created! " + event.payload.greeting);
    });

    //Publish creation
    bus.publish(
      exist({
        greeting: "hello",
      })
    );

    //setup configuration
    let providedConfig: Partial<configType>;
    try {
      providedConfig = JSON.parse(this.children[0].innerHTML);
      if (!isConfigType(providedConfig)) {
        throw "config misconfigured";
      }
    } catch (ex) {
      console.warn("No configuration stated, fallback to default: " + ex);
      providedConfig = {};
    }
    let currentConf: Required<configType> = {
      ...defaultConfig,
      ...providedConfig,
    };

    //Create svg-loaders
    let shadowTmpContainer = document.createElement("div");
    shadowRoot.innerHTML = css + template;

    let loader = new Loader(this.src + "?" + Math.round(Math.random() * 100));
    //Process onload
    loader.getHTTPonLoadPromise().then((result: ArrayBuffer) => {
      //Do parsing
      this.parser = ExifParserFactory.create(Buffer.from(result));
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
        let tmp: HTMLElement | null = shadowRoot.getElementById("ratio_keeper");
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
