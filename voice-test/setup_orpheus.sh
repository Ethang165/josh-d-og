#!/usr/bin/env bash
# Install Orpheus TTS on a CUDA GPU pod (24 GB+ VRAM).
# Needs HF_TOKEN set, from a Hugging Face account that has accepted the
# license on https://huggingface.co/canopylabs/orpheus-tts-0.1-finetune-prod
set -euo pipefail
cd "$(dirname "$0")"
: "${HF_TOKEN:?Set HF_TOKEN first: export HF_TOKEN=hf_...}"

nvidia-smi --query-gpu=name,memory.total --format=csv,noheader
apt-get update -qq && apt-get install -y -qq git ffmpeg python3-venv >/dev/null

[[ -d Orpheus-TTS ]] || git clone --depth 1 https://github.com/canopyai/Orpheus-TTS.git
python3 -m venv .venv
source .venv/bin/activate
pip install -U pip wheel
# Local package (not PyPI) avoids the max_model_len / KV-cache bug the README mentions.
pip install -e ./Orpheus-TTS/orpheus_tts_pypi
# Newer vLLM releases break orpheus_tts; this is the version the README pins.
pip install "vllm==0.7.3" snac flask "huggingface_hub[cli]"

hf download canopylabs/orpheus-tts-0.1-finetune-prod

echo "Setup done. Next: bash run_orpheus.sh"
