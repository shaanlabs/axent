"""Video frame extraction and processing for multimodal project analysis"""
import cv2
import tempfile
import os
import logging
from typing import List

logger = logging.getLogger(__name__)

class VideoProcessor:
    """Extracts keyframes from videos for project analysis"""

    def __init__(self):
        logger.info("VideoProcessor initialized for frame extraction.")

    async def extract_frames(self, video_bytes: bytes, max_frames: int = 15) -> List[bytes]:
        """
        Extracts up to `max_frames` (target 15) evenly spaced frames from the first 30 seconds of video bytes.
        Returns a list of image bytes (JPEG).
        """
        frames_bytes = []
        # Write bytes to a temporary file since OpenCV needs a file path
        fd, temp_path = tempfile.mkstemp(suffix=".mp4")
        try:
            with open(fd, 'wb') as f:
                f.write(video_bytes)
            
            cap = cv2.VideoCapture(temp_path)
            if not cap.isOpened():
                logger.error("Failed to open video file for frame extraction.")
                return frames_bytes

            fps = cap.get(cv2.CAP_PROP_FPS)
            total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            duration = total_frames / fps if fps > 0 else 0
            
            # Limit processing to max 30 seconds (low load constraint)
            if duration > 30:
                logger.warning(f"Video duration ({duration:.1f}s) exceeds 30s limit. Processing only first 30s.")
                total_frames = int(30 * fps) if fps > 0 else total_frames

            if total_frames <= 0:
                return frames_bytes

            # Calculate the intervals to uniformly sample frames within the designated timeframe
            interval = max(1, total_frames // max_frames)
            
            sampled_count = 0
            for i in range(total_frames):
                ret, frame = cap.read()
                if not ret:
                    break
                
                # Take a frame every interval
                if i % interval == 0 and sampled_count < max_frames:
                    # Convert cv2 frame (BGR) to JPEG bytes
                    success, buffer = cv2.imencode('.jpg', frame)
                    if success:
                        frames_bytes.append(buffer.tobytes())
                        sampled_count += 1
                        
            cap.release()
            return frames_bytes

        except Exception as e:
            logger.error(f"Error during video frame extraction: {e}")
            return frames_bytes
        finally:
            # Clean up the temporary file
            try:
                os.remove(temp_path)
            except Exception as cleanup_err:
                logger.warning(f"Failed to delete temporary video file {temp_path}: {cleanup_err}")

# Global instance
_video_processor = None

def get_video_processor() -> VideoProcessor:
    """Get or create the global video processor instance"""
    global _video_processor
    if _video_processor is None:
        _video_processor = VideoProcessor()
    return _video_processor
