# @CommonWeb/forms

**@CommonWeb/Components** A set of components

### Summary

* It helps you create reusable and customizable web components without the need for heavy frameworks or external
  dependencies.
* It offers a simple and intuitive API for creating custom elements based on native web standards.
* It saves you time and effort, and helps you create more efficient and scalable web applications.

## Installation

**NPM**

```bash 
    npm install --save @commonweb/core
```

**Add the script to your HTML**
Add the CDN script tag to the <head> of your HTML file, and start using CommonWeb components to build your app!.

```html

<script src="https://unpkg.com/mi-paquete-js@latest/dist/mi-paquete-js.min.js"></script>
```

## Components

### StaticTemplate Component

#### Usage

After install just start using the component directly on the 

```html

<static-template context data='{"name":"World", "frameworks": [{"name":"React"},{"name":"Angular"}] }'>
    <h4>Hello! {{@host.data.name}}</h4>
    <ul>
        <template for-each="{{@[context].data.frameworks}}">
            <!--The list is under the for-each context so data refers to the item on the iteration-->
            <li>{{@host.data.name}}</li>
        </template>
    </ul>
</static-template>
``````

## License

[MIT](https://choosealicense.com/licenses/mit/)
