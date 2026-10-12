#!/usr/bin/env bash
# Clean old AI models, caches, virtualenvs and project folders off a GPU box.
# KEEPS: the OS, NVIDIA drivers, CUDA, system Python, ~/.ssh, dotfiles/config.
#
# Default is a DRY RUN (only lists what would go). To actually delete:
#   bash cleanup_gpu.sh --yes
# Project folders are confirmed one by one, even with --yes.
set -uo pipefail

DELETE=0
[[ "${1:-}" == "--yes" ]] && DELETE=1

SELF_DIR="$(cd "$(dirname "$0")" && pwd)"

size() { du -sh "$1" 2>/dev/null | cut -f1; }

remove() {
  local p="$1"
  [[ -e "$p" ]] || return 0
  if (( DELETE )); then
    echo "  deleting  $p ($(size "$p"))"
    rm -rf -- "$p"
  else
    echo "  would delete  $p ($(size "$p"))"
  fi
}

echo "== GPU =="
nvidia-smi --query-gpu=name,memory.total,driver_version --format=csv,noheader 2>/dev/null || echo "  nvidia-smi not found"
echo "== Disk before =="
df -h "$HOME" | tail -1

echo
echo "== Model + package caches =="
for d in \
  "$HOME/.cache/huggingface" "$HOME/.cache/torch" "$HOME/.cache/pip" \
  "$HOME/.cache/uv" "$HOME/.cache/whisper" "$HOME/.cache/modelscope" \
  "$HOME/.ollama/models" "$HOME/.triton" \
  /workspace/.cache/huggingface /root/.cache/huggingface; do
  remove "$d"
done

echo
echo "== Conda envs (base is kept) =="
if command -v conda >/dev/null; then
  conda env list | awk 'NR>2 && $1!="base" && $1!~/^#/ {print $1}' | while read -r env; do
    [[ -z "$env" ]] && continue
    if (( DELETE )); then echo "  removing conda env $env"; conda env remove -y -n "$env" >/dev/null
    else echo "  would remove conda env $env"; fi
  done
else
  echo "  conda not installed"
fi

echo
echo "== Python virtualenvs under \$HOME and /workspace =="
find "$HOME" /workspace -maxdepth 4 -name pyvenv.cfg -not -path '*/.cache/*' 2>/dev/null \
  | while read -r cfg; do remove "$(dirname "$cfg")"; done

echo
echo "== Docker images/containers =="
if command -v docker >/dev/null; then
  if (( DELETE )); then docker system prune -a -f --volumes
  else docker system df 2>/dev/null; echo "  would run: docker system prune -a -f --volumes"; fi
else
  echo "  docker not installed"
fi

echo
echo "== Project folders (asked one at a time) =="
for root in "$HOME" /workspace; do
  [[ -d "$root" ]] || continue
  for d in "$root"/*/; do
    d="${d%/}"
    [[ -d "$d" ]] || continue
    abs="$(cd "$d" && pwd)"
    [[ "$SELF_DIR/" == "$abs/"* ]] && continue   # never delete the folder these scripts live in
    if (( DELETE )); then
      read -r -p "  delete $d ($(size "$d"))? [y/N] " ans </dev/tty
      [[ "$ans" == [yY] ]] && rm -rf -- "$d" && echo "    deleted"
    else
      echo "  candidate  $d ($(size "$d"))"
    fi
  done
done

echo
echo "== Disk after =="
df -h "$HOME" | tail -1
(( DELETE )) || echo "Dry run only. Re-run with --yes to delete."
