if (window.RegisterWebComponent) {

    window
        .RegisterWebComponent({
            selector: 'web-form',
            template: `<slot></slot>`,
            // so we can take global style rules
        })
        .with_method("submit", function () {
            const selects = this.querySelectorAll("form-select")
            const value = {};
            const formFields = this.querySelectorAll("form-field")
            formFields.forEach((input) => value[input.getAttribute("property")] = input.value());
            selects.forEach((input) => value[input.getAttribute("property")] = input.value());

            const event = new CustomEvent("submit", {detail: {data: value}});
            this.dispatchEvent(event)
        })
        .with_method("reset", function () {
            const inputs = this.querySelectorAll("form-field")
            const select = this.querySelectorAll("select")
            inputs.forEach((input) => input.reset());
            select.forEach((input) => input.value = "");
        })
        .build();


    window
        .RegisterWebComponent({
            //language=css
            style: `
                :host {
                    display: block;
                }`,
            selector: 'form-field',
            // language=HTML
            template: `

                <label class="text-xs"    for="">{{@host.label}}</label>
                <input
                        placeholder="{{@host.placeholder}}"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        type="{{@host.format}}">
            `,
            useShadow: false,

            // so we can take global style rules,
        })
        .with_attribute("placeholder", "")
        .with_attribute("format", "text")
        .with_attribute("label", "")
        .with_attribute("property", "")
        .with_attribute("value", function () {
            return this.querySelector("input").value;
        })
        .with_method("reset", function () {
            this.querySelector("input").value = "";
        })
        .with_method("setValue", function (value) {
            this.querySelector("input").value = value;
        })
        .build();


    window
        .RegisterWebComponent({
            //language=CSS
            style: `
                .content {
                    position: relative;
                }

                .option-list {
                    position: absolute;
                    max-height: 200px;
                    overflow: auto;
                    width: 100%;
                }

                .option {
                    background-color: rgb(55 65 81 / var(--tw-bg-opacity));
                    color: white;
                    padding: 1em 0.5em;
                }

                .option:hover {
                    background-color: rgb(54 117 219);

                }

                .overlay {
                    top: 0;
                    position: fixed;
                    height: 100%;
                    width: 100%;
                    left: 0;
                }

                ul {
                    border: none;
                    list-style: none;
                }
            `,
            selector: 'form-select',
            // language=HTML
            template: `

                <div class="content">
                    <form-field placeholder="{{@host.placeholder}}" label="{{@host.label}}"></form-field>
                    <bind-element from=input:(focus) to="toggable-element:show"></bind-element>

                    <bind-element from=form-field:(click) to="toggable-element:show"></bind-element>
                    <bind-element from=ul:(click) to="toggable-element:hide"></bind-element>

                    <toggable-element hidden>
                        <div class="overlay"></div>
                        <bind-element from=.overlay:(click) to="toggable-element:hide"></bind-element>
                        <ul class="option-list bg-gray-50 border text-gray-900 cursor-pointer">
                        </ul>
                    </toggable-element>
                </div>
            `,
            useShadow: false,
        })
        .with_attribute("label-path", "")
        .with_attribute("value-path", "")
        .with_attribute("placeholder", "")
        .with_attribute("label", "")
        .with_attribute("property", "")
        .with_attribute("data", function (data) {
            this._data = data;
        })
        .with_method("value", function () {
            return this._value;
        })
        .with_method("reset", function () {
            if (!this['label-path'] || !this['value-path']) {
                return;
            }
            if (this._data && Array.isArray(this._data)) {
                this._data.forEach((item) => {
                    const li = document.createElement("li");
                    // language=HTML
                    const option = `
                        <div value="{{@host.data.${this['value-path']}}}">{{@host.data.${this['label-path']}}}
                        </div>`
                    li.innerHTML = `<template-view></template-view>`;
                    li.classList.add("option")
                    li.children.item(0).setAttribute("data", JSON.stringify(item));
                    li.children.item(0).view = option;


                    li.addEventListener("click", () => {
                        const selected = li.children.item(0).children.item(0);
                        this._value = selected.getAttribute("value");
                        this.querySelector("form-field").setValue(selected.textContent);
                    });


                    this.querySelector(".option-list").appendChild(li);
                });
            }

        })
        .on_init(function () {
            this.reset();
        })
        .build();

}