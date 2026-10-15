"""TASK 19: deterministic, irreversible raster redactions. Originals stay in TEMP.

Usage: python scripts/prepare-lion-assets.py TEMP_EXTRACTION_DIRECTORY
Requires Pillow and Poppler. No source PDFs are copied to public.
"""
import hashlib
import json
import subprocess
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

work = Path(sys.argv[1]).resolve()
source = work / 'imagens lion fitness'
repo = Path(__file__).resolve().parents[1]
target = repo / 'public/projects/lion-fitness'
target.mkdir(parents=True, exist_ok=True)
assert repo not in work.parents and work != repo, 'Use an external temporary directory'
font = ImageFont.truetype('C:/Windows/Fonts/arial.ttf', 12)
audit = []

def mask(image, box, fill='#f1f3f5', label=None):
    draw = ImageDraw.Draw(image)
    draw.rectangle(box, fill=fill)
    if label:
        draw.text(((box[0]+box[2])/2, (box[1]+box[3])/2), label,
                  fill='#667085', font=font, anchor='mm')

def export(original, name, purpose, placement, risks, edits, crop=None):
    image = Image.open(source / original).convert('RGB')
    original_size = image.size
    for box, fill, label in edits:
        mask(image, box, fill, label)
    if crop:
        image = image.crop(crop)
    # New raster serialization drops source metadata. Lossless keeps small UI text sharp.
    image.save(target / (name+'.webp'), 'WEBP', lossless=True, method=6)
    audit.append(dict(original=original, dimensions=list(original_size), format='PNG',
                      purpose=purpose, placement=placement, risks=risks,
                      suitability='sanitized public copy only' if edits or crop else 'reviewed safe raster copy',
                      public=name+'.webp', outputDimensions=list(image.size), masks=edits, crop=crop,
                      sha256=hashlib.sha256((target/(name+'.webp')).read_bytes()).hexdigest()))

export('admin/admin-dashboard.png', 'admin-overview', 'Administrative dashboard', 'Vision',
       'Customer/payment rows, revenue amounts, custom plan names; aggregate sample counts are not business results.',
       [((608,124,787,153),'#ffffff','VALOR REMOVIDO'),
        ((682,237,781,261),'#ffffff',None),
        ((818,279,1171,325),'#ffffff',None),
        ((1068,330,1173,580),'#ffffff',None),
        ((818,355,1040,372),'#ffffff',None),
        ((818,405,1040,422),'#ffffff',None),
        ((818,455,1040,472),'#ffffff',None),
        ((818,505,1040,522),'#ffffff',None),
        ((818,555,1040,575),'#ffffff',None)], (0,0,1227,590))
export('admin/admin-planos.png','plan-editor','New plan form','Operations',
       'Empty form with placeholders; no entered customer data.', [])
export('admin/admin-pix.png','pix-redacted','PIX payment flow','Operations',
       'Customer, amount, transaction identifier, functional QR and full copy/paste payment payload.',
       [((51,26,180,39),'#ffffff',None),((25,98,165,126),'#f7f9fb',None),
        ((278,80,350,104),'#f7f9fb','REMOVIDO'),((184,139,351,160),'#f7f9fb','REMOVIDO'),
        ((91,299,281,475),'#f1f3f5','PIX REMOVIDO'),
        ((21,548,352,601),'#f7f9fb','CODIGO REMOVIDO')])
export('admin/admin-cartao.png','card-redacted','Card payment form','Operations',
       'Card number including last digits, holder, expiry, CVV, CPF, customer and financial amount.',
       [((47,27,220,41),'#ffffff',None),((28,157,251,178),'#2c2526','REMOVIDO'),
        ((27,204,254,220),'#2c2526',None),((20,279,175,305),'#f7f9fb',None),
        ((193,261,266,284),'#f7f9fb',None),((309,163,555,187),'#ffffff',None),
        ((309,227,550,250),'#ffffff',None),((309,293,415,315),'#ffffff',None),
        ((463,293,551,315),'#ffffff',None),((309,357,550,380),'#ffffff',None),
        ((452,408,518,428),'#b42424',None)])
