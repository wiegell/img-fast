// export type Partial<configType> = { [P in keyof configType]?: configType[P] };
import { BehaviorSubject, Observable, Subject } from "rxjs";

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

export type statusType = {
  dlStatus: dlStatusEnum;
  expectedFileType?: fileType;
  actualFileType?: fileType;
  JPGHasEXIF?: boolean;
  JPGHasThumbnail?: boolean;
};

//Subjects
export type globalSubjectContainer = {
  howManyFastImg: BehaviorSubject<number>;
  smallRangeLoaded: Subject<boolean>;
};

export type globalObservableContainer = {
  areAllSmallRangesLoaded: Observable<boolean>
};
