"""Generate test lines with Orpheus and time them.

Prints time-to-first-audio (what matters for real-time) and the real-time
factor (generation time / audio length; under 1.0 means faster than real time).
"""
import sys
import time
import wave

from orpheus_tts import OrpheusModel

VOICE = sys.argv[1] if len(sys.argv) > 1 else "tara"
OUT = "outputs"
SAMPLE_RATE = 24000

LINES = {
    "laugh": "Oh my god, you will not believe what just happened. <laugh> Okay, okay, let me start from the beginning.",
    "sigh": "I'm honestly so tired right now. <sigh> But this is too good not to tell you.",
    "gasp": "Wait, what? <gasp> No way. You're kidding me, right? <chuckle>",
    "plain": "Hey, thanks for calling. How can I help you today?",
}

model = OrpheusModel(model_name="canopylabs/orpheus-tts-0.1-finetune-prod", max_model_len=2048)

for name, text in LINES.items():
    start = time.monotonic()
    first = None
    frames = 0
    path = f"{OUT}/{VOICE}_{name}.wav"
    with wave.open(path, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(SAMPLE_RATE)
        for chunk in model.generate_speech(
            prompt=text, voice=VOICE, repetition_penalty=1.1,
            stop_token_ids=[128258], max_tokens=2000, temperature=0.4, top_p=0.9,
        ):
            if first is None:
                first = time.monotonic() - start
            frames += len(chunk) // 2
            wf.writeframes(chunk)
    total = time.monotonic() - start
    audio = frames / SAMPLE_RATE
    print(f"{name:6s} first audio {first * 1000:6.0f} ms | {audio:5.1f}s audio in {total:5.1f}s | RTF {total / audio:.2f} | {path}")
