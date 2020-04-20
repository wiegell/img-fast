import { OperatorFunction, Subject, Observable, BehaviorSubject } from "rxjs";
import { map, filter, share, bufferTime, tap } from "rxjs/operators";
import {
  elementStatusType,
  collectedStatusType,
  dlStatusEnum,
  globalConfigType,
} from "./types";

export function mergeWithExistingElementMap<T>(): OperatorFunction<
  elementStatusType,
  collectedStatusType
> {
  //Keys are id's
  let operatorStatusMap: Map<number, elementStatusType>;

  return map((inputStatus) => {
    //Define default return
    let collectedStatus: collectedStatusType = {
      updatedOrCreatedId: inputStatus.id,
      newElementRegistered: true,
      newElementInViewport: false,
      statusMap: operatorStatusMap
    };
    
    //Default is new entry, false means update entry
    let newEntry = true;
    //Check if map is defined, and add id
    if (operatorStatusMap !== undefined) {
      //Iterate existing map for new properties
      for (let [mapId, status] of operatorStatusMap.entries()) {
        //If the input statusid is already known, that means the 'status' defined in the
        //for-loop above is in fact by reference equal to the elements own status object
        if (inputStatus.id === mapId) {
          //An already known id means, that we want to update values.
          newEntry = false;
          //Remove new
          collectedStatus.newElementRegistered = false;
          //Check if it has entered viewport
          if (status.hasJustEnteredViewport) {
            console.log("Entered viewport: " + status.id);
            collectedStatus.newElementInViewport = true;
            status.hasJustEnteredViewport = false;
          }
        }
      }
    } else {
      //Create operator map
      operatorStatusMap = new Map();
    }
    //Add reference in map, only if the id wasn't found in map
    if (newEntry) {
      operatorStatusMap.set(inputStatus.id, inputStatus);
    }
    //Add map to return object
    collectedStatus.statusMap = operatorStatusMap;
    return collectedStatus;
  });
}

//Subjects
export class globalContainer {
  //Variables
  private idCounter: number;
  public config: globalConfigType | undefined;

  //Subjects
  public statusInput: Subject<elementStatusType>;

  //Observables
  private $statusKeeper: Observable<collectedStatusType>;
  public $newElement: Observable<elementStatusType | undefined>;
  public $newInViewport: Observable<number[]>;
  public $dlDictator: Observable<{ ids: number[]; dlCommand: dlStatusEnum }>;

  //Functions
  public getUniqueID = () => {
    this.idCounter++;
    return this.idCounter;
  };

  constructor() {
    //Variables
    this.idCounter = -1;

    //Subjects
    this.statusInput = new Subject<elementStatusType>();

    //Observables
    this.$statusKeeper = this.statusInput
      .asObservable()
      .pipe(mergeWithExistingElementMap(), share());
    this.$newElement = this.$statusKeeper.pipe(
      filter((val) => val.newElementRegistered),
      map((input) => {
        if (input.statusMap !== undefined) {
          return input.statusMap.get(input.updatedOrCreatedId);
        }
      }),
      share()
    );
    this.$newInViewport = this.$statusKeeper.pipe(
      // tap(input => {
      //     console.log('input tap:');
      //     console.log(input)
      // }),
      filter((val) => val.newElementInViewport),

      map((input) => {
        return input.updatedOrCreatedId;
      }),
      bufferTime(200),
      filter((val) => val.length !== 0),
      map((input) => {
        return input;
      }),
      share()
    );
    this.$dlDictator = this.$newInViewport.pipe(
      map((input) => {
        return { ids: input, dlCommand: dlStatusEnum.FetchFewKB };
      })
    );
  }
}
