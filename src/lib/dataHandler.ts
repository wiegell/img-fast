import { ExifParserFactory, ExifData } from "ts-exif-parser";
import { ExifParser } from "ts-exif-parser/lib/ExifParser";

export function main(result: ArrayBuffer, SR: ShadowRoot) {
  let data: ExifData | undefined;
  let parser: ExifParser | undefined;

  //Do parsing
  parser = ExifParserFactory.create(result);
  data = parser.parse();
  if (data.hasThumbnail("image/jpeg")) {
    // console.log(srcArray[i].substr(srcArray[i].length - 10));
    // console.log(result);

    //Make blob from thumbnail
    let thumbnailArBu = data.getThumbnailBuffer();
    let blob = new Blob([thumbnailArBu], { type: "image/jpeg" });
    let urlCreator = window.URL || window.webkitURL;
    let imageUrl = urlCreator.createObjectURL(blob);

    //Append thumbnail
    let img = document.createElement("img");
    img.src = imageUrl;
    let tmp: HTMLElement | null = SR.getElementById("ratio_keeper");
    if (tmp != null) {
      tmp.appendChild(img);
    } else {
      console.error();
    }
  }
}
