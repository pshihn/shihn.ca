---
layout: post-layout.njk
title: Basic rasterization / Draw with emojis
description: Discovering basic algorithms to render linesm shapes, curves and filling them.
image: /stuff/posts/rasterization/cover.png
imagefull: /stuff/posts/rasterization/cover.png
imageWidth: 675
imageHeight: 387
themebg: 'rgba(231,231,231,1)'
themefg: '#000000'
date: 2019-12-19
tags: ['posts']
---

<style>
main {
  background: white;
}
collapsible-panel {
  max-width: 680px;
  margin: 0 auto;
  font-family: monospace;
  font-size: 14px;
  display: none;
}
collapsible-panel > * {
  padding: 0 12px;
}
#articleBody collapsible-panel p {
  margin: 0px auto 14px;
}
collapsible-panel pre {
  margin-top: -14px;
  background: rgba(255,255,255,0.85);
  padding: 16px 8px;
  box-sizing: border-box;
}
</style>
<script async src="/stuff/posts/rasterization/rasterization.js"></script>

Rasterization is the task of turning an image, described in vector graphics, into a bitmap on the screen. 

<figure>
  <img loading="lazy" width="159" height="204" src="/stuff/posts/rasterization/triangle.png" alt="Triangle rasterized">
</figure>

Algebra and Geometry give us equations to describe shapes and lines, but when these shapes are projected on an array of pixels, they are continuous functions living in a digitized space. Consider a line, which can be described by the equation <code style="white-space: nowrap;">y = ax + b</code>. For all values of `x`, there is a corresponding `y`. This is a continuous function, but when drawing on a screen, you have to work with a discrete two-dimensional array of pixels. Rasterization would involve taking the continuous line, and figuring out which specific pixels to use to draw the line.

## What does it have to do with drawing with Emojis?

Imagine if each pixel was represented using an emoji. The pixel is **on** - the emoji is showing, the pixel is **off** - the emoji is not showing. Abstracting that, one could render any vector shape using emojis. 

