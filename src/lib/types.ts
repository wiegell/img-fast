// export type Partial<configType> = { [P in keyof configType]?: configType[P] };
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { map, filter, publish, share } from "rxjs/operators";
import { mergeWithExistingElementMap } from "./stateKeeper";

export const defaultConfig = {
  expectedJPG: true,
  expectedThumbnail: true,
  lulz: "test",
  lller: 3,
};

export type configType = typeof defaultConfig;
type configFieldNames = keyof configType;

//Type guards

export function isConfigType(
  providedConfig: any
): providedConfig is Partial<configType> {
  for (const key1 in providedConfig) {
    let keyExistsInprovidedConfig = false;
    let typeOfKeyIsCorrect = false;
    for (let i = 0; i < Object.keys(defaultConfig).length; i++) {
      // console.log('Keycomparison: ' + key1 + "//" + Object.keys(defaultConfig)[i]);
      // console.log('Valuecomparison: ' + typeof (providedConfig[key1]) + "//" + typeof Object.values(defaultConfig)[i]);
      keyExistsInprovidedConfig =
        key1 == Object.keys(defaultConfig)[i]
          ? true
          : keyExistsInprovidedConfig;
      typeOfKeyIsCorrect =
        typeof providedConfig[key1] == typeof Object.values(defaultConfig)[i]
          ? true
          : typeOfKeyIsCorrect;
      // console.log('keyExistsInprovidedConfig: ' + keyExistsInprovidedConfig);
      // console.log('typeOfKeyIsCorrect: ' + typeOfKeyIsCorrect);
      if (keyExistsInprovidedConfig && !typeOfKeyIsCorrect) {
        return false;
      }
    }
    if (!keyExistsInprovidedConfig || !typeOfKeyIsCorrect) {
      return false;
    }
  }
  return true;
}

export enum dlStatusEnum {
  Stopped,
  FetchFewKB,
  FetchMoreKB,
  FullDownload,
}

export enum fileType {
  jpg,
  png,
  gif,
  unsupported,
}

export type elementStatusType = {
  id: number;
  isInViewport: boolean;
  hasJustEnteredViewport: boolean;
  dlStatus: dlStatusEnum;
  expectedFileType?: fileType;
  actualFileType?: fileType;
  JPGHasEXIF?: boolean;
  JPGHasThumbnail?: boolean;
};

export type collectedStatusType = {
  updatedOrCreatedId: number;
  //Map key is id
  statusMap?: Map<number, elementStatusType>;
  newElementRegistered: boolean;
  newElementInViewport: boolean;
};
