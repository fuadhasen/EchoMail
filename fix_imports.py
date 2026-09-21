from pathlib import Path
import re

backend = Path("backend")

modules = {
    p.stem
    for p in backend.glob("*.py")
    if p.stem != "__init__"
}

for path in backend.glob("*.py"):
    text = path.read_text(encoding="utf-8")
    original = text

    for module in modules:
        text = re.sub(
            rf"(?m)^from {re.escape(module)} import ",
            f"from backend.{module} import ",
            text,
        )

        text = re.sub(
            rf"(?m)^import {re.escape(module)}$",
            f"import backend.{module}",
            text,
        )

    if text != original:
        path.write_text(text, encoding="utf-8")
        print(f"Updated: {path}")

print("Done.")
