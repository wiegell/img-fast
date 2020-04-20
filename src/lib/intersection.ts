import { Subject } from "rxjs";


export class IntersectionWrapper {
    private config = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };
    private inViewportSubject = new Subject<boolean>()
    public $inViewport = this.inViewportSubject.asObservable()
    private onChange: (changes: any, observer: any) => void

    public IO: IntersectionObserver;
    constructor() {
        this.onChange = (changes, observer) => {
            changes.forEach(change => {
                if (change.intersectionRatio > 0) {
                    this.inViewportSubject.next(true)
                    observer.unobserve(change.target);
                }
            });
        }
        this.IO = new IntersectionObserver(this.onChange, this.config)
    }
}