export('personal/perosnal1..png','trainer-members','Trainer member management','Training',
       'Trainer name/avatar, member names/avatars, CPFs; sample counts remain clearly contextualized.',
       [((878,11,1077,47),'#ffffff',None),
        ((34,267,230,319),'#ffffff','DADOS REMOVIDOS'),((420,277,560,307),'#ffffff',None),
        ((34,333,230,385),'#ffffff','DADOS REMOVIDOS'),((420,343,560,373),'#ffffff',None),
        ((34,398,230,450),'#ffffff','DADOS REMOVIDOS'),((420,408,560,438),'#ffffff',None),
        ((34,464,230,515),'#ffffff','DADOS REMOVIDOS'),((420,474,560,504),'#ffffff',None)])
export('personal/perosnal2.png','workout-editor','Workout prescription with sets/rest','Training',
       'Member reference in workout header.', [((169,163,275,182),'#ffffff',None)])
export('personal/perosnal3.png','exercise-library','Exercise library','Training',
       'No personal or payment fields.', [])
export('personal/personal4.png','custom-exercise','Custom exercise form','Training',
       'Empty form; example placeholders only.', [])
export('login.png','sign-in','Login form','Context documentation; not displayed',
       'Email placeholder and masked password field; password pixels removed defensively.',
       [((39,241,185,267),'#f1f5f9',None)])

poppler = Path.home()/'.cache/codex-runtimes/codex-primary-runtime/dependencies/native/poppler/Library/bin/pdftoppm.exe'
for filename, name, title in [
    ('relatorio-ativos-inativos-2026-10-14.pdf','report-members','Active and inactive member report'),
    ('relatorio-novos-alunos-2026-10-14.pdf','report-enrollment','New member report')]:
    from pypdf import PdfReader
    pdf = source/filename
    assert len(PdfReader(pdf).pages) == 1, 'Review any additional pages before export'
    prefix = work/name
    subprocess.run([str(poppler),'-png','-r','220',str(pdf),str(prefix)], check=True, capture_output=True)
    image = Image.open(str(prefix)+'-1.png').convert('RGB')
    # Coordinates follow individually inspected 110-dpi previews; double at 220 dpi.
    def redact(box, fill='#f7f9fb'):
        mask(image, tuple(v*2 for v in box), fill)
    redact((629,62,856,101), '#ffffff')
    if name == 'report-members':
        rows = [(413+i*37.6,448+i*37.6) for i in range(20)]
        columns = [(69,499),(525,624),(750,839)]
    else:
        rows = [(399+i*37.6,434+i*37.6) for i in range(20)]
        columns = [(69,257),(278,380),(399,626),(645,736)]
    for top,bottom in rows:
        for left,right in columns:
            redact((left,int(top),right,int(bottom)))
            # Clearly visible editorial redaction mark, containing no source pixels.
            redact((left+4,int(top+12),min(left+80,right),int(top+17)), '#c9d0d8')
    image.save(target/(name+'.webp'),'WEBP',lossless=True,method=6)
    audit.append(dict(original=filename, dimensions='A4, 595.28 x 841.89 pt', format='PDF, 1 page',
                      purpose=title, placement='Insights',
                      risks='Generator identity; all row names, CPF, email (where present), registration dates.',
                      suitability='sanitized raster only; original PDF excluded', public=name+'.webp',
                      outputDimensions=list(image.size),
                      sha256=hashlib.sha256((target/(name+'.webp')).read_bytes()).hexdigest()))

notes = repo/'docs/task19'
notes.mkdir(parents=True,exist_ok=True)
(notes/'asset-inventory.json').write_text(json.dumps(audit,indent=2,ensure_ascii=False),encoding='utf-8')
print(f'Prepared {len(audit)} sanitized assets. Originals remain outside the repository.')
