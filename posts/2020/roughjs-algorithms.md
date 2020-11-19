---
layout: post-layout.njk
title: How to emulate hand-drawn shapes / Algorithms behind RoughJS
description: A dive into graphics algorithms used in RoughJS - A graphics library that lets you draw in a sketchy, hand-drawn-like, style.
headerBackground: '#D1E0ED'
headerColor: '#000000'
titleColor: '#40586E'
headerImage: /stuff/posts/roughjs/cover.png
headerImageWidth: 480
headerImageHeight: 480
socialImage: /stuff/posts/roughjs/social.png
imageWidth: 1280
imageHeight: 669
date: 2020-04-29
tags: ['posts']
---

<style>
rough-draw {
  margin: 16px auto;
}
.interactive-caption {
  font-family: monospace;
  color: #777;
  font-size: 0.85em;
}
collapsible-panel {
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
code {
  word-break: break-word;
}
#headerImageCell img {
  box-shadow: none;
}
</style>

## Introduction

[RoughJS](https://roughjs.com/) is a small-ish (\<9kB) JavaScript graphics library that lets you draw in a *sketchy, hand-drawn-like* style. It lets you draw on `<canvas>` and with `SVG`. This blog post is to address the most common issue filed with RoughJS: **How does it work?**

<figure>
  <img alt="squares" loading="lazy" width="648" height="242" src="/stuff/posts/roughjs/rough1.png">
</figure>

## A bit of history

Charmed by images of hand-drawn graphs, diagrams, and sketches; like I true nerd, I wondered what if there were a way to draw such figures through code. Emulate hand-drawing as close as possible and yet be legible and programmable. I decided to focus on primitives - lines, polygons, ellipses, and curves, creating a full 2D graphics library. Charting/Diagramming libraries and apps could be built on top of it. 

After some quick research, I came across this paper by [Jo Wood](https://www.gicentre.net/jwo) and others, titled [Sketchy rendering for information visualization](https://openaccess.city.ac.uk/id/eprint/1274/). The techniques described here formed the basis of the library, especially for drawing lines and ellipses. 

I wrote the first version in 2017 which only worked on Canvas. Once the problem was solved, I lost interest. A year later I was working a lot with SVG, and decided to adapt RoughJS to also work with SVG. I also redesigned the API to be more basic and focus on the simple vector graphic primitives. I shared the 2.0 version of Hacker News and, surprisingly, it blew up. It was the [second most popular post of ShowHN](https://bestofshowhn.com/2018) in 2018.

People have since created some amazing things with RoughJS — [Excalidraw](https://excalidraw.com/), [Why do Cats & Dogs...](https://whydocatsanddogs.com/), [roughViz charting library](https://github.com/jwilber/roughViz), to name a few.

Now let's get to the algorithms....

<a name="roughness"></a>
## Roughness 
The fundamental concept behind emulating hand-drawn shapes is randomness. When you draw anything by hand, no two shapes will be exactly the same. Nothing is exact. So, every spatial point in RoughJS is adjusted by a random offset. The amount of randomness is described by a numeric parameter called `roughness`. 

<figure>
  <img alt="Randomness circle" loading="lazy" width="400" height="253" src="/stuff/posts/roughjs/roughness.png">
</figure>

Imagine a point `A` and a circle around it. `A` is now replaced by a random point within that circle. The area of this circle of randomness is controlled by the `roughness` value.

<a name="lines"></a>
## Lines

Hand drawn lines are never straight and often develop a *bowing* curvature (described [here](https://openaccess.city.ac.uk/id/eprint/1274/)). We randomize the two end points of the line based on the roughness. Then we also pick two other random points around the 50% and 75% marks along the line. Connecting these points by a curve gives the *bowing* effect. 

<figure>
  <img alt="Rough lines" loading="lazy" width="600" height="146" src="/stuff/posts/roughjs/line.png">
</figure>

When drawing by hand, people sometimes go quickly back and forth on the line. This could be either to highlight the line, or just as an adjustment to the straightness of the line. It looks something like this:

<figure>
  <img alt="Rough lines" loading="lazy" width="600" height="501" src="/stuff/posts/roughjs/hand-line.jpg">
</figure>

To give this extra sketchy effect, RoughJS draws the line twice to make it feel more sketchy. I do plan to make this more configurable in the future. 

<p class="interactive-caption">
Try sketching lines on this interactive canvas surface. Adjust the roughness to see the lines change:
</p>
<rough-draw></rough-draw>

When drawing by hand, longer lines tend to get less straight and more curvy. So, the randomness of the offsets to create the `bowing` effect are a function of the line's length and the `randomness` value. This, however, does not scale for really long lines. In the image below, for example, concentric squares are drawn with the same random seeds - i.e. they are essentially the same random shape, but scaled differently. 

<figure>
  <img alt="Rough squares" loading="lazy" width="400" height="400" src="/stuff/posts/roughjs/r6.jpg">
</figure>

You will notice that the edges on outer squares tend to look a bit more `rough` than the inner ones. So, a dampening factor is also added based on the length of the line. The dampening factor is applied as a step function at different lengths.

<figure>
  <img alt="Rough squares" loading="lazy" width="400" height="400" src="/stuff/posts/roughjs/r7.jpg">
</figure>

<a name="ellipses"></a>
## Ellipses (and circles)

Take a piece of paper and draw a bunch of circles as quickly as your can, in one continuous motion. Here's what it looks like when I did that:

<figure>
  <img alt="Hand drawn circles" loading="lazy" width="600" height="341" src="/stuff/posts/roughjs/circle-drawn.jpg">
</figure>

Notice that the start and end point of the loop don't actually meet unless you are very careful. RoughJS tries to achieve this while making it look more complete (adapted from the [giCenter paper](https://openaccess.city.ac.uk/id/eprint/1274/)).

The algorithm finds `n` points on an ellipse, where `n` is determined by the size of the ellipse. Each point is then randomized by  its `roughness`. A curve is then fitted through these points. To achieve the *ends not meeting effect* the second to last point does not meet the first point. Instead, it joins the second and third points.

<figure>
  <img alt="Rough Circle" loading="lazy" width="562" height="564" src="/stuff/posts/roughjs/ellipse.png">
</figure>

A second ellipse is also drawn to give it a more closed-loop, and extra sketchy effect. 

<p class="interactive-caption">
Try sketching ellipses on this interactive canvas surface. Adjust the roughness to see the shapes change:
</p>
<rough-draw mode="ellipse"></rough-draw>

As in the case with lines, some of these artefacts get more accented if the same shape is scaled to different sizes. In ellipse, this is more noticeable because the relationship is quadratic in nature. In the image below, notice the circles have the same shape, but the outer circles look more rough.

<figure>
  <img alt="Rough circles" loading="lazy" width="600" height="532" src="/stuff/posts/roughjs/r4.jpg">
</figure>

The algorithm now auto-adjusts itself based on the size of the shape by estimating more points on the circle (`n`). Following is the same set of circles generated with auto-adjust.

<figure>
  <img alt="Rough circles" loading="lazy" width="600" height="532" src="/stuff/posts/roughjs/r5.jpg">
</figure>

<a name="filling"></a>
## Filling

A common way to fill a hand-drawn shape is using *hachure* lines. As in hand-drawn sketches, lines do not stay within the outlines of the shape. They are also randomized. The density, angle, width of the lines is configurable. 

<figure>
  <img alt="Filled squares" loading="lazy" width="600" height="314" src="/stuff/posts/roughjs/r1.jpg">
</figure>

Filling squares like the example above is easy, but you get into some trouble when filling all sorts of shapes. For example, concave polygons (where angles can be more than 180°) often lead to problems like these:

<figure>
  <img alt="Concave polygon with overflow" loading="lazy" width="211" height="300" src="/stuff/posts/roughjs/r2.jpg">
</figure>

In fact the above image is from a bug report in an earlier version of RoughJS. Since then I have updated the hachure filling algorithm to an adapted version of [Scanline fill technique](https://en.wikipedia.org/wiki/Flood_fill#Scanline_fill). 

The **Scan-Line Filling Algorithm** can be used to fill any polygon. The idea is to scan the polygon using horizontal lines (scanlines). The scanlines go from the top of the polygon to the bottom. For each scanline, we determine at what points does the scanline intersect with the polygon. We arrange these intersecting points from left to right.

<figure>
  <img loading="lazy" width="600" height="337" src="/stuff/posts/roughjs/scanline.png" alt="Polygon scanline">
</figure>

As we go from one point to another, we switch from filling mode to non-filling mode; and toggle between the states as we encounter each intersection point on the scan line. There is a bit more to consider here, specifically edge cases and how to optimize the scan; more on this can be found here: [Rasterizing polygons](http://www.cs.mun.ca/av/old/teaching/cg/notes/raster_poly.pdf), or **expand the following section** for pseudocode.

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
  iSlope: number; <span class="token comment">// Inverse of the slope of the line: 1/m</span>
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
<strong>(c)</strong> Fill in pixels on scanline <em>y</em> by using pairs
of <em>x</em> coordinates from the AET.
</p>
<p style="padding-left: 32px;">
<strong>(d)</strong> Increment <em>y</em> by appropriate value defined by the hachure density, i.e. the next scanline.
</p>
<p style="padding-left: 32px;">
<strong>(e)</strong> For each non-vertical edge remaining in the AET, update <em>x</em> for the new <em>y</em> <br>(<code>edge.x = edge.x + edge.iSlope</code>)
</p>
</collapsible-panel>

<p></p>

<p class="interactive-caption">
In the following interactive, each square represents a pixel. Move the vertices to change the polygon and see what pixels would traditionally get filled in.
</p>

<draw-polygon-canvas fill></draw-polygon-canvas>

For a Hachure Fill, the scan lines are incremented in steps based on the specified hachure line density and each line is drawn using the line algorithm described above.

This algorithm, however, is designed for horizontal scan-lines. To achieve various hachure angles, the algorithm first rotates the shape itself by the desired hachure angle. Scan-lines are calculated for the rotated shape. The computed lines are then rotated back by the hachure angle in the opposite direction.

<figure>
  <img alt="Hachure fill rotated" loading="lazy" width="600" height="441" src="/stuff/posts/roughjs/r3.jpg">
</figure>

### More than hachure fills

RoughJS also supports other fill styles, but they are all derived from the same hachure algorithm. A **cross-hatch** is drawing hachure lines at an `angle` and then again with  `angle + 90°`. A **zig-zag** tries to connect one hachure line to the previous. Draw tiny circles along the hachure lines to get a **dotted** pattern.

<figure>
  <img alt="squares" loading="lazy" width="648" height="242" src="/stuff/posts/roughjs/rough1.png">
</figure>

<a name="curves"></a>
## Curves

Everything in RoughJS gets normalized to curves. Lines, Polygons, Ellipses, etc. So creating a sketchy curve is natural extension. In RoughJS you provide a set of points on the curve, and [Curve fitting](https://en.wikipedia.org/wiki/Curve_fitting) is used to translate these into a set of Cubic Bezier Curves. 

Each Bezier curve has two endpoints, and two control points. By randomizing these based on `roughness`, one can create sketchy curves in the same fashion. 

<figure>
  <img alt="Sine wave" loading="lazy" width="397" height="192" src="/stuff/posts/roughjs/sine.png">
</figure>

### Filling Curves

Filling curves, however, requires the opposite. Instead of normalizing everything to a curve, the curve is normalized to a polygon. Once you have a polygon, the scan-line algorithm can be used to fill the curved shape. 

One can sample the points on a curve at a desired rate by using the [Cubic Bezier Curve equation](https://en.wikipedia.org/wiki/B%C3%A9zier_curve#Cubic_B%C3%A9zier_curves).

<figure>
  <img alt="Bezier curve" loading="lazy" width="304" height="194" src="/stuff/posts/roughjs/bcurve1.png">
</figure>

Using a sampling rate based on the hachure density can give you enough points to fill the shape. But it's not very efficient. If the section of the curve is sharp, you'd want more points. If the section of the curve is nearly a straight line, you'd want fewer points. One technique is to figure out how *curvy/flat* the curve is. If it's too curvy, split the curve into two smaller curves. If it's flat, then just treat it as a line. 

The flatness of the curve is calculated using the method described in [this blog post](https://seant23.wordpress.com/2010/11/12/offset-bezier-curves/). The flatness value is compared to a tolerance value to decide whether to split the curve or not. 

Here's the same curve with a tolerance level of 0.7:

<figure>
  <img alt="Bezier curve" loading="lazy" width="304" height="194" src="/stuff/posts/roughjs/bcurve2.png">
</figure>

Based on the tolerance alone, this algorithm nicely provides enough points to represent a curve. It does not, however, efficiently get rid of unneeded points. A second parameter, **distance** helps with that. The technique uses the [Ramer–Douglas–Peucker algorithm](https://en.wikipedia.org/wiki/Ramer%E2%80%93Douglas%E2%80%93Peucker_algorithm) to reduce the points.

Following are the points generated with distance values of `0.15`, `0.75`, `1.5`, and `3.0`

<figure>
  <img alt="Bezier curve" loading="lazy" width="800" height="497" src="/stuff/posts/roughjs/bcurve3.png">
</figure>

Based on the *roughness* of the shape, one can set an appropriate value of distance. Once you have all the vertices of the polygon, curved shapes fill nicely:

<figure>
  <img alt="curves" loading="lazy" width="605" height="212" src="/stuff/posts/roughjs/curves.png">
</figure>

<a name="svg"></a>
## SVG Paths

SVG [Paths](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths) are very powerful and can be used to create all sorts of amazing drawings, which also makes them a bit tricky to work with. 

RoughJS parses the path and normalizes the path into only three operations: **Move**, **Line**, and **Cubic Curve**. ([path-data-parser](https://github.com/pshihn/path-data-parser)). Once normalized, the shape can be drawn using techniques described above to draw lines and curves. 

The [points-on-path](https://github.com/pshihn/points-on-path) package combines the path normalization and curve point sampling to estimate the appropriate points on the path. 

Following is rough estimation of points for the path `M240,100c50,0,0,125,50,100s0,-125,50,-150s175,50,50,100s-175,50,-300,0s0,-125,50,-100s0,125,50,150s0,-100,50,-100`

<figure>
  <img alt="curves" loading="lazy" width="443" height="273" src="/stuff/posts/roughjs/bcurve5.png">
</figure>

An SVG example I like to share often, a *sketchy* map of the United States:

<figure>
  <img alt="US Map" loading="lazy" width="600" height="313" src="/stuff/posts/roughjs/map.png">
</figure>

<p></p>

## Try RoughJS

Visit the [website](https://roughjs.com/) or the [Github repo](https://github.com/pshihn/rough) or the [API docs](https://github.com/pshihn/rough/wiki).  Follow the project on Twitter [@RoughLib](https://twitter.com/RoughLib).


<script async src="/stuff/posts/roughjs/rough-algorithms.js"></script>