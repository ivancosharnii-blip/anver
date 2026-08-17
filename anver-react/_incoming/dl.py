# Временный: скачивает документы (скатерти) из Telegram по file_id
import json, urllib.request, os

TOKEN = "8014861833:AAF02SPPRDKhGYJSVw6j0u_JjkuOYzSG0ac"
docs = json.load(open("_incoming/docs.json", encoding="utf-8"))
outdir = "_incoming/telegram"
os.makedirs(outdir, exist_ok=True)

def get(url):
    with urllib.request.urlopen(url, timeout=30) as r:
        return r.read()

for i, d in enumerate(docs, 1):
    fid = d["id"]
    # getFile -> file_path
    resp = json.loads(get(f"https://api.telegram.org/bot{TOKEN}/getFile?file_id={fid}"))
    if not resp.get("ok"):
        print(i, "getFile error:", resp.get("description"))
        continue
    fp = resp["result"]["file_path"]
    data = get(f"https://api.telegram.org/file/bot{TOKEN}/{fp}")
    out = f"{outdir}/scatter-{i}.png"
    open(out, "wb").write(data)
    print(f"{out}  {len(data)} bytes  <- {fp}")
