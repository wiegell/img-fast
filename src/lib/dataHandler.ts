import { ExifParserFactory, ExifData } from "ts-exif-parser";
import { ExifParser } from "ts-exif-parser/lib/ExifParser";
import { fileType, parseReturn } from "./types"
import { verboseLog } from "./helpers"

export class dataHandler2 {
  private data: ExifData | undefined;
  private parser: ExifParser | undefined;
  private thumbnailArBu: ArrayBuffer;


  constructor(private expectFT: fileType = fileType.jpg, private src: string) {

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
}
