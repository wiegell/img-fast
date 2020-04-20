import { OperatorFunction, Subject, Observable, BehaviorSubject } from "rxjs";
import { map, filter, share, bufferTime } from "rxjs/operators";
import { elementStatusType, collectedStatusType, dlStatusEnum } from "./types";

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
    };

    //Check if map is defined, and add id
    if (operatorStatusMap !== undefined) {
      //Iterate existing map for new properties
      for (let [mapId, status] of operatorStatusMap.entries()) {
        //Check if element is new
        collectedStatus.newElementRegistered =
          inputStatus.id === mapId
            ? false
            : collectedStatus.newElementRegistered;

        //Check if it has entered viewport
        collectedStatus.newElementInViewport =
          status.isInViewport !== inputStatus.isInViewport
            ? true
            : collectedStatus.newElementRegistered;
        //Input status will always be the most updated value (cannot exit viewport)
        status.isInViewport = inputStatus.isInViewport;
      }
    } else {
      //Create operator map
      operatorStatusMap = new Map();
    }

    //Add or replace values in map
    operatorStatusMap.set(inputStatus.id, inputStatus);

    //Add map to return object
    collectedStatus.statusMap = operatorStatusMap;

    return collectedStatus;
  });
}

//Subjects
export class globalContainer {
  //Variables
  private idCounter: number;

  //Subjects
  public statusInput: Subject<elementStatusType>;

  //Observables
  public $statusKeeper: Observable<collectedStatusType>;
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
      .pipe(mergeWithExistingElementMap());
    this.$newElement = this.$statusKeeper.pipe(
      filter((val) => val.newElementRegistered),
      map((input) => {
        if (input.statusMap !== undefined) {
          console.log("Shared?");
          return input.statusMap.get(input.updatedOrCreatedId);
        }
      }),
      share()
    );
    this.$newInViewport = this.$statusKeeper.pipe(
      filter((val) => val.newElementInViewport),
      map((input) => {
        return input.updatedOrCreatedId;
      }),
      bufferTime(200),
      map((input) => {
        return input;
      })
    );
    this.$dlDictator = this.$newInViewport.pipe(
      map((input) => {
        return { ids: input, dlCommand: dlStatusEnum.FetchFewKB };
      })
    );
  }
}
