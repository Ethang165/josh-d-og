#!/usr/bin/env bash
# Test 1: clone a voice from a WAV sample with VibeVoice-1.5B.
# Test 2: real-time streaming with VibeVoice-Realtime-0.5B (preset voice) and time it.
# Usage: bash run_test.sh person.wav
# The sample should be 10-60s of clean speech, one speaker, no music.
set -euo pipefail
cd "$(dirname "$0")"
source .venv/bin/activate

SAMPLE="${1:?usage: bash run_test.sh person.wav}"
mkdir -p outputs
# The demo picks voices by filename from demo/voices/
ffmpeg -y -loglevel error -i "$SAMPLE" -ac 1 -ar 24000 VibeVoice/demo/voices/target.wav

cat > outputs/script.txt <<'TXT'
Speaker 1: Oh my god, you will not believe what just happened. Hahaha, okay, okay, let me start from the beginning.
Speaker 1: I'm honestly so tired right now... but this is too good not to tell you. Ugh, seriously, it was wild.
TXT

echo "== Test 1: voice cloning (1.5B) =="
time python VibeVoice/demo/inference_from_file.py \
  --model_path models/VibeVoice-1.5B \
  --txt_path outputs/script.txt \
  --speaker_names target \
  --output_dir outputs/clone

echo "== Test 2: real-time streaming (0.5B, preset voice) =="
echo "Hey! This is the real-time model. Listen to how fast it starts talking." > outputs/rt.txt
time python VibeVoice/demo/streaming_inference_from_file.py \
  --model_path models/VibeVoice-Realtime-0.5B \
  --txt_path outputs/rt.txt \
  --speaker_name Emma \
  --output_dir outputs/realtime

echo "Done. Listen to outputs/clone/*.wav and outputs/realtime/*.wav"
