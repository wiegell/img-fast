export function set100Height(el: HTMLElement) {
    el.style.height = "100%";
    el.style.paddingTop = "0";
}

export function setPaddingRatio(el: HTMLElement, ratio: number) {
    el.style.height = "initial";
    el.style.paddingTop = ratio*100 + "%";
}