const pq = (rawTarget: Element | string) => {
  let target: Element[]
  if (rawTarget instanceof Element) target = [rawTarget]
  else if (typeof rawTarget === 'string')
    target = [...document.querySelectorAll(rawTarget)]
  else throw TypeError('Invalid target')

  const proxy = new Proxy(target, {
    get(target, key) {
      // Extra methods
      if (key in pq.___) {
        return (...argument) => {
          target.forEach(element => {
            new pq._(element)[key](...argument)
          })
          return proxy
        }
      }
      // Element proxy
      else if (key in target && key !== 'length') {
        return new pq._(target[key])
      }
      // Native methods
      else if (typeof target[key] === 'function') {
        return target[key].bind(target)
      }
      // Native properties
      return target[key]
    }
  })

  return proxy
}

pq._ = class {
  _: HTMLElement
  constructor(target) {
    this._ = target
    return new Proxy(target, {
      get: (target, key) => {
        // Extra methods
        if (key in this) {
          return this[key]
        }
        // Native methods
        else if (typeof target[key] === 'function') {
          return target[key].bind(target)
        }
        // Native properties
        return target[key]
      },
      has: (target, key) => {
        return key in target || key in this
      }
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

  val(): string | null
  val(value: string): this
  val(value?: string) {
    if (this._ instanceof HTMLInputElement) {
      if (value) {
        this._.value = value
        return this
      }
      return this._.value
    }
    return null
  }

  class() {
    return [...this._.classList]
  }

  addClass(...tokens: string[]) {
    this._.classList.add(...tokens)
    return this
  }

  removeClass(...tokens: string[]) {
    this._.classList.remove(...tokens)
    return this
  }

  toggleClass(token: string, force?: boolean) {
    if (token) {
      if (force === undefined) this._.classList.toggle(token)
      else this._.classList.toggle(token, force)
    }
    return this
  }

  hasClass(token: string) {
    return this._.classList.contains(token)
  }

  replaceClass(oldToken: string, newToken: string) {
    this._.classList.replace(oldToken, newToken)
    return this
  }

  attr(): Attr[]
  attr(name: string): string
  attr(name: string, value: string): this
  attr(name?: string, value?: string) {
    if (name) {
      if (value) {
        this._.setAttribute(name, value)
        return this
      }
      return this._.getAttribute(name)
    }
    return [...this._.attributes]
  }

  removeAttr(name: string) {
    this._.removeAttribute(name)
    return this
  }

  data(): DOMStringMap
  data(name: string): string
  data(name: string, value: string): this
  data(name?: string, value?: string) {
    if (name) {
      if (value) {
        this._.dataset[name] = value
        return this
      }
      return this._.dataset[name]
    }
    return this._.dataset
  }

  removeData(name: string) {
    delete this._.dataset[name]
    return this
  }

  prev() {
    return this._.previousElementSibling
      ? pq(this._.previousElementSibling)
      : null
  }

  next() {
    return this._.nextElementSibling ? pq(this._.nextElementSibling) : null
  }

  find(selectors: string) {
    return [...this._.querySelectorAll(selectors)]
  }

  siblings() {
    return this._.parentNode
      ? [...this._.parentNode.children].filter(child => child !== this._)
      : null
  }
}

type ValueOf<T> = T[keyof T]
type Type = ValueOf<{ [K in keyof Body]: Body[K] extends Function ? K : never }>

pq.__ = <T extends Type>(type: T, defaultInit: RequestInit = {}) => async (
  input: RequestInfo,
  init?: RequestInit
  // @ts-ignore
): ReturnType<Body[T]> => {
  const response = await fetch(input, { ...defaultInit, ...(init || {}) })

  return response[type]()
}

pq.getJSON = pq.__('json', {
  headers: {
    accept: 'application/json'
  }
})
pq.getText = pq.__('text')
pq.getScript = (resource: string) => {
  const script = document.createElement('script')
  script.src = resource
  document.head.appendChild(script)
}

pq.___ = new pq._({})

export default pq
