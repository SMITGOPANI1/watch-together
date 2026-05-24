// Reusable dynamic loader for YouTube IFrame Player API script
let loadPromise = null;

export const loadYouTubeAPI = () => {
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve) => {
    // If YT API is already loaded in the window, resolve immediately
    if (window.YT && window.YT.Player) {
      resolve(window.YT);
      return;
    }

    // Register global callback that YT calls when fully ready
    const previousAPIReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (previousAPIReady) previousAPIReady();
      resolve(window.YT);
    };

    // Inject YouTube IFrame API script tag dynamically
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
  });

  return loadPromise;
};

export default loadYouTubeAPI;
