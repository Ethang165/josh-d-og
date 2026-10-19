# Orpheus TTS test on a GPU pod

Pod: RunPod PyTorch template, 24 GB+ VRAM (RTX 4090 / A5000 or bigger), 50 GB+ disk.

Before you start, accept the model license on Hugging Face
(https://huggingface.co/canopylabs/orpheus-tts-0.1-finetune-prod) and create a
read token at https://huggingface.co/settings/tokens.

```bash
git clone -q -b claude/laughing-rubin-h9ey9x https://github.com/ethang165/josh-d-og.git /tmp/src
rm -rf ~/voice-test && mv /tmp/src/voice-test ~/voice-test && rm -rf /tmp/src
cd ~/voice-test
export HF_TOKEN=hf_...          # your token
bash setup_orpheus.sh
bash run_orpheus.sh tara        # voices: tara leah jess leo dan mia zac zoe
```

The test prints time-to-first-audio and real-time factor for each line, and
writes WAVs to `outputs/`.

Emotion tags: `<laugh>` `<chuckle>` `<sigh>` `<cough>` `<sniffle>` `<groan>` `<yawn>` `<gasp>`

## Cloning a specific person

Orpheus's zero-shot cloning is weak (its own README says so). To sound like a
specific person, fine-tune it on their recordings: aim for 30-60+ minutes of
clean, single-speaker audio with transcripts. Real recordings only; synthetic
data makes fine-tunes worse. Get the person's recorded consent first.

`cleanup_gpu.sh` is for reusing an old pod: a dry run by default, `--yes` to delete.
