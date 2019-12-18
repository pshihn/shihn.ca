---
layout: post-layout.njk
title: Basic rasterization / Draw with emojis
description: What's new in 2.0 release of wired-elements - Common UI Elements with a sketchy hand-drawn look.
image: /stuff/posts/wire-elements-2/welogo.jpg
imagefull: /stuff/posts/wire-elements-2/welogo.png
imageWidth: 400
imageHeight: 400
themebg: 'rgba(243,229,245,1)'
themefg: '#000000'
date: 2019-12-04
tags: ['posts']
---

<style>
main {
  background: white;
}
</style>
<script async src="/stuff/posts/rasterization/rasterization.js"></script>

Rasterization is the task of turning an image, described in vector graphics, into a bitmap on the screen. 

<figure>
  <img loading="lazy" width="159" height="204" src="/stuff/posts/rasterization/triangle.png" alt="Triangle rasterized">
</figure>

Algebra and Geometry gives us equations to describe shapes and lines, but when these shapes are projected on an array of pixels, they are continuous functions living in a digitized space. Consider a line, which can be described by the equation `y = ax + b`. For all values of `x`, there is a corresponding `y`. This is a continuous function, but when drawing on a screen, you have to work with a discrete two-dimensional array of pixels. Rasterization would involve taking the continuious line, and figuring out which specific pixels to use to draw the line.

## What does it have to do with drawing with Emojis?

Imagine if each pixel was represented using an emoji. The pixel is **on** - the emoji is showing, the pixel is **off** - the emoji is not showing. Abstracting that, one could render any vector shape using emojis. 

This abstraction provided the idea of a fun JavaScript library I wrote - [LegraJS](https://legrajs.com/) which lets you draw using Lego like bricks. The bricks could be replacd with emojis :)

## Crude and Quick

Rasterization can get really complicated in the real world, where one has to think about speed, memory, visual perception, anti-aliasing, etc. But in this blog post, I only talk about the simplest and the easiest methods.

I will discuss methods used in [LegraJS](https://legrajs.com/) to draw basic vector primitives - lines, polygons, ellipses, Bézier curves, etc.

Let's first define an abstract function to draw a pixel at `(x, y)`, i.e. draw an emoji at the loaction. This function is refrred in the code that follows. Here we round the values of `x, y` to the nearest integer

```javascript
function drawEmoji(x, y) {
  const actualX = Math.round(x);
  const actualY = Math.round(Y);
  // Draw emoji at actualX, actualX on your preferred medium
}
```

## Lines

In the demos below, a grid cell represents a pixel. Try moving the end points to change the line, and see which pixels are used to render the line. 

<draw-line-canvas></draw-line-canvas>

In algebra, a line could be represented by the equation `y = ax + b`, here `a` represents the *slope* of the line and `b` represents the value where the line meets through the *y-axis*. 

In graphics and animation, a common function, _**lerp**_ (Linear Interpolation) is used to return a number between two other numbers. _**lerp**_ is based on the above equation that repesents a line. 

```javascript
// Here t is between 0.0 and 1.0
function lerp(start, end, t) {
    return start + t * (end - start);
}
```

This function can be extended to 2-dimensions to represent points `(x,y)` for different values of `t`. But, what values of `t` should we use? If we divide the line into `N` sections, we use `t = 1/N`. 

Now, what is the appropriate value of N?

We know the two endpoints of the line, we can tell if the change in `y` is more than change in `x` or vice-versa. The number `N` is the larger of the two changes. `N = Max(|y2 - y1|, |x2 - x1|)` or in javascript `const N = Math.max(Math.abs(y2,y1), Math.abs(x2, x1))`.

Here's the final function:

```javascript
// Draw a line from (x1, y1) to (x2, y2)

function drawLine(x1, y1, x2, y2) {
  const dy = y2 - y1;
  const dx = x2 - x1;
  const n = Math.max(Math.abs(dx), Math.abs(dy));
  const ninv = n === 0 ? 0 : 1 / n;
  const xStep = dx * ninv;
  const yStep = dy * ninv;
  let x = x1;
  let y = y1;

  drawEmoji(x, y);
  for (let step = 0; step < n; step++) {
    x += xStep;
    y += yStep;
    drawEmoji(x, y);
  }
}
```

## Polygons

Now that we have tackled lines, drawing polygons is easy. A polygon is essentially connecting adjoining vertices with a line.

<draw-polygon-canvas></draw-polygon-canvas>

## Filling a Polygon

One of the simplest ways to fill a polygon is by using the *Scan-Line Filling Algorithm*. The idea is to scan the shape using horizontal lines (scanlines).
The scanlines go from top of the polygon to the bottom. For each scanline, we determine at what points does the scanline intersect with the polygon. We arrange these intersecting points from left to right.

<figure>
  <img loading="lazy" width="445" height="255" src="/stuff/posts/rasterization/scanline.png" alt="Polygon scanline">
</figure>

As we go from one point to another, we switch from *filling* mode to *non-filling* mode; and toggle between the states as we encounter each intersection point on the scan line.

<draw-polygon-canvas fill></draw-polygon-canvas>

More on this can found here: [Rasterizing polygons](http://www.cs.mun.ca/av/old/teaching/cg/notes/raster_poly.pdf)

## Ellipses (and Circles)