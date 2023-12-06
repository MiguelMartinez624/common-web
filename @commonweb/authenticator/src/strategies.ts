import {changeStorageValue, WebComponent} from "@commonweb/core";
import "@commonweb/data";
import {DataFetcher, DataFetcherConfiguration} from "@commonweb/data";

@WebComponent({
    selector: "credentials-strategy",
    template: "<data-fetcher><data-fetcher>",
})
export class CredentialsStrategy extends HTMLElement {
    connectedCallback() {
        this.setAttribute("auth-strategy", "credentials")
    }

    public execute(username: string, password: string): void {
        const fetcher = this.shadowRoot.querySelector("data-fetcher") as DataFetcher;
        const configuration: DataFetcherConfiguration = {
            method: "POST",
            source: this.getAttribute("endpoint"),
            injectTo: [],
            auto: false,
            fieldType: "attribute"
        }

        fetcher.setAttribute("configurations", JSON.stringify(configuration));
        fetcher.execute([username, password]);
    }
}

@WebComponent({
    selector: "firebase-strategy",
    template: "<data-fetcher><data-fetcher>",
})
export class FirebaseStrategy extends HTMLElement {
    private signInWithEmailAndPassword: any;
    private auth: any;
    private firebaseConfig = {
        apiKey: "AIzaSyAzbjXwIa_9u5FppOkd6AHGyNujjcEkOus",
        authDomain: "pulpo-70538.firebaseapp.com",
        projectId: "pulpo-70538",
        storageBucket: "pulpo-70538.appspot.com",
        messagingSenderId: "316478909661",
        appId: "1:316478909661:web:2aebb59de8e346fca07f34",
        measurementId: "G-7QSV23RCZT"
    };

    connectedCallback() {
        this.setAttribute("auth-strategy", "firebase")
        Promise.all(
            [
                import("https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js"),
                import ("https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js")
            ])
            .then((result) => {
                const {initializeApp} = result[0];
                const {signInWithEmailAndPassword, getAuth} = result[1];
                const app = initializeApp(this.firebaseConfig);

                this.signInWithEmailAndPassword = signInWithEmailAndPassword;
                this.auth = getAuth();
                console.log(this.auth)

            });


    }

    public execute(credentials: { username: string, password: string }): void {

        this.signInWithEmailAndPassword(this.auth, credentials.username, credentials.password)
            .then((result) => {
                console.log({result})
                changeStorageValue("user", {username: "test"})
                this.dispatchEvent(new CustomEvent("login-success"));
            })
            .catch((error) => {
                console.error(error.message);
                // Mostrar alerta de error de inicio de sesión
                alert("Error al iniciar sesión: " + error.message);
            });
    }
}
