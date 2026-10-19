#!/usr/bin/env bash
# Usage: bash run_orpheus.sh [voice]   voices: tara leah jess leo dan mia zac zoe
set -euo pipefail
cd "$(dirname "$0")"
source .venv/bin/activate
mkdir -p outputs
python orpheus_test.py "${1:-tara}"
echo "Listen to outputs/*.wav"
