---
layout: creation-layout.njk
title: Brickception
description: Breakout game with popup windows!
image: /stuff/creations/brickception/logo.jpg
imagefull: /stuff/creations/brickception/logo.jpg
themebg: 'rgba(6,17,40,1)'
themefg: '#ffffff'
date: 2019-10-03
tags: ['creation']
---

<style>
video {
   display: block;
   max-width: 320px;
   margin: 0 auto;
}
</style>

A fun take on the classic bricks breakout game with popup windows! Two popup windows are launched - the main game window and the paddle window. Paddle window has a nested game! You need to win in both the windows. Moving the paddle window moves the paddle. The ball of the main window bounces off the top of the paddle window.

<figure>
   <video autoplay="" muted="" playsinline="" loop="" src="/stuff/creations/brickception/clip1.mp4"></video>
</figure>

[Play it here](https://brickception.xyz/)

Original C++ (Siv3D) concept by [Ryo Suzuki](https://twitter.com/Reputeless)