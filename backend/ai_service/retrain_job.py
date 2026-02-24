"""
Offline Retraining Job for AXENT MVP Continual Learning.
This script should be scheduled via cron or a background worker (e.g. celery) to run periodically (daily/weekly).
It pulls ground truth project outcomes from ChromaDB and fine-tunes the Keras cost/duration models.
"""
import logging
import asyncio
from app.core.vector.db import get_vdb_manager
from app.core.estimator.keras_model import get_keras_estimator

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("RetrainingJob")

def run_retraining():
    logger.info("Starting offline Keras model retraining loop...")
    
    vdb = get_vdb_manager()
    keras_model = get_keras_estimator()
    
    if not vdb.history_collection:
        logger.error("VectorDB (Chroma) not available. Cannot fetch training data.")
        return
        
    if not keras_model.model:
        logger.error("Keras model not available. Cannot retrain.")
        return
        
    # Fetch historical data
    # In production, limit should be based on a time window or since last retrain.
    logger.info("Fetching project history from Vector Memory...")
    X_vis, X_text, Y_cost, Y_duration = vdb.get_training_batch(limit=500)
    
    total_samples = len(X_vis)
    logger.info(f"Fetched {total_samples} historical projects with ground truth data.")
    
    if total_samples < 5:
        logger.info("Not enough data to warrant retraining. Require at least 5 samples. Exiting.")
        return
        
    logger.info("Initiating Keras weights optimization...")
    success = keras_model.retrain_batch(X_vis, X_text, Y_cost, Y_duration, epochs=10)
    
    if success:
        logger.info("Retraining successful! The model is now smarter.")
    else:
        logger.error("Retraining failed due to an internal Keras/TensorFlow error.")

if __name__ == "__main__":
    run_retraining()
