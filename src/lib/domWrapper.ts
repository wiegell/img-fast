import { resolve } from "dns";
import { rejects } from "assert";

export function set100Height(el: HTMLElement) {
    el.style.height = "100%";
    el.style.paddingTop = "0";
}

export function setPaddingRatio(el: HTMLElement, ratio: number) {
    el.style.height = "initial";
    el.style.paddingTop = ratio * 100 + "%";
}

export type styleChangeConfiguration = {
    //fromInvis is refering to the oncoming element, which is often invisible in DOM to check dimensions
    fromInvis?: boolean,
    toInvis?: boolean,
    fromBlur?: boolean,
    toBlur?: boolean,
    fade?: boolean,
    fadeTime?: number
}

//El1 = change to, EL2 optional change from, return promise to fading done.
export function change(SCC: styleChangeConfiguration, container: HTMLElement, el1: HTMLElement, el2?: HTMLElement): Promise<boolean> {

    let changeComplete = new Promise<boolean>((resolve: (done: boolean) => void, reject: (Err: Error) => void) => {
        if (SCC.fade == true) {
            el1.style.opacity = "0"
            if (SCC.toBlur == true) {
                el1.style.filter = "blur(10px)"
                el1.style.transform = "scale(1.07)"
            }

            el1.style.transition = "opacity " + SCC.fadeTime + "ms ease-in-out "

            if (SCC.fromInvis == true) {
                setTimeout(() => {
                    //This means the image is already in DOM
                    el1.style.opacity = "1"
                    if (arguments.length == 4) {
                        setTimeout(() => {
                            container.removeChild(el2)
                            resolve(true)
                        }, SCC.fadeTime);
                    }
                }, 20);
            } else {
                container.appendChild(el1)
                setTimeout(() => {

                    el1.style.opacity = "1"
                    if (arguments.length == 4) {
                        setTimeout(() => {
                            el2.parentElement.removeChild(el2)
                            resolve(true)
                        }, SCC.fadeTime);
                    }
                }, 20);
            }

        }
    })

    return changeComplete;
}