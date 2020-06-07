import { OperatorFunction, Subject, Observable, BehaviorSubject } from "rxjs";
import { map, filter, share, bufferTime, tap } from "rxjs/operators";
import {
  elementStatusClass,
  collectedStatusType,
  dlStatusEnum,
  globalConfigType,
} from "./types";
import { IntersectionWrapper } from "./intersection";

//Subjects
export class globalContainer {
  //Variables
  private idCounter: number;
  public config: globalConfigType | undefined;
  private globalStatusMap: Map<number, elementStatusClass>;

  //Subjects
  // public statusInput: Subject<elementStatusClass>;
  private registerElementSubj: Subject<{ id: number }>;
  private hasEnteredViewport: Subject<{ id: number }>;

  //Wrapper functions
  public registerElement(id: number) {
    this.registerElementSubj.next({ id: id });
  }
  public observeViewportEnter(id: number, el: HTMLElement) {
    if ("IntersectionObserver" in window) {
      // IntersectionObserver Supported
      let observer = new IntersectionWrapper();
      observer.$inViewport.subscribe((isInViewport) => {
        if (isInViewport == false) {
        } else if (
          isInViewport == true &&
          this.globalStatusMap.get(id).isInViewport == false
        ) {
          //Has just entered
          this.globalStatusMap.get(id).isInViewport = true;
          this.hasEnteredViewport.next({ id: id });
        }
        // this.status.hasJustEnteredViewport = true;
        // this.glob.statusInput.next(this.status);
      });
      observer.IO.observe(el);
    } else {
      // IntersectionObserver NOT Supported
      console.error("Intersection observer not supported");
    }
  }

  //Observables
  private $statusKeeper: Observable<collectedStatusType>;
  public $elementRegistered: Observable<{
    id: number;
    newElementRegistered: boolean;
  }>;
  // public $newElement: Observable<elementStatusClass | undefined>;
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
    this.globalStatusMap = new Map();

    //Subjects

    this.registerElementSubj = new Subject<{ id: number }>();
    this.hasEnteredViewport = new Subject<{ id: number }>();

    //Observables

    this.$elementRegistered = this.registerElementSubj.asObservable().pipe(
      map((inputIdObj) => {


        let returnObj = { id: inputIdObj.id, newElementRegistered: true };

        //Iterate existing map for new properties
        for (let [mapId, status] of this.globalStatusMap.entries()) {
          //If the input statusid is already known, that means the 'status' defined in the
          //for-loop above is in fact by reference equal to the elements own status object
          if (inputIdObj.id === mapId) {
            //An already known id means, that we want to update values.
            returnObj.newElementRegistered = false;
          }
        }

        //Add data to map
        if (returnObj.newElementRegistered) {
          var newEle = new elementStatusClass({ id: 0 });
          this.globalStatusMap.set(inputIdObj.id, newEle);
          var statusMap = this.globalStatusMap.get(inputIdObj.id);

          console.log("Test: ");
          console.log(statusMap);
        }

        return returnObj;
      }),
      share()
    );
    this.$newInViewport = this.hasEnteredViewport.pipe(
      map((input) => {
        return input.id;
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
        console.log('DL-dict, test: ' + input);
        return { ids: input, dlCommand: dlStatusEnum.FetchFewKB };
      }),
      share()
    );
  }
}
