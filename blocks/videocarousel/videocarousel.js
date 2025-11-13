import { fetchPlaceholders } from '../../scripts/placeholders.js';
import { moveInstrumentation, isAuthorEnvironment } from '../../scripts/scripts.js';

let hlsLibraryPromise;
let videoBlockDecoratorPromise;
let videoBlockStylesLoaded = false;

function loadVideoBlockStyles() {
  if (videoBlockStylesLoaded) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `${window.hlx?.codeBasePath || ''}/blocks/video/video.css`;
  link.dataset.videoBlockStyles = 'true';
  document.head.appendChild(link);
  videoBlockStylesLoaded = true;
}

async function decorateNestedVideoBlock(videoBlock) {
  loadVideoBlockStyles();
  if (!videoBlockDecoratorPromise) {
    videoBlockDecoratorPromise = import('../video/video.js');
  }
  const module = await videoBlockDecoratorPromise;
  if (module?.default) {
    module.default(videoBlock);
  }
}

function loadHlsLibrary() {
  if (hlsLibraryPromise) return hlsLibraryPromise;

  hlsLibraryPromise = new Promise((resolve) => {
    if (window.Hls) {
      resolve(window.Hls);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
    script.async = true;
    script.onload = () => resolve(window.Hls);
    script.onerror = () => resolve(null);
    document.head.appendChild(script);
  });

  return hlsLibraryPromise;
}

function createVideoElement(videoUrl) {
  const video = document.createElement('video');
  video.setAttribute('muted', 'muted');
  video.setAttribute('playsinline', 'true');
  video.setAttribute('preload', 'none');
  video.muted = true;
  video.volume = 0;
  video.classList.add('video-element', 'lazy-load');

  if (videoUrl.includes('.m3u8')) {
    video.setAttribute('data-hls-src', videoUrl);
  } else {
    const source = document.createElement('source');
    source.setAttribute('data-src', videoUrl);
    source.setAttribute('type', 'video/mp4');
    video.appendChild(source);
  }

  return video;
}

function loadVideo(video) {
  if (!video) return false;

  const source = video.querySelector('source[data-src]');
  if (source) {
    const videoUrl = source.getAttribute('data-src');
    source.setAttribute('src', videoUrl);
    source.removeAttribute('data-src');
    video.load();
    return true;
  }

  const hlsUrl = video.getAttribute('data-hls-src');
  if (hlsUrl) {
    if (video.canPlayType('application/vnd.apple.mpegURL')) {
      video.src = hlsUrl;
      video.removeAttribute('data-hls-src');
      video.load();
      return true;
    }

    loadHlsLibrary().then((HlsLib) => {
      if (HlsLib && HlsLib.isSupported()) {
        if (video._hls) {
          try {
            video._hls.destroy();
          } catch (e) {
            // noop
          }
        }
        const hls = new HlsLib();
        video._hls = hls;
        hls.loadSource(hlsUrl);
        hls.attachMedia(video);
        video.removeAttribute('data-hls-src');
      }
    });
    return true;
  }

  return false;
}

function createProgressBar() {
  const progressContainer = document.createElement('div');
  progressContainer.classList.add('progress-bar-container');

  const progressBar = document.createElement('div');
  progressBar.classList.add('progress', 'progress-bar');

  progressContainer.appendChild(progressBar);
  return progressContainer;
}

function updateProgress(video, progressBar) {
  if (video?.duration) {
    const progress = (video.currentTime / video.duration) * 100;
    progressBar.style.width = `${progress}%`;
  }
}

function createShowMoreLess(textElement) {
  const showMoreContainer = document.createElement('div');
  showMoreContainer.classList.add('show-more-container');

  const showMoreBtn = document.createElement('span');
  showMoreBtn.classList.add('show-more');
  showMoreBtn.textContent = 'Show more';
  showMoreBtn.style.display = 'inline';

  const showLessBtn = document.createElement('span');
  showLessBtn.classList.add('show-less');
  showLessBtn.textContent = 'Show less';
  showLessBtn.style.display = 'none';

  showMoreContainer.appendChild(showMoreBtn);
  showMoreContainer.appendChild(showLessBtn);

  textElement.classList.add('clamp-text');

  showMoreBtn.addEventListener('click', () => {
    textElement.classList.remove('clamp-text');
    showMoreBtn.style.display = 'none';
    showLessBtn.style.display = 'inline';
  });

  showLessBtn.addEventListener('click', () => {
    textElement.classList.add('clamp-text');
    showMoreBtn.style.display = 'inline';
    showLessBtn.style.display = 'none';
  });

  return showMoreContainer;
}

function setActiveSlide(allSlides, activeSlideIndex) {
  allSlides.forEach((slide) => {
    slide.classList.remove('active-slide');
    const video = slide.querySelector('video');
    const progressBar = slide.querySelector('.progress-bar');

    if (video) {
      video.pause();
      video.currentTime = 0;

      if (video._hls) {
        try {
          video._hls.destroy();
        } catch (e) {
          // noop
        }
        video._hls = null;
      }

      if (video._progressHandler) {
        video.removeEventListener('timeupdate', video._progressHandler);
      }

      if (progressBar) {
        progressBar.style.width = '0%';
      }
    }
  });

  const activeSlide = allSlides[activeSlideIndex];
  if (!activeSlide) return;

  activeSlide.classList.add('active-slide');
  const video = activeSlide.querySelector('video');
  const progressBar = activeSlide.querySelector('.progress-bar');

  if (!video) return;

  const wasLoaded = loadVideo(video);

  if (progressBar) {
    video._progressHandler = () => updateProgress(video, progressBar);
    video.addEventListener('timeupdate', video._progressHandler);
  }

  video.addEventListener('volumechange', () => {
    if (!video.muted || video.volume > 0) {
      video.muted = true;
      video.volume = 0;
    }
  });

  const playVideo = () => {
    video.muted = true;
    video.volume = 0;

    video.play().catch(() => {
      setTimeout(() => {
        video.muted = true;
        video.volume = 0;
        video.play().catch(() => {});
      }, 100);
    });
  };

  if (wasLoaded) {
    video.addEventListener('loadeddata', playVideo, { once: true });
  } else {
    playVideo();
  }
}

function showSlideGroup(block, activeSlideIndex = 0) {
  const slides = Array.from(block.querySelectorAll('.video-slide'));
  const totalSlides = slides.length;

  if (!totalSlides) return;

  const parent = block.closest('.fixed-width-container, .bg-black-3, #keyHighlights, .overview');
  const slidesToShow = parent ? 5 : 4;

  let targetIndex = activeSlideIndex;
  if (targetIndex >= totalSlides) targetIndex %= totalSlides;
  if (targetIndex < 0) targetIndex = ((targetIndex % totalSlides) + totalSlides) % totalSlides;

  block.setAttribute('data-active-slide', targetIndex);

  slides.forEach((slide) => {
    slide.style.display = 'none';
    slide.style.transform = '';
    slide.style.opacity = '';
    slide.style.order = '';
  });

  for (let i = 0; i < Math.min(slidesToShow, totalSlides); i += 1) {
    const slideIndex = (targetIndex + i) % totalSlides;
    const slide = slides[slideIndex];
    slide.style.display = 'block';
    slide.style.order = i;
  }

  setActiveSlide(slides, targetIndex);
}

function bindEvents(block) {
  const slides = block.querySelectorAll('.video-slide');
  const prevBtn = block.querySelector('.slide-prev');
  const nextBtn = block.querySelector('.slide-next');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const currentActiveSlide = parseInt(block.getAttribute('data-active-slide') || '0', 10);
      showSlideGroup(block, currentActiveSlide - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const currentActiveSlide = parseInt(block.getAttribute('data-active-slide') || '0', 10);
      showSlideGroup(block, currentActiveSlide + 1);
    });
  }

  slides.forEach((slide, slideIndex) => {
    slide.addEventListener('click', () => {
      if (slide.style.display !== 'none') {
        showSlideGroup(block, slideIndex);
      }
    });
  });
}

