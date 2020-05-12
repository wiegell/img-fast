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

export interface QPromise<T> extends Promise<T> {
  isFulfilled?: () => boolean,
  isResolved?: () => boolean,
  isRejected?: () => boolean,
}

export function MakeQuerablePromise(prom: Promise<any>): QPromise<any> {
  // Don't create a wrapper for promises that can already be queried.

  let isResolved = false;
  let isRejected = false;

  // Observe the promise, saving the fulfillment in a closure scope.
  let result: QPromise<any> = prom.then(
     function(v) { isResolved = true; return v; }, 
     function(e) { isRejected = true; throw e; });
  result.isFulfilled = function() { return isResolved || isRejected; };
  result.isResolved = function() { return isResolved; }
  result.isRejected = function() { return isRejected; }
  return result;
}
