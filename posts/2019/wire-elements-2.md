---
layout: post-layout.njk
title: Wired-Elements 2.0
description: What's new in 2.0 release of wired-elements - Common UI Elements with a sketchy hand-drawn look.
image: /stuff/posts/wire-elements-2/welogo.jpg
imagefull: /stuff/posts/wire-elements-2/welogo.png
imageWidth: 400
imageHeight: 400
themebg: 'rgba(243,229,245,1)'
themefg: '#000000'
date: 2019-10-24
tags: ['posts']
---

<style>
.popReactionPanel {
   display: none;   
}
</style>

I'm happy to announce the 2.0 release of [wired-elements](https://wiredjs.com/). It started of, and still is, a fun project to work on. In this era of really slick and buttery smooth design systems, a brutal and rough beacon of light 😉

In this release, the underlying base code for all components was refactored to create smaller and more efficient components. By more efficient, I mean fewer re-renders of the sketchy shapes. This was done mainly by not re-rendering shapes if the dimensions do not change, and also by utilizing the [Resize Observer](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) where it's available.

View all components in action in the [wired-elements showcase](https://wiredjs.com/showcase.html).

New components in 2.0 👇

## wired-calendar

This is the first fully community contributed component. [Eduardo Martinez](https://github.com/elingerojo) created this. The calendar is customizable in many ways, for details check out the [wired-calendar readme](https://github.com/wiredjs/wired-elements/tree/master/packages/wired-calendar).

<figure>
  <img loading="lazy" src="/stuff/posts/wire-elements-2/calendar.jpg" alt="wired-calendar example">
</figure>

## wired-video

A simple video player that shows a sketchy progress and hand-drawn controls for play/pause and volume. 

<figure>
  <video autoplay muted playsinline webkit-playsinline loop preload src="/stuff/posts/wire-elements-2/video.mp4" alt="wired-video example"></video>
</figure>

## wired-image

An image component akin the the `<img>` tag, but it frames the image in a hand-drawn box. The elevation of the box is configurable.

<figure>
  <img loading="lazy" src="/stuff/posts/wire-elements-2/image.jpg" alt="wired-calendar example">
</figure>

## wired-dialog 

A modal dialog implementation. This contents of the dialog look like paper cutouts around a hand drawn box.

<figure>
  <video autoplay muted playsinline webkit-playsinline loop preload src="/stuff/posts/wire-elements-2/dialogs.mp4" alt="wired-dialog example"></video>
</figure>

## wired-divider

A hand-drawn horizontal line that can be used to divide two sections.

## wired-link

Akin to `<a>` tag, a link with href, and a sketchy underline.

## wired-search

A search input control

<figure>
  <video autoplay muted playsinline webkit-playsinline loop preload src="/stuff/posts/wire-elements-2/search.mp4" alt="wired-search example"></video>
</figure>

## MORE

Try wired-elements out on [Glitch playground](https://glitch.com/edit/#!/wired-elements-vanilla).

Checkout [wiredjs.com](https://wiredjs.com/) for more.