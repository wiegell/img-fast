import { logLevelEnum, globalDefaultConfig, fileType } from "./types";

export function verboseLog(input: any, isWarn: boolean) {
  if (
    (window.imgFastGlobalContainer.config !== undefined &&
      window.imgFastGlobalContainer.config.logLevel == logLevelEnum.verbose) ||
    globalDefaultConfig.logLevel == logLevelEnum.verbose
  ) {
    if (isWarn) {
      console.warn(input);
    } else {
      console.log(input);
    }
  }
}

export function errorLog(input: any) {
  if (
    window.imgFastGlobalContainer.config !== undefined &&
    window.imgFastGlobalContainer.config.logLevel !== logLevelEnum.none
  ) {
    console.log(input);
  }
}

export function searchStrForFileType(str: string) {
  if (str.search("jpg") != -1) {
    return fileType.jpg
  } else if (str.search("png") != -1) {
    return fileType.png
  } else if (str.search("gif") != -1) {
    return fileType.gif
  } else {
    return fileType.unknown
  }
}
