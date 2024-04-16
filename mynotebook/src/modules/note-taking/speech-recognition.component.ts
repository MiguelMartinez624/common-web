import {WebComponent} from "@commonweb/core";
import {CARD_STYLE} from "../expenses/styles";


@WebComponent({
    selector: "cw-speech-recognition",
    // language=HTML
    template: `
        <cw-microphone-icon toggle></cw-microphone-icon>
    `,
    // language=CSS
    style: `
        cw-microphone-icon {
            height: 24px;
            width: 18px
        }

        .recording {
            animation: agrandar-encoger 1s infinite alternate;
        }

        @keyframes agrandar-encoger {
            0% {
                transform: scale(0.8);
            }
            50% {
                transform: scale(1.3);
            }
            100% {
                transform: scale(0.8);
            }
        }

    `

})
export class SpeechRecognitionComponent extends HTMLElement {

    private isRecording: boolean = false;
    private rec: any;

    connectedCallback() {
        const element = (this as any);

        element
            .query()
            .where("cw-microphone-icon")
            .then((element: any) => {
                element.addEventListener("click", () => {
                    element.toggleClass("recording")
                    if (this.rec) {
                        this.rec.stop();
                        this.rec = null;
                    } else {
                        this.rec = this.checkSpeechRecognition();
                        this.rec.start();
                    }


                })
            })
            .catch(console.error)
            .build()
            .execute()
    }


    public checkSpeechRecognition() {
        if (!('webkitSpeechRecognition' in window)) {
            alert(" webkitSpeechRecognition no sopported")
            return null;
        } else {
            // @ts-ignore
            const recognition = new webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = "es-ES";

            let final_transcript = "";
            let interim_transcript = "";


            recognition.onstart = () => {
                console.log("starting rec")
                this.isRecording = true;
            }

            recognition.onerror = (ev) => {
                console.log("error rec")
                console.log(ev)
                this.isRecording = false;
            }

            recognition.onend = () => {
                this.isRecording = false;
                this.dispatchEvent(new CustomEvent("speech-ended", {detail: {final_transcript, interim_transcript}}))
            }

            recognition.onresult = (event) => {
                for (var i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        final_transcript += event.results[i][0].transcript;
                    } else {
                        interim_transcript += event.results[i][0].transcript;
                    }
                }
            };

            return recognition;
        }

    }

}