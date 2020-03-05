# pq - DOM with sugar

[![npm](https://img.shields.io/npm/v/@kidonng/pq)](https://npm.im/@kidonng/pq)
[![MIT License](https://img.shields.io/github/license/kidonng/pq)](LICENSE)

**This is a experimental project. Use at your own risk.**

pq is a `Proxy`-based alternative to jQuery. It makes use of modern JavaScript feature and DOM API to retain simplicity and usability.

## Example

Also checkout the [Live demo](https://e4ni1.csb.app/).

```html
<p>Apple</p>
<p class="quadcolor-logo">Microsoft</p>
<p class="quadcolor-logo">Google</p>
<p>Facebook</p>

<script type="module">
  import $ from 'https://cdn.jsdelivr.net/npm/@kidonng/pq/pq.min.js'

  const p = $('p') // [p, p, p, p]
  // Native JavaScript methods are accessible
  p.filter((element) => {
    // And native properties, of course
    if (element.classList.has('quadcolor-logo')) {
      return element
    }
  }) // [p, p]

  $('.quadcolor-logo').removeClass('quadcolor-logo').addClass('tech-company') // jQuery vibe!
  $('.tech-company').length === 2 // true
  // Elements on steroids!
  $('.tech-company')[0].next().text() === 'Google' // true
</script>
```

## Motivation

Native DOM methods are good, but they are not good enough. What if we combine native methods and jQuery methods all together?

pq wraps a `Proxy` around elements and arrays, enabling you to access both native methods/properties and jQuery-like methods provided by pq, and original elements and arrays remain untouched.

## API

pq's API is mostly compatible with jQuery, though only a few are implemented for the moment.

<sup>\*</sup>Extra methods provided by pq

- `html`, `css`, `text`, `val`
- `hide`, `show`, `toggle`
- `clone`, `empty`
- `is`, `prev`, `next`, `find`, `siblings`
- `addClass`, `removeClass`, `toggleClass`, `hasClass`, `replaceClass`<sup>\*</sup>, `class` <sup>\*</sup>
- `attr`, `removeAttr`
- `data`, `removeData`
- `on`, `off`, `click`
- `load`, `pq.getJSON`, `pq.getScript`, `pq.getText`<sup>\*</sup>
