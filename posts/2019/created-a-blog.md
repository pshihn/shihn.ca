---
layout: post-layout.njk
title: I created a blog and decided to keep it
description: An intro to the blog - Its purpose and how I designed it.
image: /stuff/posts/created-a-blog/preet-small.jpg
imagefull: /stuff/posts/created-a-blog/preet.jpg
themebg: 'rgba(84,127,145,1)'
themefg: '#ffffff'
date: 2019-10-04
tags: ['posts']
---

I was playing with [Eleventy](https://www.11ty.io/) last weekend for a project ‒ did the *Hello World* equivalent, and created a blog. 
I jokingly [tweeted](https://twitter.com/preetster/status/1178425744038354944) about having to find something to write about, now that I have a blog. I say *jokingly*, because writing about anything has always given me a bit of anxiety, and I'd never actually start a blog.

Then I thought *why not?* Perhaps forcing myself to write every week or two will make me become a better writer. I have always admired people who are good at expressing themselves via written word.

I was suggested on Twitter: *"You could do the ole dev thing of writing about building the blog and then never again until the next time you rebuild the blog."* by [Matthew Phillips](https://twitter.com/matthewcp). So here I am, doing just that. 

I will not go into the technical details behind setting up a blog, because quite honestly, Eleventy was super easy and their tutorials do a great job. I will talk about the fluff instead. 

## Designing my blog

Ready to create a blog for realz, the first thought that came to me was aesthetics. I had decided that I did not want to spend days designing this thing, and yet I did not want to use a generic blog template. So, I gave myself half a day to come up with a quick design and another half to actually implement it. 

I decided early on that the site will be divided into two main sections - the blog bit, and the bit where I talk about my silly side projects. Now they are under [Writings](/posts/) and [Creations](/creations/). Rest of the design was quickly put together based on the first interesting thought that came in my head, without actually creating a cohesive design narrative. 

## Background + Colors

I was talking to someone a couple of days ago how websites rarely use textured backgrounds anymore. Right away, I decided my blog will not be flat and will have some sort of textured background, with cards (or equivalent) on top. My go to place for this is usually [Subtle Patterns](https://www.toptal.com/designers/subtlepatterns/), but I remebered I had this texture (I don't recall the source) from an abandoned side project from years ago. I just decided to use it to avoid spending hours trying different patterns.

![Gray tectured background](/stuff/wash.jpg)

The big downside of this texture was that it's **very gray!** The actual blog content should be on a light solid background (*white*) and then I picked two accent colors - *<span style="color: #144DDB;">blue</span>* and *<span style="color: #D81B60;">pink</span>*.

## Cards - Blog Post

Having a gray textured background, I decided to use *cards* to show blog entries in a list. My initial design was quite clean, but being in a Whimsical mood, I decided to add a splash of color to it. 

I had a Java program from a while ago that parsed images to extract colors from it. I decided to use it to create a theme for each post. Since the theming is image based, the downside is that every blog post would need an image to go with it. Not sure if that's a smart choice, but I'm going with it for now. Here's how it works: 

<figure>
  <img src="/stuff/posts/created-a-blog/imageproc.png" alt="Image processing to extract theme">
</figure>

When I get a color to use with each post, I use the [brightness](https://www.w3.org/TR/WCAG20/#relativeluminancedef) of the color to determine if the text on it should be black or white. 

These colors are now set as CSS properties on each card `--card-bg` and `--card-fg`. The `--card-bg` property fills the background of the card, and it is also used to create a linear gradient on top of the image, so the image blends in with the background. 
```css
background: linear-gradient(to left, var(--card-bg, rgba(0,0,0,0)), rgba(0,0,0,0));
```

It creates the following effect: 

<div class="card-link" aria-label="You’re a Movie Star. Congrats, Here’s Your Space Movie." style="max-width: 600px; margin: 0 auto;">
<article class="cardpost horizontal layout" style="--card-bg: rgba(80, 47, 28, 1);--card-fg: white;--card-bg-t: rgba(80, 47, 28, 0);">
   <div class="card-image" style="background-image: url(/stuff/posts/created-a-blog/nportman.jpg);">
      <div class="card-gradient"></div>
   </div>
   <div class="flex card-content">
      <div class="card-title" style="opacity: 1;">You’re a Movie Star. Congrats, Here’s Your Space Movie.</div>
      <div class="card-description">A major film career isn’t complete without one. This year it was Brad Pitt and Natalie Portman’s turns.</div>
      <div class="horizontal layout center card-footer">
      <time class="flex" datetime="2019-06-01T00:00:00.000Z">June 1, 2019</time>
      </div>
   </div>
</article>
</div>
<p></p>

**Note:** If I continue to like this, I will adapt that java code as an Eleventy JavaScript extension, so the themes for each post are generated automatically at *static-site-generation* time. 


## Cards - Creations

I wanted a different look for items representing experiemnts and side projects. With my allocated time to design this running out, I went to extreme - What doesn't look like a rectangle? **A circle!**

After some mucking around, I ended up with the following. It uses the color scheme described for post cards, but no gradients here. It looks a bit whimsical, but I was going for that. 

<figure>
  <img src="/stuff/posts/created-a-blog/ccards.png" alt="Creation cards example">
</figure>

## Fonts

Having run out of time, I went with the standard fonts. No web fonts. I remember a [NY Times experiment](https://opinionator.blogs.nytimes.com/2012/08/08/hear-all-ye-people-hearken-o-earth/) where the realized people tended to consider a serifed font more reliable (Baskerville) than sans-serifed ones. So I picked a serifed font for the blog content, and san-serif for the titles. 

## Hosting

I have heard great things about [Netlify](https://www.netlify.com/) so decided to give it a go. It was pretty straightforward. 

## Conclusion

I am pretty happy with what I ended up with after a day's work. I realize that some of these decisions may not scale well (e.g. a big list of creation cards), or may not be the most ergonomic. But, I hope to revisit it after I am convinced that I will not let this blog die. 😏

Having some existing code for quick image processing definitely helped, and it would be fun to encorporate it into the eleventy build process. 

## What do you think?

I'm not sure if I'm going to have comments on the blog or not, but let me know on [Twitter](https://twitter.com/preetster). Also, slide the bar below to indicate how much joy did this post bring you.

