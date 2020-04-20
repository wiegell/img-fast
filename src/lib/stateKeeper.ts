import { OperatorFunction } from "rxjs"
import { map } from 'rxjs/operators'
import { elementStatusType, collectedStatusType } from "./types"

export function mergeWithExistingElementMap<T>(): OperatorFunction<elementStatusType, collectedStatusType> {
    //Keys are id's
    let operatorStatusMap: Map<number, elementStatusType>;

    return map(inputStatus => {

        //Define default return
        let collectedStatus: collectedStatusType = {
            updatedOrCreatedId: inputStatus.id,
            newElementRegistered: false
        };

        //Check if map is defined, and add id
        if (operatorStatusMap !== undefined) {
            //Check is element is known
            for (let [mapId, status] of operatorStatusMap.entries()) {
                if (inputStatus.id === mapId) {
                    //Known element
                } else {
                    //New element
                    collectedStatus.newElementRegistered = true;
                }
            }

        } else {
            //Create operator map
            operatorStatusMap = new Map()
            collectedStatus.newElementRegistered = true;
        }

        //Add or replace values in map
        operatorStatusMap.set(inputStatus.id, inputStatus)

        //Add map to return object
        collectedStatus.statusMap = operatorStatusMap

        return collectedStatus;
    });
}