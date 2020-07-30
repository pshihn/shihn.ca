---
layout: post-layout.njk
title: 'Autoplaying back-to-back videos on the web using a Media Pool'
description: 'When autoplaying a queue of videos, a media-pool can be used to overcome browser restrictions'
image: /stuff/posts/media-pool/theme.jpg
imagefull: /stuff/posts/media-pool/social.png
imageWidth: 1280
imageHeight: 669
themebg: 'rgba(21,53,73,1)'
themefg: '#ffffff'
date: 2020-07-30
tags: ['posts']
---

<style>
#articleBody img {
  display: block;
  box-sizing: border-box;
  max-width: 100%;
  height: auto;
}
#articleBody figure img {
  margin: 16px auto;
}
</style>

No one likes it when you go to a web page and it automatically starts playing a video loudly. Browsers have changed their auto-play policies to let JavaScript auto-play a video only if it's inline and muted. (See posts for [Safari](https://webkit.org/blog/6784/new-video-policies-for-ios/) and [Chrome](https://developers.google.com/web/updates/2017/09/autoplay-policy-changes)).

<figure>
  <img alt="Meme saying: One does not simply autoplay videos, and I will find you and I will pause you" loading="lazy" width="700" height="349" src="/stuff/posts/media-pool/meme.jpg">
</figure>

## Problem: Playing a video queue

I think this policy change was a good one. But there are cases where it may restrict your application. Say, you have created a queue of videos (or audios). You'd want the next one to play as soon as the first one finishes. Instagram/Snapchat like stories is a good example for this. 

Normally one would implement this by listening to your video's progress and as soon as it ends, call `play` on the next video. But, if the video is not muted, it will not play according to the browser's media policy. 

Videos can be played with the volume on, if they were triggered by a user action. But, when playing one video after another, asking the user to tap to play again doesn't feel like a great user experience.

## Reusing the media element

Once a media element (`<video>` or `<audio>`) has been triggered by a user action, it gets **cleared** by the browser for future use. i.e. Later on, some script can play the video unmuted once a user action has cleared the video.

With that in mind, the very basic solution is to create a single media element, and re-use it for every video. This, however, may not be a great user experience. Loading the next video may take time, so transitioning from one video to another will not be a smooth one. 

## Media Pool

In an ideal world where resources and browser limitations do not exist, one could load every video in memory. But it's not good practice, and some browsers (like iOS Safari) limit the number of media elements in memory. 

So we create a **Media Pool**. This is similar to *thread pools* in multi-threaded languages where you allocate a thread to a task and when the task is done, the thread is released to be used by another task. 

Applying this model to media elements, we can keep, say 2-3 videos, in memory for a smooth experience, and release them back to the pool when they are done playing. As new videos get queued up to play, they request a media element from the pool. The pool will provide an unused or a recycled media element. 

In the following diagram, we have a pool of seven media elements <span style="color: #e64980;transform: scale(1.5);display: inline-block;">♦</span>. We keep the last video in memory, and preload the next one. So there are only 3 allocated media elements at a time. As the videos leave this three-video-window, the media element is released back into the pool.

<figure>
  <img alt="Diagram showing 3 allocated media elements in a media pool" loading="lazy" width="800" height="383" src="/stuff/posts/media-pool/pool1.png">
</figure>

When video3 finishes, video4 starts playing. video2 is outside the window so it releases the media element back into the queue. video5 gets a new element allocated from the queue.

<figure>
  <img alt="Diagram showing 3 allocated media elements in a media pool" loading="lazy" width="800" height="384" src="/stuff/posts/media-pool/pool2.png">
</figure>


## Blessing the Media

A media pool sounds like a great way to reuse video elements but it does not solve the original problem - playing unmuted videos automatically. I discovered that Google's AMP project had the [same problem](https://github.com/ampproject/amphtml/blob/master/extensions/amp-story/1.0/media-pool.md) as this, and they use a term called _**blessing**_ a video element. 

When the user takes their first action to unmute a video or to start an unmuted video; in the same event handler, the media-pool will *unmute* all the videos in the pool (allocated, unallocated, and released ones). It will then mute the ones that are not active right away. By doing this, all videos have been **cleared** by the browser. If we use AMP's terminology, these videos have now been _**blessed**_.

<figure>
  <img alt="How to bless a video" loading="lazy" width="800" height="233" src="/stuff/posts/media-pool/pool3.png">
</figure>

As one video finishes, the script can now call `play` on a blessed video element to start playing it even when it's unmuted. 

There are a couple of things to keep in mind when implementing a *blessing* based media pool. Firstly, one cannot invoke operations like `mute`, `unmute`, `play` on a media element if it doesn't have any media loaded. That's why the unallocated media-elements should be loaded with an empty video file. Secondly, in some browsers operations of media elements can be interrupted when invoked in a certain way, for example calling `load` after calling `play` can reject the `play` promise. The AMP project creates a queue of operations per media element. I decided to do the same in my projects. 

## Media Pool implementation

I have created a [media-pool implementation](https://github.com/pshihn/media-pool) that you can use if you like, or feel free to look at the code to create a new one. AMP's version of media pool is [available here](https://github.com/ampproject/amphtml/blob/master/extensions/amp-story/1.0/media-pool.js) but it may be a bit AMP specific. 

I have optimized my [media-pool implementation](https://github.com/pshihn/media-pool) for my use case where it also lazy-releases a media-element; which means if the video is active again it can reuse its old media-element even though it was released. This prevents re-attaching to DOM and re-loading videos. In the case where the released media-element has been allocated to some other video player, the video player will get a new one from the pool. 