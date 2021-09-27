# Referenced from https://github.com/importpw/vercel-bash/blob/master/src/build.sh

#!/usr/bin/env bash
set -euo pipefail

# Copy files into TMP
cd "$(dirname "$ENTRYPOINT_PATH")"
cp "$(basename "$ENTRYPOINT_PATH")" $TMP
cd $TMP
mv "$(basename "$ENTRYPOINT_PATH")" entrypoint.dart
cp "$BUILDER/bootstrap.dart.txt" bootstrap.dart

# Build binary file
pub get
dart compile exe bootstrap.dart -o bootstrap

# Make cache folder & copy bootstrap file into it
mkdir -p $DIST
cp bootstrap $DIST
