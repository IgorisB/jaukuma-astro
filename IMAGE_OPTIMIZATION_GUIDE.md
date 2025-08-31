# Hero Image Optimization Guide

## Current Image Analysis

| Image | Current Size | Recommended Size | Action Required |
|-------|-------------|------------------|-----------------|
| hero-background.jpg | 291KB | 150-200KB | Moderate optimization needed |
| aboutus-hero-background.jpg | 651KB | 300-400KB | Significant optimization needed |
| contact-hero-background.jpg | 651KB | 300-400KB | Significant optimization needed |

## Optimization Requirements for Parallax Performance

### 1. Image Compression Targets
- **Quality**: 80-85% JPEG quality for optimal size/quality balance
- **Format**: WebP with JPEG fallback for maximum compatibility
- **Resolution**: Optimize for largest expected viewport (1920x1080)

### 2. Recommended Image Sizes
- **Desktop**: 1920x1080 maximum resolution
- **Tablet**: 1024x768 responsive variant  
- **Mobile**: 768x1024 optimized version

### 3. File Size Targets
- **hero-background.jpg**: Reduce from 291KB to 150-200KB
- **aboutus-hero-background.jpg**: Reduce from 651KB to 300-400KB  
- **contact-hero-background.jpg**: Reduce from 651KB to 300-400KB

## Image Optimization Tools

### Online Tools (Recommended)
1. **TinyJPG/TinyPNG** (https://tinyjpg.com/)
   - Easy to use, good compression ratio
   - Supports batch processing

2. **Squoosh** (https://squoosh.app/)
   - Google's image optimization tool
   - WebP conversion support
   - Real-time quality preview

### Command Line Tools
```bash
# Using ImageMagick
magick convert hero-background.jpg -quality 85 -resize 1920x1080> hero-background-optimized.jpg

# Using WebP
cwebp -q 85 hero-background.jpg -o hero-background.webp
```

## Implementation Steps

### Step 1: Create Optimized Versions
For each hero image, create:
1. **Original size, optimized compression**: `image-name-optimized.jpg`
2. **WebP version**: `image-name.webp`
3. **Mobile optimized**: `image-name-mobile.jpg` and `image-name-mobile.webp`

### Step 2: File Naming Convention
```
/public/images/
├── hero-background.jpg (current)
├── hero-background-optimized.jpg (new)
├── hero-background.webp (new)
├── hero-background-mobile.jpg (new)
├── hero-background-mobile.webp (new)
├── aboutus-hero-background.jpg (current)
├── aboutus-hero-background-optimized.jpg (new)
├── aboutus-hero-background.webp (new)
└── ... (similar pattern for contact images)
```

### Step 3: Update Component References
The CSS has been updated to support responsive images. Once optimized images are created, update the background image references in:

1. `section.hero.astro`: Update the background image URL
2. `section.page-hero.astro`: Ensure props pass optimized image paths

## Performance Impact

### Before Optimization
- Total hero image size: ~1.6MB
- First load time: High impact on LCP
- Mobile performance: Poor on slow connections

### After Optimization  
- Expected total size: ~700-900KB (56% reduction)
- Improved First Contentful Paint
- Better mobile performance
- Maintained visual quality

## Browser Support Strategy

The CSS implementation supports:
- **WebP**: Modern browsers (95%+ support)
- **JPEG fallback**: Universal browser support
- **Responsive loading**: Bandwidth-appropriate images

## Validation Checklist

After implementing optimized images:
- [ ] Desktop images load in <2 seconds on 3G
- [ ] Mobile images are <400KB each
- [ ] WebP format loads in supported browsers
- [ ] JPEG fallback works in older browsers
- [ ] Visual quality maintained at 85% compression
- [ ] Parallax effect works smoothly with optimized images

## Next Steps

1. Process images using recommended tools
2. Replace current images with optimized versions
3. Test parallax performance with new images
4. Validate Core Web Vitals improvements
5. Monitor performance metrics post-deployment

## Performance Metrics to Track

- **Largest Contentful Paint (LCP)**: Should improve significantly
- **First Contentful Paint (FCP)**: Faster initial load
- **Cumulative Layout Shift (CLS)**: Should remain stable
- **Time to Interactive (TTI)**: Improved with smaller images