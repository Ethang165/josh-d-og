#!/usr/bin/env bash
# Install VibeVoice (community fork) + download weights on a CUDA GPU box.
set -euo pipefail
cd "$(dirname "$0")"

nvidia-smi --query-gpu=name,memory.total --format=csv,noheader

[[ -d VibeVoice ]] || git clone --depth 1 https://github.com/vibevoice-community/VibeVoice.git
python3 -m venv .venv
source .venv/bin/activate
pip install -U pip wheel
pip install torch torchaudio --index-url https://download.pytorch.org/whl/cu124
pip install -e ./VibeVoice
pip install -U "huggingface_hub[cli]"
pip install flash-attn --no-build-isolation || echo "flash-attn failed to build; falling back to sdpa (slower but works)"

# 1.5B = voice cloning from a .wav sample. Realtime-0.5B = streaming, preset voices only.
hf download microsoft/VibeVoice-1.5B --local-dir models/VibeVoice-1.5B
hf download microsoft/VibeVoice-Realtime-0.5B --local-dir models/VibeVoice-Realtime-0.5B

echo "Setup done. Next: bash run_test.sh /path/to/person.wav"
