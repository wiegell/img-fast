import { logLevelEnum, globalDefaultConfig } from "./types";

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
