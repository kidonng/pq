# pq

**This is a experimental project. Use at your own risk.**

pq is a `Proxy`-based JavaScript library with jQuery-like API. It makes use of modern syntax and API to retain simplicity and usability.

## DOM with sugar

Native DOM methods are good, but they are not good enough. Why not have the best of two worlds: native methods and jQuery functions, without being trapped in `$.each` and so on?

pq acts as a wrapper for existing objects, arrays remain arrays, and elements remain elements. Extra methods are added via `Proxy`, not modifying prototype.

```html
<p id="fruit">Apple</p>
<p class="quadcolor-logo">Microsoft</p>
<p class="quadcolor-logo">Google</p>
<p>Facebook</p>
<p data-type="octocat">GitHub</p>

<script>
$('p') // [p, p, p, p, p]
$('p').filter(function(element) { // You can use native JavaScript method!
  if (element.classList.has('quadcolor-logo')) { // And native properties, of course
    return element
  }
}) // [p, p]
$('.quadcolor-logo').removeClass('quadcolor-logo').addClass('tech-company') // Extra methods provided by pq, chainable!⛓️
$('.tech-company').length === 2 // true
// The same applies to elements.
$('.tech-company')[0].next().text() === 'Google' // true
</script>
```

## API

pq's API is mostly compatible with jQuery, though only a few of jQuery's functions are implemented for the moment.

pq binds itself to `window.pq` and `window.$` (if `$` is not defined).

<sup>*</sup> new in pq

- `css`, `hide`, `show`, `toggle`
- `html`, `text`, `val`
- `clone`, `empty`
- `is`, `prev`, `next`, `find`, `siblings`
- `addClass`, `removeClass`, `toggleClass`, `hasClass`, `replaceClass`<isup>*</isup>, `class`<sup>*</sup>
- `attr`, `removeAttr`
- `data`, `removeData`
- `on`, `off`, `click`
- `load`, `pq.getJSON`, `pq.getScript`, `pq.getText`<sup>*</sup>
