import { thumb } from './lib/get-thumb';

export class HelloWorld extends HTMLElement {
    constructor() {
        super();
        // Attach a shadow root to the element.
        let shadowRoot = this.attachShadow({ mode: 'open' });
        let src: string = "./test.jpg"
        shadowRoot.innerHTML = `
            <style>
            img {
                width:50px;
                position: absolute;
                top:0;
                left:0;
                width:100%;
            }
            .container {
                width:50%;
                background-color: rgba(100,100,100,0.5);
            }
            #ratio_keeper {
                height:0;
                width:100%;
                padding: 122% 0 0 0;
                background-color: rgba(100,100,100,0.5);
                position: relative;
                overflow:hidden;
            }
            </style>
            <div class="container">
            <div id="ratio_keeper">
    
            </div>
            </div>
            `;
        //Start img-load after 1s
        let data = new thumb()

        setTimeout(() => {
            console.log(data.getExifData());
            let img = document.createElement("img");
            img.src = src;
            let tmp: any;
            if (tmp = shadowRoot.getElementById("ratio_keeper")) {
                tmp.appendChild(img)
            }

        }, 1000);
    }
}

customElements.define('img-fast', HelloWorld);

