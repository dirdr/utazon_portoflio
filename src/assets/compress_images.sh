find . -name "*.png" -type f | while read file; do
  # Get the directory where the file is located
  dir=$(dirname "$file")

  # Convert file and save in same directory
  base=$(basename "$file" .png)

  echo "Processing: $file"

  if ffmpeg -i "$file" -c:v libwebp -quality 85 -method 6 "$dir/$base.webp" -y 2>/dev/null; then
    echo "✓ Created: $dir/$base.webp"
  else
    echo "✗ Failed: $file"
  fi
done
