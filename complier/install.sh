#!/bin/bash

# Install CPU 8-Bit Compiler globally

echo "Building CPU 8-Bit Compiler..."
npm run build

echo "Creating global symlink..."
npm link

echo "CPU 8-Bit Compiler installed globally!"
echo "You can now use 'cpu8bit' command from anywhere."
echo ""
echo "Try:"
echo "  cpu8bit example -o examples"
echo "  cpu8bit compile examples/hello.s"