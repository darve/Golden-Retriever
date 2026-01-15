#!/bin/bash

# Convert image sequence from gif-frames to optimized MP4
# Usage: ./frames-to-mp4.sh [sequence_name] [framerate]
# Example: ./frames-to-mp4.sh Showcase 30

SEQUENCE_NAME="${1:-Showcase}"
FRAMERATE="${2:-30}"
INPUT_DIR="gif-frames"
OUTPUT_DIR="export"

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

INPUT_PATTERN="${INPUT_DIR}/${SEQUENCE_NAME}%04d.png"
OUTPUT_FILE="${OUTPUT_DIR}/${SEQUENCE_NAME}.mp4"

echo "Converting ${SEQUENCE_NAME} sequence to MP4..."
echo "Input: ${INPUT_PATTERN}"
echo "Output: ${OUTPUT_FILE}"
echo "Framerate: ${FRAMERATE} fps"

ffmpeg -y \
  -framerate "$FRAMERATE" \
  -i "$INPUT_PATTERN" \
  -c:v libx264 \
  -preset slow \
  -crf 18 \
  -pix_fmt yuv420p \
  -movflags +faststart \
  "$OUTPUT_FILE"

echo "Done! Output saved to ${OUTPUT_FILE}"