function extractVideoUrl(videoColumn) {
  if (!videoColumn) return '';

  // Check for data-aue-prop="videoUrl" (model field) - could be in p, div, span, or a tag
  const videoUrlElement = videoColumn.querySelector('[data-aue-prop="videoUrl"]');
  if (videoUrlElement) {
    // Try href first (if it's a link)
    const href = videoUrlElement.getAttribute('href');
    if (href) return href;
    
    // Then try text content
    const url = videoUrlElement.textContent?.trim();
    if (url && (url.startsWith('http') || url.endsWith('.mp4') || url.endsWith('.m3u8') || url.endsWith('.mov') || url.endsWith('.webm'))) {
      return url;
    }
    
    // Try innerHTML if textContent didn't work
    const innerUrl = videoUrlElement.innerHTML?.trim();
    if (innerUrl && (innerUrl.startsWith('http') || innerUrl.endsWith('.mp4') || innerUrl.endsWith('.m3u8') || innerUrl.endsWith('.mov') || innerUrl.endsWith('.webm'))) {
      return innerUrl;
    }
  }

  // Check for embedded video block
  const embeddedVideoBlock = videoColumn.querySelector('.video');
  if (embeddedVideoBlock) {
    moveInstrumentation(videoColumn, embeddedVideoBlock);

    const blockAnchor = embeddedVideoBlock.querySelector('a[href$=".mp4"], a[href*=".m3u8"], a[href$=".mov"], a[href$=".webm"]');
    if (blockAnchor) {
      const href = blockAnchor.getAttribute('href') || blockAnchor.textContent?.trim() || '';
      blockAnchor.parentElement?.removeChild(blockAnchor);
      return href;
    }

    const videoSource = embeddedVideoBlock.querySelector('video source');
    if (videoSource) {
      const src = videoSource.getAttribute('src') || videoSource.dataset.src || '';
      videoSource.parentElement?.removeChild(videoSource);
      return src;
    }

    const videoEl = embeddedVideoBlock.querySelector('video');
    if (videoEl) {
      const directSrc = videoEl.getAttribute('src') || videoEl.currentSrc || '';
      if (directSrc) {
        videoEl.parentElement?.remove();
        return directSrc;
      }
    }
  }

  // Check for anchor links
  const anchor = videoColumn.querySelector('a[href$=".mp4"], a[href*=".m3u8"], a[href$=".mov"], a[href$=".webm"]');
  if (anchor) {
    const href = anchor.getAttribute('href');
    if (href) return href;
  }

  // Check for plain text URL in the entire column
  const textLink = videoColumn.textContent?.trim();
  if (textLink && (textLink.startsWith('http') || textLink.endsWith('.mp4') || textLink.endsWith('.m3u8') || textLink.endsWith('.mov') || textLink.endsWith('.webm'))) {
    return textLink;
  }

  // Check innerHTML as last resort
  const innerHtml = videoColumn.innerHTML?.trim();
  if (innerHtml && (innerHtml.includes('http') || innerHtml.includes('.mp4') || innerHtml.includes('.m3u8'))) {
    // Try to extract URL from HTML
    const urlMatch = innerHtml.match(/(https?:\/\/[^\s<>"']+\.(?:mp4|m3u8|mov|webm))/i);
    if (urlMatch) return urlMatch[1];
  }

  return '';
}

export default async function decorate(block) {
  const rows = Array.from(block.children);
  const placeholders = await fetchPlaceholders();
  const videoBlockPromises = [];

  const container = document.createElement('div');
  container.classList.add('video-carousel-container');

  const slidesContainer = document.createElement('div');
  slidesContainer.classList.add('video-slides-container');

  rows.forEach((row, index) => {
    // Skip if row is empty or doesn't have columns
    if (!row.children.length) {
      row.remove();
      return;
    }

    const columns = Array.from(row.children);
    if (columns.length < 2) {
      // Ensure we have at least 2 columns
      for (let i = columns.length; i < 2; i += 1) {
        const emptyCol = document.createElement('div');
        row.appendChild(emptyCol);
      }
    }

    const refreshedColumns = Array.from(row.children);
    const videoColumn = refreshedColumns[0];
    const contentColumn = refreshedColumns[1];

    const slide = document.createElement('div');
    slide.classList.add('video-slide');
    slide.setAttribute('data-slide-index', index);
    moveInstrumentation(row, slide);

    // Extract and create video from first column
    if (videoColumn) {
      const embeddedVideoBlock = videoColumn.querySelector('.video');
      if (embeddedVideoBlock) {
        const videoContainer = document.createElement('div');
        videoContainer.classList.add('video-container');
        moveInstrumentation(videoColumn, videoContainer);

        videoContainer.appendChild(embeddedVideoBlock);
        const progressBar = createProgressBar();
        videoContainer.appendChild(progressBar);
        slide.appendChild(videoContainer);

        videoBlockPromises.push(decorateNestedVideoBlock(embeddedVideoBlock));
      } else {
        const videoUrl = extractVideoUrl(videoColumn);
        if (videoUrl) {
          const videoContainer = document.createElement('div');
          videoContainer.classList.add('video-container');
          moveInstrumentation(videoColumn, videoContainer);

          const video = createVideoElement(videoUrl);
          const progressBar = createProgressBar();

          videoContainer.appendChild(video);
          videoContainer.appendChild(progressBar);
          slide.appendChild(videoContainer);
        } else {
          // If no video URL found, still create an empty container to maintain structure
          const videoContainer = document.createElement('div');
          videoContainer.classList.add('video-container', 'empty-video');
          moveInstrumentation(videoColumn, videoContainer);
          slide.appendChild(videoContainer);
        }
      }
    }

    // Extract and create content from second column
    if (contentColumn) {
      const contentContainer = document.createElement('div');
      contentContainer.classList.add('video-content');
      moveInstrumentation(contentColumn, contentContainer);

      // Check for data-aue-prop="text" (model field)
      const textElement = contentColumn.querySelector('[data-aue-prop="text"]');
      if (textElement) {
        const paragraph = document.createElement('div');
        paragraph.innerHTML = textElement.innerHTML || textElement.textContent;
        contentContainer.appendChild(paragraph);
      } else {
        // Fallback: extract all text content
        const textElements = Array.from(contentColumn.querySelectorAll('h1, h2, h3, h4, h5, h6, p, div'));
        if (textElements.length) {
          textElements.forEach((el) => {
            if (el.textContent.trim()) {
              const cloned = el.cloneNode(true);
              contentContainer.appendChild(cloned);
            }
          });
        } else if (contentColumn.textContent.trim()) {
          const paragraph = document.createElement('p');
          paragraph.innerHTML = contentColumn.innerHTML || contentColumn.textContent;
          contentContainer.appendChild(paragraph);
        }
      }

      // Add show more/less to description paragraphs
      const descriptionParagraphs = contentContainer.querySelectorAll('p');
      if (descriptionParagraphs.length > 0) {
        const lastParagraph = descriptionParagraphs[descriptionParagraphs.length - 1];
        if (lastParagraph.textContent.trim().length > 150) {
          const showMoreLess = createShowMoreLess(lastParagraph);
          contentContainer.appendChild(showMoreLess);
        }
      }

      slide.appendChild(contentContainer);
    }

    slidesContainer.appendChild(slide);
    row.remove();
  });

  if (videoBlockPromises.length) {
    await Promise.all(videoBlockPromises);
  }

  const navButtons = document.createElement('div');
  navButtons.classList.add('video-carousel-nav-buttons');
  navButtons.innerHTML = `
    <button type="button" class="slide-prev" aria-label="${placeholders.previousSlide || 'Previous Slides'}">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>
    </button>
    <button type="button" class="slide-next" aria-label="${placeholders.nextSlide || 'Next Slides'}">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>
    </button>
  `;

  container.appendChild(slidesContainer);
  container.appendChild(navButtons);
  block.appendChild(container);

  showSlideGroup(block, 0);
  bindEvents(block);

  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const video = entry.target;
        loadVideo(video);
        videoObserver.unobserve(video);
      }
    });
  }, { threshold: 0.1 });

  block.querySelectorAll('video').forEach((video) => {
    videoObserver.observe(video);
  });
}

