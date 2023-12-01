export class AuthenticatorBuilder {
    private callback: Function;

    onSuccess(callback: Function): AuthenticatorBuilder {
        this.callback = callback;
        return this;

    }

    build(selector) {

        const element = document.querySelector(selector);
        if (!element) {
            throw new Error("No se encontró ningún elemento con el selector especificado");
        }

        element.innerHTML = `
        <login-page>
            <firebase-strategy endpoint="https:localhost:4200/auth/login"></firebase-strategy>
        </login-page>`;


        element.querySelector("[auth-strategy]").addEventListener("login-success",this.callback);

    }
}