---
layout: creation-layout.njk
title: RoughJS
description: Create graphics with a hand-drawn, sketchy, appearance.
image: /stuff/creations/roughjs/rough.jpg
imagefull: /stuff/creations/roughjs/rough-full.png
imageWidth: 735
imageHeight: 465
themebg: 'rgba(203,212,228,1)'
themefg: '#000000'
date: 2019-10-02
tags: ['creation', 'featured']
---

<div style="text-align: center; margin: -10px 0 30px;">
<a class="github-button" href="https://github.com/pshihn/rough" data-size="large" data-show-count="true" aria-label="Star rough.js on GitHub">Star</a>
<a class="github-button" href="https://github.com/pshihn/rough/fork" data-icon="octicon-repo-forked" data-size="large" aria-label="Fork rough.js on GitHub">Fork</a>
</div>
<p></p>

[Rough.js](https://roughjs.com/) is a small graphics library that lets you draw in a sketchy, hand-drawn-like, style. The library defines primitives to draw lines, curves, arcs, polygons, circles, and ellipses. It also supports drawing SVG paths.

Rough.js works with both Canvas and SVG.

### Simple Example

<figure>
  <img src="/stuff/creations/roughjs/m2.png" alt="Two circles and a line connecting them">
</figure>

```js

rc.circle(80, 120, 50); // centerX, centerY, diameter
rc.ellipse(300, 100, 150, 80); // centerX, centerY, width, height
rc.line(80, 120, 300, 100); // x1, y1, x2, y2

```

### Links

[RoughJS website](https://roughjs.com/)<br>
[View on Github](https://github.com/pshihn/rough)

<script async defer src="https://buttons.github.io/buttons.js"></script>