import sys
import uvicorn
import logging

def main():
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger(__name__)
    
    logger.info("=========================================")
    logger.info("🚀 Starting DOABLE Web Application...")
    logger.info("🌐 Access the UI at: http://127.0.0.1:8000")
    logger.info("=========================================")
    
    try:
        uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=False)
    except Exception as e:
        logger.error(f"Failed to start server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()