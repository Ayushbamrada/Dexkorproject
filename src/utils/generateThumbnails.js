// utils/generateThumbnails.js
export const generateThumbnail = (videoUrl) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous'; // Important for CORS
    video.src = videoUrl;
    video.currentTime = 2;

    video.addEventListener('loadeddata', () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const thumbnailUrl = canvas.toDataURL('image/jpeg');
      resolve(thumbnailUrl);
    });

    video.addEventListener('error', (e) => {
      reject(new Error('Error loading video for thumbnail'));
    });
  });
};
