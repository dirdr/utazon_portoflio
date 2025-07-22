#!/bin/bash
CRF=${1:-15}
echo "Using CRF: $CRF"
find . \( -iname "*.mp4" -o -iname "*.mov" \) -type f | while read file; do
  dir=$(dirname "$file")
  base=$(basename "$file" | sed 's/\.[mM][pP]4$//; s/\.[mM][oO][vV]$//')
  echo "Processing: $file"
  if ffmpeg -i "$file" -c:v libvpx-vp9 -crf "$CRF" -b:v 0 -c:a libopus -b:a 192k -f webm "$dir/$base.webm" 2>/dev/null; then
    echo "✓ Created: $dir/$base.webm"
  else
    echo "✗ Failed: $file"
  fi
done
