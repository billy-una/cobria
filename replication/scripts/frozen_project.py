"""Materializa un repositorio de referencia en su revisión congelada.

Los validadores prefieren el checkout hermano del entorno de desarrollo. En una copia
limpia de CI clonan la URL declarada y nunca ejecutan código del proyecto observado.
"""

from contextlib import contextmanager
from pathlib import Path
from tempfile import TemporaryDirectory
import subprocess
import os


@contextmanager
def frozen_project(local: Path, repository: str, revision: str):
    if os.environ.get("COBRIA_PUBLIC_BUILD") == "1":
        raise RuntimeError("La construcción pública no accede a repositorios de referencia; use la auditoría autorizada separada")
    configured = os.environ.get("COBRIA_REFERENCE_ROOT")
    if configured and not (local.is_dir() and (local / ".git").exists()):
        root = Path(configured).expanduser().resolve(strict=True)
        candidate = root / local.name
        if candidate.is_dir() and (candidate / ".git").exists():
            local = candidate
    if local.is_dir() and (local / ".git").exists():
        yield local
        return

    with TemporaryDirectory(prefix="cobria-reference-") as directory:
        target = Path(directory) / "repository"
        clone = subprocess.run(
            ["git", "clone", "--quiet", "--no-checkout", repository, str(target)],
            capture_output=True,
            text=True,
        )
        if clone.returncode:
            raise RuntimeError(clone.stderr or clone.stdout or f"No se pudo clonar {repository}")
        checkout = subprocess.run(
            ["git", "checkout", "--quiet", "--detach", revision],
            cwd=target,
            capture_output=True,
            text=True,
        )
        if checkout.returncode:
            raise RuntimeError(checkout.stderr or checkout.stdout or f"No se pudo fijar {revision}")
        yield target
