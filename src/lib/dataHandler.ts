import { ExifParserFactory, ExifData } from "ts-exif-parser";
import { ExifParser } from "ts-exif-parser/lib/ExifParser";
import { fileType, parseReturn, dlStatusEnum } from "./types"
import { verboseLog } from "./helpers"
import { set100Height, setPaddingRatio, change } from "./domWrapper"

export class dataHandler2 {
  private data: ExifData | undefined;
  private parser: ExifParser | undefined;
  private thumbnailArBu: ArrayBuffer;

  constructor(public intrinsicRatio: number, private expectFT: fileType = fileType.jpg, private src: string) {
  }

  //Returns url to blob
  parse(AB: ArrayBuffer): parseReturn {
    let emptyRet = { imgURL: undefined, parseFail: true };
    let width, height: number

    switch (this.expectFT) {
      case fileType.unknown: {
        return emptyRet;
        break
      }
      case fileType.jpg: {
        this.parser = ExifParserFactory.create(AB);
        this.data = this.parser.parse();
        if (this.data.hasThumbnail("image/jpeg")) {

          //Make blob from thumbnail
          this.thumbnailArBu = this.data.getThumbnailBuffer();
          let blob = new Blob([this.thumbnailArBu], { type: "image/jpeg" });
          let urlCreator = window.URL || window.webkitURL;
          let imageURL = urlCreator.createObjectURL(blob);

          try {
            ({ width, height } = this.data.getImageSize())
            verboseLog("Width x height (" + width + "x" + height + ") found in exif of: " + this.src, false)
            return { imgURL: imageURL, x: width, y: height, ratio: (height / width), parseFail: false }
          }
          catch {
            verboseLog("No size info in first few kb of: " + this.src, false)
            return { imgURL: imageURL, parseFail: false }
          }
        } else {
          verboseLog("No thumbnail found in jpg: " + this.src, false)
          try {
            ({ width, height } = this.data.getImageSize())
            verboseLog("Width x height (" + width + "x" + height + ") found in exif of: " + this.src, false)
            return { imgURL: undefined, x: width, y: height, ratio: (height / width), parseFail: false }
          }
          catch {
            verboseLog("No size info in first few kb of: " + this.src, false)
            return emptyRet
          }
        }
        break
      } case fileType.png: {
        return emptyRet;
      }
    }
  }

  // Returns the created element
  httpResultHandler(loadLvl: dlStatusEnum, result, SR: ShadowRoot, DH: dataHandler2) {
    //Append thumbnail if found in exif (else imgURL is just empty)
    let ratioEl = SR.getElementById("ratio_keeper")
    let img = document.createElement("img");
    let parseRes = DH.parse(result);
    if (parseRes.imgURL != undefined) {
      //Check if image data has actually been parsed and add to img obj.
      img.src = parseRes.imgURL
    }

    //Update placeholder ratio
    if (parseRes.ratio == undefined) {
      //If size found in metadata: add image hidden -> check ratio -> then update container ratio
      if (!parseRes.parseFail) {
        let imgLoaded = false;
        img.onload = () => {
          console.log("width: " + img.width);
          this.intrinsicRatio = img.height / img.width;
          setPaddingRatio(ratioEl, this.intrinsicRatio)
          imgLoaded = parseRes.imgURL == undefined ? false : true;
          change({ fromInvis: true, toBlur: true, fade: true, fadeTime: 300 }, ratioEl, img, SR.getElementById("svgContainer"))
        }
        img.style.visibility = "hidden"
        ratioEl.appendChild(img);
        setTimeout(() => {
          if (!imgLoaded) {
            verboseLog("Error while trying to load thumbnail image to dom: " + this.src, true)
          }
        }, 20);
      } else {
        verboseLog("Parse fail, fetchFewKB: " + this.src, true)
      }
    } else {
      //Else update ratio with size from metadata
      this.intrinsicRatio = parseRes.ratio
      setPaddingRatio(ratioEl, this.intrinsicRatio)
      if (!parseRes.parseFail) {
        if (parseRes.imgURL != undefined) {
          //Check if image data has actually been parsed
          change({ fromInvis: false, toBlur: true, fade: true, fadeTime: 500 }, ratioEl, img, SR.getElementById("svgContainer"))
        }
      } else {
        verboseLog("Parse fail, fetchFewKB: " + this.src, true)
      }
    }

  }
}
