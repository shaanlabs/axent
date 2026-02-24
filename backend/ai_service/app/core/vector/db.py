"""Hybrid Vector Database Integrations"""
import os
import uuid
import logging
from typing import Dict, Any, List, Optional

try:
    import chromadb
    from qdrant_client import QdrantClient
    from qdrant_client.models import VectorParams, Distance, PointStruct
    HAS_VDB = True
except ImportError:
    HAS_VDB = False

logger = logging.getLogger(__name__)

class VectorDBManager:
    """Manages connections to ChromaDB (Memory) and Qdrant (Retrieval)"""
    
    def __init__(self, data_dir: str = "data/vector_db"):
        self.data_dir = data_dir
        self.chroma_client = None
        self.qdrant_client = None
        self.history_collection = None
        
        if HAS_VDB:
            try:
                # 1. Initialize ChromaDB (Local Persistent) for Project History / Memory
                chroma_path = os.path.join(data_dir, "chroma")
                os.makedirs(chroma_path, exist_ok=True)
                self.chroma_client = chromadb.PersistentClient(path=chroma_path)
                
                # Collection for project history learning loop
                # Uses 896 dimensional combined embeddings (512 visual + 384 text)
                self.history_collection = self.chroma_client.get_or_create_collection(
                    name="project_history",
                    metadata={"hnsw:space": "cosine"}
                )
                logger.info("ChromaDB initialized for project memory.")
                
                # 2. Initialize Qdrant (Local in-memory/file) for Semantic Equipment Search
                qdrant_path = os.path.join(data_dir, "qdrant")
                os.makedirs(qdrant_path, exist_ok=True)
                self.qdrant_client = QdrantClient(path=qdrant_path)
                
                # Ensure collection exists for equipment
                collections = [c.name for c in self.qdrant_client.get_collections().collections]
                if "equipment" not in collections:
                    self.qdrant_client.create_collection(
                        collection_name="equipment",
                        vectors_config=VectorParams(size=384, distance=Distance.COSINE) # e5-small size
                    )
                logger.info("Qdrant initialized for semantic retrieval.")
            except Exception as e:
                logger.error(f"Vector DB initialization failed: {e}")
                self.chroma_client = None
                self.qdrant_client = None
        else:
            logger.warning("chromadb or qdrant-client not installed. Vector DBs disabled.")
            
    def log_project_history(self, project_id: str, visual_emb: list, text_emb: list, actual_cost: float, actual_duration: int, metadata: dict):
        """Log a completed project to ChromaDB for future Keras retraining."""
        if not self.history_collection or not visual_emb or not text_emb:
            return False
            
        try:
            # Combine embeddings
            combined_emb = visual_emb + text_emb
            
            # Store ground truth as metadata
            meta = metadata.copy()
            meta["actual_cost"] = actual_cost
            meta["actual_duration"] = actual_duration
            
            self.history_collection.upsert(
                documents=[f"Project {project_id}"],
                embeddings=[combined_emb],
                metadatas=[meta],
                ids=[str(project_id)]
            )
            return True
        except Exception as e:
            logger.error(f"Failed to log project history to Chroma: {e}")
            return False
            
    def get_training_batch(self, limit: int = 500) -> tuple:
        """Fetch historical projects from ChromaDB to retrain the Keras model.
        Returns: (X_vis, X_text, Y_cost, Y_duration)
        """
        if not self.history_collection:
            return [], [], [], []
            
        try:
            results = self.history_collection.get(
                limit=limit,
                include=["embeddings", "metadatas"]
            )
            
            X_vis, X_text, Y_cost, Y_duration = [], [], [], []
            
            for i in range(len(results["ids"])):
                emb = results["embeddings"][i]
                meta = results["metadatas"][i]
                
                if len(emb) == 896 and "actual_cost" in meta and "actual_duration" in meta:
                    X_vis.append(emb[:512])   # OpenCLIP slice
                    X_text.append(emb[512:])  # e5-small slice
                    Y_cost.append(meta["actual_cost"])
                    Y_duration.append(meta["actual_duration"])
                    
            return X_vis, X_text, Y_cost, Y_duration
        except Exception as e:
            logger.error(f"Failed to fetch training batch: {e}")
            return [], [], [], []

# Global instance
_vdb_manager = None

def get_vdb_manager() -> VectorDBManager:
    global _vdb_manager
    if _vdb_manager is None:
        _vdb_manager = VectorDBManager()
    return _vdb_manager
