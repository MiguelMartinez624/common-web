export class AuthenticatorBuilder {


    build(selector) {

        const element = document.querySelector(selector);
        if (!element) {
            throw new Error("No se encontró ningún elemento con el selector especificado");
        }

        element.innerHTML = `
        <login-page>
            <credentials-strategy endpoint="https:localhost:4200/auth/login"></credentials-strategy>
        </login-page>`;
    }
}