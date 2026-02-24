import time
import asyncio
from app.core.vision.detector import get_analyzer
from app.core.estimator.project import get_estimator
from PIL import Image
import io

async def main():
    print("Testing pipeline latency...")
    
    # Mocking 15 frames from a video
    dummy_img = Image.new('RGB', (224, 224), color = 'red')
    buf = io.BytesIO()
    dummy_img.save(buf, format='JPEG')
    dummy_bytes = buf.getvalue()
    frames = [dummy_bytes for _ in range(15)]
    
    analyzer = get_analyzer()
    estimator = get_estimator()
    
    print("Warming up models...")
    _ = await analyzer._detect_equipment_type(dummy_bytes)
    if estimator.encoder:
        _ = estimator.encoder.encode(["passage: test warmup"])
        
    print("Testing true latency...")
    t1 = time.time()
    vision_data = await analyzer.analyze_project_frames(frames)
    t2 = time.time()
    print(f"Vision analysis (15 frames) took {t2-t1:.2f}s")
    
    t3 = time.time()
    description = "We need to clear a large field using bulldozers and excavators for a new commercial farming setup. Located in rural Punjab."
    if estimator.encoder:
        emb = estimator.encoder.encode([f"passage: {description}"])
    t4 = time.time()
    print(f"Text embedding took {t4-t3:.2f}s")
    
    total = (t2-t1) + (t4-t3)
    print(f"Total pipeline non-LLM latency: {total:.2f}s")
    
    if total < 20.0:
        print("SUCCESS: Target Latency Metric Achieved! (< 20s)")
    else:
        print("WARNING: Pipeline exceeded target latency bounds.")

if __name__ == "__main__":
    asyncio.run(main())