This abstraction provided the idea of a fun JavaScript library I wrote - [LegraJS](https://legrajs.com/) which lets you draw using Lego like bricks. The bricks could be replacd with emojis :)

## Crude and Quick

Rasterization can get really complicated in the real world, where one has to think about speed, memory, visual perception, anti-aliasing, etc. But in this blog post, I only talk about the simplest and the easiest methods.

I will discuss methods used in [LegraJS](https://legrajs.com/) to draw basic vector primitives - lines, polygons, ellipses, bézier curves, etc.

Let's first define an abstract function to draw a pixel at `(x, y)`, i.e. draw an emoji at the loaction. This function is referred in the code that follows. 

```javascript
// EMOJI_SIZE is the size of emoji in the font being used
function drawEmoji(x, y) {
  const actualX = Math.round(x) * EMOJI_SIZE;
  const actualY = Math.round(Y) * EMOJI_SIZE;
  // Draw emoji at actualX, actualX on your preferred medium
  // e.g. on canvas:
  var ctx = document.getElementById('canvas').getContext('2d');
  ctx.fillText('😀', actualX, actualY);
}
```

## Lines

In the interactive demos I have created for this post, a grid cell represents a pixel. Try moving the end points to change the line, and see which pixels are used to render the line. Turn on the the *emoji switch* to see those pixels rendered as emojis.

<draw-line-canvas></draw-line-canvas>

In algebra, a line could be represented by the equation `y = mx + c`, here `m` represents the *slope* of the line and `c` represents the value where the line meets through the *y-axis*. 

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

As we go from one point to another, we switch from *filling* mode to *non-filling* mode; and toggle between the states as we encounter each intersection point on the scan line. There is a bit more to consider here, specifically edge cases and optimization; more on this can found here: [Rasterizing polygons](http://www.cs.mun.ca/av/old/teaching/cg/notes/raster_poly.pdf), or expand the following section for pseudocode.

<collapsible-panel label="Scanline Algorithm Details">
<p>
We define two data structures (tables) to hold data about the polygon edges.
</p>
<p>
👉🏼 First, a global Edge Table (ET) of all the edges sorted by the <code>Y<sub>min</sub></code> value. If the edges have the same <code>Y<sub>min</sub></code> values, then they are sorted by their <code>X<sub>min</sub></code> coordinate value. 
</p>
<p>
👉🏼 Second, an Active Edge Table (AET) where we keep only the edges that intersect with the current scanline.
</p>

Following describes the data structure in each row of the tables:

<pre>interface EdgeTableEntry {
  ymin: number;
  ymax: number;
  x: number; <span class="token comment">// Initialized to Xmin</span>
  iSlope: number; <span class="token comment">// Inverse of the slope of yje line: 1/m</span>
}

interface ActiveEdgeTableEntry {
  scanlineY: number; <span class="token comment">// The y value of the scanline</span>
  edge: EdgeTableEntry;
}
</pre>

<p>After initializing the Edge Table, we perform the following:</p>

<p>
<strong>1.</strong> Set <em>y</em> to the smallest <em>y</em> in the ET. This represents the current scanline.
</p>
<p>
<strong>2.</strong> Initialize the AET to be an empty table.
</p>
<p>
<strong>3.</strong> Repeat the following until both AET and ET are empty:
</p>
<p style="padding-left: 32px;">
<strong>(a)</strong> Move from ET bucket <em>y</em> to the AET edges whose <em>y<sub>min</sub> ≤ y</em>.
</p>
<p style="padding-left: 32px;">
<strong>(b)</strong> Remove from AET entries where <em>y = y<sub>max</sub></em>, then sort the AET on <em>x</em>.
</p>
<p style="padding-left: 32px;">
<strong>(c)</strong> Fill in desired pixel values (draw an emoji) on scanline <em>y</em> by using pairs
of <em>x</em> coordinates from the AET.
</p>
<p style="padding-left: 32px;">
<strong>(d)</strong> Increement <em>y</em> by 1, i.e. the next scanline.
</p>
<p style="padding-left: 32px;">
<strong>(e)</strong> For each non-vertical edge remaining in the AET, update <em>x</em> for the new <em>y</em> <br>(<code>edge.x = edge.x + edge.iSlope</code>)
</p>
</collapsible-panel>

<draw-polygon-canvas fill></draw-polygon-canvas>


## Ellipses (and Circles)

Let's first define a couple of key properties of an ellipse: 

<figure>
  <img loading="lazy" width="353" height="173" src="/stuff/posts/rasterization/ellipse.png" alt="Polygon scanline">
</figure>

* **semi-major axis** `a` is half of the length of the major axis that runs through the center of the ellipse, it's focus point, and ends at the perimeter of the ellipse.
* **semi-minor axis** `b` is the line orthogonal to the semi-major axis, with one end at the center and the other end at the perimeter.

When `a = b`, the ellipse is a circle. 

The most common algorithm to rasterize a circle is the [Midpoint circle algorithm](https://en.wikipedia.org/wiki/Midpoint_circle_algorithm). This was adapted by [Bresenham](http://members.chello.at/~easyfilter/bresenham.html) and generalized for ellipses. I have been using [McIlroy's algorithm](https://www.cs.dartmouth.edu/~doug/155.pdf), which build's on Bresenham's work.

<draw-ellipse-canvas></draw-ellipse-canvas>

The links to the algorithms describe them in more detail. Fllowing is the quick javascript implemenetation:

```javascript
// xc, xy is the center of the ellipse
// a, b are the lengths of the semi-major and semi-minor axes
function drawEllipse(xc, yc, a, b) {
  let x = 0;
  let y = b;
  const a2 = a * a;
  const b2 = b * b;
  const crit1 = -(a2 / 4 + a % 2 + b2);
  const crit2 = -(b2 / 4 + b % 2 + a2);
  const crit3 = -(b2 / 4 + b % 2);
  let t = -a2 * y;
  let dxt = 2 * b2 * x;
  let dyt = -2 * a2 * y;
  const d2xt = 2 * b2;
  const d2yt = 2 * a2;

  const incx = () => {
    x++;
    dxt += d2xt;
    t += dxt;
  };

  const incy = () => {
    y--;
    dyt += d2yt;
    t += dyt;
  };

  while (y >= 0 && x <= a) {
    drawEmoji(xc + x, yc + y);
    if (x !== 0 || y !== 0) {
      drawEmoji(xc - x, yc - y);
    }
    if (x !== 0 && y !== 0) {
      drawEmoji(xc + x, yc - y);
      drawEmoji(xc - x, yc + y);
    }
    if ((t + b2 * x <= crit1) || (t + a2 * y <= crit3)) {
      incx();
    } else if (t - a2 * y > crit2) {
      incy();
    } else {
      incx();
      incy();
    }
  }
}
```

## Filling an Ellipse

The scanline algorithm used for filling polygons can be adopted to work with Bresenham's Ellipse algorithm described above.
Unlike a polygon, an ellipse is symmetrical, so what happens in onw quadrant of the ellipse could be reflected to the other three quadrants. 
I have adopted the implementation described here: [Drawing Ellipses Using Filled Rectangles](http://enchantia.com/graphapp/doc/tech/ellipses.html)

<draw-ellipse-canvas fill></draw-ellipse-canvas>

## Bézier curve

Bézier curves are used to model smooth curves in vector graphics. Often complex paths cane be constructed using a series of bézier curves. (*Aside:* These curves are also used in defining easing functions in UI animations, or in easing robotic movements)

A bézier curve is defined using four parameterized points. Two end points of the curve, and two control points. Try moving these points to see what pixels get rendered:

<draw-bezier-canvas></draw-bezier-canvas>

For bézier curves, I often end up using [bezier.js](https://pomax.github.io/bezierjs/) which is really amazing. The two main methods I use for rasterization is `length()` which computes the length of the curve; and `getLUT(n)` which extrapolates `n` points on the curve. When using the length of the curve as `n`, one can estimate enough points on the curve to rasterize them. To get higher resolution for sharper curves, the value of `n` can be doubled. 

```javascript
// Bexier curve from point a to b, with p1 and p2 as the control points
function bezierCurve(a, p1, p2, b) {
  const bezier = new Bezier(a, p1, p2, b);
  const luts = bezier.getLUT(bezier.length() * 2);
  luts.push(b);
  this.drawEmojis(luts); // luts is an array of x,y coordinates
}
```

## Quadratic curve

A quadratic curve is essentially a bézier curve with only one control point (or you could imagine a bézier curve where both the control points are the same). 

<draw-quad-canvas></draw-quad-canvas>

Fortunately, `bezier.js` supports this as well

```javascript
// Quadratic curve from point a to b, with p1 as the control points
function bezierCurve(a, p1, b) {
  const bezier = new Bezier(a, p1, b);
  const luts = bezier.getLUT(bezier.length() * 2);
  luts.push(b);
  this.drawEmojis(luts); // luts is an array of x,y coordinates
}
```

## Epilogue

This post is, essentially, me aggregating some notes and thoughts I compiled when writing [Legra](https://legrajs.com/). Note that I did not actually compile together a final library that does draw everything using emojis, though all the interactive demos in this post do have an **emoji mode** switch on top. I'm hoping there are enough tools in this post to let one create such a library. 

The interactive demos here are inspired from Amit Patel's [Red Blob Games](https://www.redblobgames.com/) blog. 

Ciao!