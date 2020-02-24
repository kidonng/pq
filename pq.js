const pq = function(target) {
  if (target instanceof Element) {
    target = [target]
  } else if (typeof target === 'string' || Array.isArray(target)) {
    target = [...document.querySelectorAll(target)]
  } else {
    return
  }
  const proxy = new Proxy(target, {
    get(target, key) {
      // New functions
      if (key in pq.___) {
        return function(...argument) {
          target.forEach(function(element) {
            new pq._(element)[key](...argument)
          })
          return proxy
        }
      }
      // Proxies
      else if (key in target && key !== 'length') {
        return new pq._(target[key])
      }
      // Native functions
      else if (typeof target[key] === 'function') {
        return target[key].bind(target)
      }
      // Native properties
      return target[key]
    },
    ...pq.____
  })
  return proxy
}

pq._ = class {
  constructor(target) {
    this._ = target
    return new Proxy(target, {
      get: (target, key) => {
        // Our functions
        if (key in this) {
          return this[key]
        }
        // Native functions
        else if (typeof target[key] === 'function') {
          return target[key].bind(target)
        }
        // Native properties
        return target[key]
      },
      has: (target, key) => {
        return key in target || key in this
      },
      ...pq.____
    })
  }

  css(key, value) {
    if (key) {
      if (value) {
        this._.style[key] = value
        return this
      }
      return window.getComputedStyle(this._)[key]
    }
    return window.getComputedStyle(this._)
  }

  hide() {
    this._.hidden = true
    return this
  }

  show() {
    this._.hidden = false
    return this
  }

  toggle() {
    this._.hidden = !this._.hidden
    return this
  }

  text(text) {
    if (text) {
      this._.textContent = text
      return this
    }
    return this._.textContent
  }

  html(html) {
    if (html) {
      this._.innerHTML = html
      return this
    }
    return this._.innerHTML
  }

  is(selector) {
    return this._.matches(selector)
  }
  clone(deep) {
    return this._.cloneNode(deep)
  }

  empty() {
    this._.textContent = null
    return this
  }

  async load(resource) {
    this._.innerHTML = await pq.getText(resource)
    return this
  }

  on(event, handler) {
    this._.addEventListener(event, handler)
    return this
  }

  off(event, handler) {
    this._.removeEventListener(event, handler)
    return this
  }

  click(handler) {
    this._.addEventListener('click', handler)
    return this
  }

  val(value) {
    if (value) {
      this._.value = value
      return this
    }
    return this._.value
  }

  class() {
    return [...this._.classList]
  }

  addClass(..._class) {
    this._.classList.add(..._class)
    return this
  }

  removeClass(..._class) {
    this._.classList.remove(..._class)
    return this
  }

  toggleClass(_class, state) {
    if (_class) {
      if (state === undefined) {
        this._.classList.toggle(_class)
      } else {
        this._.classList.toggle(_class, state)
      }
    }
    return this
  }

  hasClass(_class) {
    return this._.classList.contains(_class)
  }

  replaceClass(oldClass, newClass) {
    this._.classList.replace(oldClass, newClass)
    return this
  }

  attr(key, value) {
    if (key) {
      if (value) {
        this._.setAttribute(key, value)
        return this
      }
      return this._.getAttribute(key)
    }
    return [...this._.attributes]
  }

  removeAttr(key) {
    this._.removeAttribute(key)
    return this
  }

  data(key, value) {
    if (key) {
      if (value) {
        this._.dataset[key] = value
        return this
      }
      return this._.dataset[key]
    }
    return this._.dataset
  }

  removeData(key) {
    delete this._.dataset[key]
    return this
  }

  prev() {
    return pq(this._.previousElementSibling)
  }

  next() {
    return pq(this._.nextElementSibling)
  }

  find(selector) {
    return [...this._.querySelectorAll(selector)]
  }

  siblings() {
    return [...this._.parentNode.children].filter(child => {
      return child !== this._
    })
  }
}

pq.__ = function(type, defaultOptions = {}) {
  return async function(resource, options) {
    let response
    if (options) {
      response = await fetch(resource, { ...defaultOptions, ...options })
    } else {
      response = await fetch(resource, defaultOptions)
    }
    return response[type]()
  }
}

pq.getJSON = pq.__('json', {
  headers: {
    accept: 'application/json'
  }
})
pq.getText = pq.__('text')
pq.getScript = function(resource) {
  const script = document.createElement('script')
  script.src = resource
  document.head.appendChild(script)
}

pq.___ = new pq._({})
pq.____ = {
  set(target, key, value) {
    target[key] = value
  }
}

window.pq = pq
if (!('$' in window)) {
  window.$ = pq
}
