"""Render the actual exported PDF with the project-local verification wheel."""
import json
import sys
from pathlib import Path

root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(root / "artifacts" / "pdf-renderer"))
import pymupdf  # noqa: E402

output = root / "artifacts" / "presentation" / "pdf-rendered"
output.mkdir(parents=True, exist_ok=True)
document = pymupdf.open(root / "public" / "demo" / "OrbitCare-seven-slides.pdf")
assert len(document) == 7, "Exactly seven slides are required"
results = []
for index, page in enumerate(document):
    assert abs(page.rect.width / page.rect.height - 16 / 9) < .001, "Slides must be 16:9"
    page.get_pixmap(matrix=pymupdf.Matrix(1, 1), alpha=False).save(output / f"slide-{index + 1}.png")
    results.append({"slide": index + 1, "width_pt": page.rect.width, "height_pt": page.rect.height, "text_characters": len(page.get_text())})
(output / "verification.json").write_text(json.dumps(results, indent=2), encoding="utf-8")
print(json.dumps({"pages": len(document), "aspect_ratio": "16:9", "rendered": str(output)}, indent=2))
