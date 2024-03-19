# CommonWeb

**CommonWeb** is a lightweight library with no external dependencies that allows you to create web apps easy and fast
using a set of already defined components
or use the library internals to create you ourn custom elements easily and efficiently.

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

## Usage


```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script src="https://unpkg.com/mi-paquete-js@latest/dist/mi-paquete-js.min.js"></script>
</head>
<body>
<!--the context attribute is just been used as css selector-->
<static-template context data='{"name":"World", "frameworks": [{"name":"React"},{"name":"Angular"}] }'>
  <h4>Hello! {{@host.data.name}}</h4>
  <ul>
    <template for-each="{{@[context].data.frameworks}}">
      <!--The list is under the for-each context so data refers to the item on the iteration-->
      <li>{{@host.data.name}}</li>
    </template>
  </ul>
</static-template>
</body>
</html>
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
