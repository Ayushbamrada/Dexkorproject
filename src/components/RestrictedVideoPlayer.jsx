import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';

const RestrictedVideoPlayer = ({
  videoUrl,
  courseId,
  videoId,
  userId,
  onProgressUpdate,
  initialProgressSeconds = 0,
}) => {
  const videoRef = useRef(null);
  const [maxAllowedTime, setMaxAllowedTime] = useState(0);
  const [lastSentSecond, setLastSentSecond] = useState(0);

  useEffect(() => {
    if (initialProgressSeconds) {
      setMaxAllowedTime(initialProgressSeconds);
      if (videoRef.current) {
        videoRef.current.currentTime = initialProgressSeconds;
      }
    }
  }, [initialProgressSeconds]);

  // Send progress to backend
  const sendProgress = async (watchedSeconds, videoDuration, completed = false) => {
    try {
      await axios.post(
        'http://localhost:5000/api/progress/update',
        {
          userId,
          courseId,
          videoId,
          watchedSeconds: Math.floor(watchedSeconds),
          videoDuration: Math.floor(videoDuration),
          completed,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      setLastSentSecond(Math.floor(watchedSeconds));
      if (onProgressUpdate) {
        const progressPercent = (watchedSeconds / videoDuration) * 100;
        onProgressUpdate(videoId, progressPercent > 100 ? 100 : progressPercent);
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    const currentTime = video.currentTime;
    const duration = video.duration;

    // Prevent skipping forward beyond allowed time (+ 0.3 for small tolerance)
    if (currentTime > maxAllowedTime + 0.3) {
      video.currentTime = maxAllowedTime;
    } else {
      setMaxAllowedTime(currentTime);
    }

    // Send progress every 10 seconds and when seconds change
    if (
      Math.floor(currentTime) % 10 === 0 &&
      Math.floor(currentTime) !== lastSentSecond
    ) {
      sendProgress(currentTime, duration);
    }
  };

  const handleSeeking = () => {
    const video = videoRef.current;
    if (video.currentTime > maxAllowedTime + 0.3) {
      video.currentTime = maxAllowedTime;
    }
  };

  const handleVideoEnd = () => {
    const video = videoRef.current;
    sendProgress(video.duration, video.duration, true); // mark completed
  };

  return (
    <div className="w-full">
      <video
        ref={videoRef}
        src={videoUrl}
        controls
        onTimeUpdate={handleTimeUpdate}
        onSeeking={handleSeeking}
        onEnded={handleVideoEnd}
        className="w-full rounded"
      />
    </div>
  );
};

export default RestrictedVideoPlayer;
