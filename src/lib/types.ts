// export type Partial<configType> = { [P in keyof configType]?: configType[P] };
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { map, filter, publish, share } from "rxjs/operators";

//Config
const elementDefaultConfig = {
  expectedJPG: true,
  expectedThumbnail: true,
  lulz: "test",
  lller: 3,
};

export type elementConfigType = typeof elementDefaultConfig;
export type globalConfigType = elementConfigType & {
  priorities: Set<priorityEnum>;
  logLevel: logLevelEnum;
};

export enum logLevelEnum {
  errors,
  verbose,
  none,
}

//Possible priorites
export enum priorityEnum {
  jpgExifInView,
  jpgThumbnailInView,
  jpgExifFullPage,
  jpgCompleteInView,
  pngsInView,
  jpgThumbnailFullPage,
  jpgCompleteFullPage,
  pngsCompleteFullPage,
}

export const globalDefaultConfig: globalConfigType = {
  ...elementDefaultConfig,
  logLevel: logLevelEnum.verbose,
  //Actual priorities
  priorities: new Set<priorityEnum>()
    .add(priorityEnum.jpgExifInView)
    .add(priorityEnum.jpgThumbnailInView)
    .add(priorityEnum.jpgExifFullPage)
    .add(priorityEnum.jpgCompleteInView)
    .add(priorityEnum.pngsInView)
    .add(priorityEnum.jpgThumbnailFullPage)
    .add(priorityEnum.jpgCompleteFullPage)
    .add(priorityEnum.pngsCompleteFullPage),
};

//Config type guards

export function isConfigType(
  providedConfig: any
): providedConfig is Partial<elementConfigType> {
  for (const key1 in providedConfig) {
    let keyExistsInprovidedConfig = false;
    let typeOfKeyIsCorrect = false;
    for (let i = 0; i < Object.keys(elementDefaultConfig).length; i++) {
      // console.log('Keycomparison: ' + key1 + "//" + Object.keys(defaultConfig)[i]);
      // console.log('Valuecomparison: ' + typeof (providedConfig[key1]) + "//" + typeof Object.values(defaultConfig)[i]);
      keyExistsInprovidedConfig =
        key1 == Object.keys(elementDefaultConfig)[i]
          ? true
          : keyExistsInprovidedConfig;
      typeOfKeyIsCorrect =
        typeof providedConfig[key1] ==
        typeof Object.values(elementDefaultConfig)[i]
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
  unknown,
}

export type elementStatusType = {
  id: number;
  isInViewport?: boolean;
  hasJustEnteredViewport?: boolean;
  dlStatus?: dlStatusEnum;
  expectedFileType?: fileType;
  actualFileType?: fileType;
  JPGHasEXIF?: boolean;
  JPGHasThumbnail?: boolean;
};

export class elementStatusClass {
  public id = -1;
  public isInViewport = false;
  public hasJustEnteredViewport = false;
  public dlStatus = dlStatusEnum.Stopped;
  public expectedFileType = fileType.unknown;
  public actualFileType = fileType.unknown;
  public JPGHasEXIF = false;
  public JPGHasThumbnail = false;

    constructor(opts: elementStatusType) {
        Object.assign(this, opts);
    }

}

export type collectedStatusType = {
  updatedOrCreatedId: number;
  //Map key is id
  // statusMap: Map<number, elementStatusType>;
  newElementRegistered: boolean;
  newElementInViewport: boolean;
};
