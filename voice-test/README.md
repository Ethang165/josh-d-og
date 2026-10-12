# VibeVoice test on a GPU server

Run these on the GPU box (Ubuntu with NVIDIA drivers, 16 GB+ VRAM recommended).

```bash
git clone -b claude/laughing-rubin-h9ey9x https://github.com/ethang165/josh-d-og.git
cd josh-d-og/voice-test

# 1. See what would be cleaned (nothing is deleted)
bash cleanup_gpu.sh
# 2. Actually clean: caches, venvs, conda envs, docker; project folders asked one by one
bash cleanup_gpu.sh --yes

# 3. Install VibeVoice + download models
bash setup_vibevoice.sh

# 4. Upload a clean 10-60s WAV of the person, then:
bash run_test.sh person.wav
```

Outputs:
- `outputs/clone/` cloned voice (1.5B model, not real-time)
- `outputs/realtime/` streaming model with a preset voice (no cloning)

Notes:
- VibeVoice has no `[laugh]` tags. Laughs and emotion come from the wording and the sample.
- Microsoft licenses these weights for research use only and requires recorded consent before cloning someone's voice.
