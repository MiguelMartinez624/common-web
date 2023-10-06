function PropagateToChild(param) {
  return function(target, propertyKey) {
    if (!target["property_to_propagate"]) {
      target["property_to_propagate"] = /* @__PURE__ */ new Map();
    }
    target["property_to_propagate"].set(`${propertyKey}`, param);
  };
}

const eventMapName = "callback_bind_stack";
function isHTMLElementWithEventStack(element) {
  return eventMapName in element;
}
function EventBind(values) {
  return function(target, propertyKey, descriptor) {
    if (!isHTMLElementWithEventStack(target)) {
      target[eventMapName] = {};
    }
    const method = target[propertyKey];
    target.callback_bind_stack[`${values}`] = method;
  };
}
function attemptBindEvents(element) {
  if (isHTMLElementWithEventStack(element)) {
    bindEvents(element);
  }
}
function bindEvents(target) {
  Object.keys(target.callback_bind_stack).forEach((key) => {
    const sections = key.split(":");
    const method = target.callback_bind_stack[key];
    if (sections[0].startsWith("window")) {
      const event = sections[1];
      window.addEventListener(event, method.bind(target));
    } else {
      const element = target.shadowRoot.querySelector(sections[0]);
      if (element) {
        element.addEventListener(sections[1], method.bind(target));
      }
    }
  });
}

const storageKeyMapName = "storage_keys";
function FromStorage(name) {
  return function(target, propertyKey) {
    if (!target[storageKeyMapName]) {
      target[storageKeyMapName] = /* @__PURE__ */ new Map();
    }
    const method = target[propertyKey];
    target[storageKeyMapName].set(name, method);
  };
}
function subscribeToKeyChange(key, handler) {
  window.addEventListener(`storage-change:${key}`, (ev) => {
    handler(ev.detail.data);
  });
}
function changeStorageValue(key, value) {
  const changeEvent = new CustomEvent(`storage-change:${key}`, { detail: { data: value } });
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(changeEvent);
}
function syncWithStorage(target) {
  if (target[storageKeyMapName]) {
    for (const [storageKey, method] of target[storageKeyMapName]) {
      subscribeToKeyChange(storageKey, method.bind(target));
      const currentValue = localStorage.getItem(storageKey);
      invoque(method.bind(target), currentValue);
    }
  }
}
function invoque(method, value) {
  if (value) {
    if (isJSON(value)) {
      method(JSON.parse(value));
    } else {
      method(value);
    }
  }
}

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const validateSelector = (selector) => {
  if (selector.indexOf("-") <= 0) {
    throw new Error("You need at least 1 dash in the custom element name!");
  }
};
function insertTemplate(attr) {
  const casted = this;
  const shadowRoot = casted.attachShadow({ mode: "open" });
  const template = document.createElement("template");
  template.innerHTML = attr.style ? `<style>${attr.style}</style>${attr.template}` : attr.template;
  shadowRoot.appendChild(template.content.cloneNode(true));
  return casted;
}
function WebComponent(attr) {
  return function _WebComponent(constr) {
    validateSelector(attr.selector);
    let component = class extends constr {
      constructor(...args) {
        super(...args);
        __publicField(this, "casted");
        this.casted = insertTemplate.call(this, attr);
        attemptBindEvents(this);
        syncWithStorage(this);
      }
      attributeChangedCallback(name, oldValue, newValue) {
        if (this.attribute_list) {
          const handler = this.attribute_list.get(name);
          if (handler) {
            if (typeof newValue === "string" && isJSON(newValue)) {
              return handler.apply(this, [JSON.parse(newValue)]);
            }
            handler.apply(this, [newValue]);
          }
        }
      }
    };
    window.customElements.define(attr.selector, component);
    return component;
  };
}
function isJSON(str) {
  try {
    JSON.stringify(JSON.parse(str));
    return true;
  } catch (e) {
    return false;
  }
}

function findNodeOnUpTree(selector, element) {
  let queryResult = element.querySelector(selector);
  if (!queryResult && element.parentNode !== null) {
    queryResult = findNodeOnUpTree(selector, element.parentNode);
  }
  return queryResult;
}

const AttributeMapKey = "attribute_list";
function Attribute(name) {
  return function(target, propertyKey) {
    if (!target[AttributeMapKey]) {
      target[AttributeMapKey] = /* @__PURE__ */ new Map();
    }
    const method = target[propertyKey];
    target[AttributeMapKey].set(name, method);
  };
}

export { Attribute, EventBind, FromStorage, PropagateToChild, WebComponent, attemptBindEvents, bindEvents, changeStorageValue, findNodeOnUpTree, isJSON, subscribeToKeyChange, syncWithStorage };
//# sourceMappingURL=my-lib.mjs.map
