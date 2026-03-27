---
title: Astro Performance Tips
description: Learn how to optimize your Astro site for better performance
pubDate: 2024-03-27
category: Performance
tags: [astro, optimization, performance]
---

Astro is a great choice for building fast websites. Here are some tips to maximize performance.

## Islands Architecture

Astro ships zero JavaScript by default. Only interactive components (islands) are hydrated with JavaScript.

```astro
---
// Static component - no JS sent to browser
import MyComponent from './MyComponent.astro';
---

<MyComponent />
```

## Code Splitting

Astro automatically splits your JavaScript into optimal chunks:
- Each island loads its own JavaScript
- Unused code is never sent to the browser
- Scripts are deferred by default

## Image Optimization

Use the Image component for automatic optimization:

```astro
---
import { Image } from 'astro:assets';
import myImage from '../assets/my-image.png';
---

<Image src={myImage} alt="My image" />
```

These simple strategies can significantly improve your site's performance!
