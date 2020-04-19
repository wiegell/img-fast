import { EventBus } from "ts-bus";

export var bus: EventBus;

export function EventBusSetup() {
    //Check for event bus defined elsewhere
    if (bus instanceof EventBus) {
        console.error('Bus already defined - double import?');
    } else {
        console.log('Defining local event bus');
        bus = new EventBus()
    }
}