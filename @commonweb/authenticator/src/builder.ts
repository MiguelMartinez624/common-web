export class AuthenticatorBuilder {
    private callback: Function;
    private logoutCallback: Function;

    onSuccess(callback: Function): AuthenticatorBuilder {
        this.callback = callback;
        return this;

    }

    onLogout(callback: Function): AuthenticatorBuilder {
        this.logoutCallback = callback;
        return this;

    }

    build(selector) {
        if (localStorage.getItem("user")) {
            this.callback();
        } else {
            this.renderForm(selector);
        }
    }

    private renderForm(selector) {
        const element = document.querySelector(selector);
        if (!element) {
            throw new Error("No se encontró ningún elemento con el selector especificado");
        }

        element.innerHTML = `
        <login-page>
            <firebase-strategy endpoint="https:localhost:4200/auth/login"></firebase-strategy>
        </login-page>`;

        element.querySelector("login-page").addEventListener("logout", () => this.logoutCallback(this.renderForm.bind(this)));
        element.querySelector("[auth-strategy]").addEventListener("login-success", this.callback);
    }
}
