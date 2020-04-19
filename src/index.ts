
import { EventBusSetup, bus } from './lib/EventBusSetup';
import { EventBus } from "ts-bus";
import { ImgFast } from './lib/img-fast'


//Check that bus not instantiated from elsewhere, and then declare globaly
EventBusSetup();
declare global {
    interface Window {
        eBus: EventBus;
    }
}
if (window.eBus instanceof EventBus) {
    console.warn('EventBus already defined - intentional?');
} else if (window.eBus !== undefined) {
    console.error('EventBus (global var \'eBus\') already defined, but not of type EventBus');
} else {
    console.log('Defining global event bus');
    window.eBus = bus;
}

// export ImgFast?
customElements.define('img-fast', ImgFast);

