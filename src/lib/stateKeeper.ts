import { OperatorFunction, Subject, Observable, BehaviorSubject } from "rxjs";
import { map, filter, share } from "rxjs/operators";
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
    };

    //Check if map is defined, and add id
    if (operatorStatusMap !== undefined) {
      //Check is element is new
      for (let [mapId, status] of operatorStatusMap.entries()) {
        collectedStatus.newElementRegistered =
          inputStatus.id === mapId
            ? false
            : collectedStatus.newElementRegistered;
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
    public $dlDictator: Observable<{ids: number[], dlCommand: dlStatusEnum}>
  
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
            console.log('Shared?');
            return input.statusMap.get(input.updatedOrCreatedId);
          }
        }),
        share()
      );
      this.$dlDictator = new BehaviorSubject<{ids: number[], dlCommand: dlStatusEnum}>({ids: [3,4,5], dlCommand: dlStatusEnum.FetchFewKB}).asObservable()

    }
  }
  