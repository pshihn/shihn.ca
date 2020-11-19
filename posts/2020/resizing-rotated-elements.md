---
layout: post-layout.njk
title: 'Resizing Rotated Elements'
description: Visual editors usually allow resizing and rotation of elements. Applying both transforms can be a little tricky. This post explores an algorithm to implement this feature.
headerBackground: '#e6e3df'
headerColor: '#000000'
titleColor: '#665744'
headerImage: /stuff/posts/resizing-rotated-elements/rot2.png
headerImageWidth: 607
headerImageHeight: 412
socialImage: /stuff/posts/resizing-rotated-elements/social.png
imageWidth: 1280
imageHeight: 669
date: 2020-07-06
tags: ['posts']
---

<style>
resize-canvas {
  touch-action: none;
  user-select: none;
}
#headerImageCell img {
  box-shadow: none;
}
</style>

<script async src="/stuff/posts/resizing-rotated-elements/resize-canvas.js"></script>

## Introduction

If you have ever used a visual editor — a WYSIWYG designer or a Graphics editor, you'd expect to be able to resize and rotate the selected shape or element. These are common operations, and yet when applied together can cause a bit of an itchy head. 

## The Problem

Let's take the most common use case - a rectangle (*Elements on a web page have a bounding rectangle, and vectors in graphics have a rectangular bounding box*). We usually represent the rectangle with four numbers - the `x, y` coordinates of the top-left corner of the rectangle, and the `width, height` of the rectangle. 

For resizing this rectangle, common practice is to add four draggable handles at the corners of the rectangle. You can also add four additional handles in the middle of each side to resize in only one direction. **For simplicity, I'm going to just add one handle** - handle to move the bottom right corner of the rectangle.

To resize, one calculates how much `x` and `y` units the user has dragged the handle. Let's call the change in the values to be `𝝙x` and `𝝙y`. The new width and height of the rectangle would be `width + 𝝙x` and `height + 𝝙y` respectively. 

Try dragging the bottom right handle in the rectangle below to see it resize.

<resize-canvas broken></resize-canvas>

In the interactive example above, there'a top handle which can be used to rotate the rectangle. **Try rotating the rectangle above and then resize it.** What do you see?

You will notice a couple of issues:
1) When you resize the rectangle, the shape tends to move. i.e. you are dragging the bottom-right corner, but somehow the top-left corner is also moving. 
2) The second one may be a bit more subtle to notice. The distance you drag horizontally or vertically does not quite match with the change in size you perceive in the rotated shape.

## What's Happening?

The rectangle is rotated about its center. In the diagram below `A'` is the new location of the top-left corner `A`. 

<figure>
  <img alt="How a rectangle is rotated" loading="lazy" width="491" height="351" src="/stuff/posts/resizing-rotated-elements/rot1.png">
</figure>

When you increase the width by `𝝙x` and height by `𝝙x` you end up moving the center of the shape. Even though you have not changed the coordinates of `A`, the coordinates of `A'` will be different. 

<figure>
  <img alt="Rotated rectangle with different size moved the center" loading="lazy" width="607" height="412" src="/stuff/posts/resizing-rotated-elements/rot2.png">
</figure>

This accounts for the first issue. The second issue is that we are changing the `width` and `height` based on the `x` and `y` changes of the bottom-right corner. That would be totally fine when the shape has not been rotated. But for rotated shapes, one needs to calculate the width and height changes based on the angle of rotation. The diagram below represents these changes as `𝝙x'` and `𝝙y'`.

<figure>
  <img alt="Estimating size change on a rotated rectangle" loading="lazy" width="466" height="395" src="/stuff/posts/resizing-rotated-elements/rot3.png">
</figure>


## The Solution - Do not move A'

Let's address the first issue. As we move the bottom-right corner we want to ensure that the top-left corner does not change. Which means, **when we resize a rotated rectangle, we should also update its position**. 

Let's calculate the coordinates for `A'`. We can use a [rotation matrix](https://en.wikipedia.org/wiki/Rotation_matrix) to do that. We also have to consider that the rotation does not happen around the origin of the canvas, but around the center of the rectangle. 

First let's establish the center of the rectangle `cx, cy`:
```javascript
// For a rectangle with top-left at x, y
const cx = rectangle.x + rectangle.width / 2;
const cy = rectangle.y + rectangle.height / 2;
```

Now applying the combined matrix, we can create a `rotate` function that returns the coordinates after rotation:
```javascript
function rotate(x, y, cx, cy, angle) {
  return [
    (x - cx) * Math.cos(angle) - (y - cy) * Math.sin(angle) + cx,
    (x - cx) * Math.sin(angle) + (y - cy) * Math.cos(angle) + cy,
  ];
}
const rotatedA = rotate(rectangle.x, rectangle.y, cx, cy); // calculate A'
```

As we were dragging the bottom-right corner of the rectangle, we knew what the value of `C'` (`rotatedC` in the code) should be. Since we want `A'` to remain the same, we can now calculate the new center by finding the midpoint between `A'` and `C'`. 

```javascript
const newCenter = [
  (rotatedA[0] + rotatedC[0]) / 2,
  (rotatedA[1] + rotatedC[1]) / 2,
];
```

Now to calculate the new top-left  coordinates for the rectangle, we simply rotate `A'` around the new center by the reverse angle `-angle`.

```javascript
const newA = rotate(rotatedA[0], rotatedA[1], newCenter[0], newCenter[1], -angle);
```

Setting the `x, y` of the rectangle to `newA` will ensure that the rotated rectangle does not visually shift when resized.

## Adjusted Width And Height

Now let's deal with the second issue - we need a projection of what the width and height should be when there is no rotation. The answer is to build on top of the first solution.

We can calculate the unrotated coordinates of the bottom-right corner `C` by rotating the new coordinates of `C'` around the new center by the reverse angle.

```javascript
const newC = rotate(rotatedC[0], rotatedC[1], newCenter[0], newCenter[1], -angle);
```

The width and height of the rectangle can be calculated by measuring the difference in `x` and `y` values of `newC` and `newA`. 

```javascript
const newWidth = newC[0] - newA[0];
const newHeight = newC[1] - newA[1];
```

## Putting it all together

Here's the solution implemented for you to play with:

<resize-canvas></resize-canvas>

The code put together:

```javascript
function adjustRectangle(rectangle, bottomRightX, bottomRightY, angle) {
  const center = [
    rectangle.x + rectangle.width / 2,
    rectangle.y + rectangle.height / 2
  ];
  const rotatedA = rotate(rectangle.x, rectangle.y, cx, cy);
  const newCenter = [
    (rotatedA[0] + bottomRightX) / 2,
    (rotatedA[1] + bottomRightY) / 2,
  ];
  const newTopLeft = rotate(
    rotatedA[0],
    rotatedA[1],
    newCenter[0],
    newCenter[1],
    -angle
  );
  const newBottomRight = rotate(
    bottomRightX,
    bottomRightY,
    newCenter[0],
    newCenter[1],
    -angle
  );

  rectangle.x = newTopLeft[0];
  rectangle.y = newTopLeft[1];
  rectangle.width = newBottomRight[0] - newTopLeft[0];
  rectangle.height = newBottomRight[1] - newTopLeft[1];
}
```