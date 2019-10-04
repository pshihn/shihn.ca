---
layout: creation-layout.njk
title: Windtalk
description: The easiest way to work with iframes and multiple windows.
image: /stuff/creations/windtalk/small.jpg
imagefull: /stuff/creations/windtalk/full.png
imageWidth: 494
imageHeight: 256
themebg: 'rgba(255,255,255,1)'
themefg: '#000000'
date: 2019-09-01
tags: ['creation']
---

<figure>
  <img src="/stuff/creations/windtalk/full.png" alt="Windtalk diagram">
</figure>

[Windtalk](https://github.com/pshihn/windtalk) provides A seamless way for two <b><i>WIND</i></b>ows to <b><i>TALK</i></b> to each other. 

Windtalk exports a function or an object from within an iFrame or Window. This can now be invoked from any other window.

### Motivation

How does code in one window communicate with an iFrame or another window?

The traditional way to do this is by passing messages (See [`postMessage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)). The host window will send a message to iFrame. iFrame will receive a message, parse the message and then call some code. The iFrame will then take the result of the code and then send a message to the host window with the result. The host window will now receive the message, parse it, and then call its own code. 

In theory, this is fine. One can wrap this boilerplate message parsing to make the life easier. But when you have new code to add, you have to add another `if` clause in message parsing and then call the new code. 

Wouldn't it be nice if we could just _call the code in the other window like **any other code!**_

```javascript

objectInIframe.name = 'Bilbo Baggins';
await objectInIframe.updateProfile();
objectInIframe.resize();

```

This is possible if all the message boilerplate code is tethered behind a [proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy).

_This is where WindTalk comes in and provides you with that capability._

Let's consider a case where a parent window wants to interact with an object in an iframe.

In the iframe:
```javascript

const color = {
  red: 0,
  green: 0,
  blue: 0,
  update: function () {
    // update the ui
  }
};
windtalk.expose(color);

```
In parent window:
```javascript

const color = windtalk.link(iframe.contentWindow);
color.red = 200;
color.green = 150;
color.blue = 10;
color.update();

```

### Links

[View on Github](https://github.com/pshihn/windtalk) for more details.