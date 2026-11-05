# -*- coding: utf-8 -*-
"""Turn the existing site DATA plus original lessons into data/*.js."""
import json
import re
from pathlib import Path

from phon_verbs import all_verbs
from content_grammar import chapters, early_groups
from content_rest import vocab_units, cahier_lessons, cahier_d0_quiz, ae_content

ROOT = Path(__file__).resolve().parents[1]
HTML = ROOT / "index.html"
OUT = ROOT / "data"


def load_data():
    text = HTML.read_text(encoding="utf-8")
    m = re.search(r"const DATA=(\[.*\]);\n", text)
    if not m:
        raise SystemExit("DATA not found in index.html — already rebuilt?")
    return json.loads(m.group(1))


def emit_section(name, section):
    payload = json.dumps(section, ensure_ascii=False, separators=(",", ":"))
    (OUT / f"{name}.js").write_text(
        "window.SECTIONS=window.SECTIONS||[];window.SECTIONS.push(" + payload + ");\n",
        encoding="utf-8",
    )


def emit_section_list(name, sections):
    lines = ["window.SECTIONS=window.SECTIONS||[];"]
    for section in sections:
        lines.append("window.SECTIONS.push(" + json.dumps(section, ensure_ascii=False, separators=(",", ":")) + ");")
    (OUT / f"{name}.js").write_text("\n".join(lines) + "\n", encoding="utf-8")


def emit_path(path):
    payload = json.dumps(path, ensure_ascii=False, separators=(",", ":"))
    (OUT / "path.js").write_text("window.STUDY_PATH=" + payload + ";\n", encoding="utf-8")


LEVEL_META = [
    {"id": "A1", "name": "A1", "blurb": "Alter Ego A1, the cahier, Grammaire progressive A0–A1 and Vocabulaire progressif A1."},
    {"id": "A2", "name": "A2", "blurb": "Alter Ego A2 and its cahier, plus the first half of Grammaire progressive A2–B1 and Vocabulaire progressif A2–B1."},
    {"id": "B1", "name": "B1", "blurb": "Alter Ego B1 and its cahier, plus the rest of the A2–B1 grammar and vocabulary books."},
    {"id": "B2", "name": "B2", "blurb": "Alter Ego B2 and its cahier, Grammaire progressive B1–B2 and Vocabulaire progressif B2–C1."},
]


def placeholder(pid, name, short, color, levels, blurb):
    return {
        "id": pid,
        "name": name,
        "short": short,
        "color": color,
        "levels": levels,
        "placeholder": True,
        "blurb": blurb,
        "lessons": [],
    }


def later_levels(colors):
    """Stable ids for books that are not transcribed yet. A follow-up can fill lessons without renaming."""
    wait = "Reserved slot. The book text is not on the site yet."
    return [
        placeholder("ae-a2", "Alter Ego A2", "Livre", colors["livre"], ["A2"], wait + " Livre de l'élève, dossiers to come."),
        placeholder("ca-a2", "Cahier A2", "Cahier", colors["cahier"], ["A2"], wait + " Cahier d'activités."),
        placeholder("gr-a2b1", "Grammaire progressive A2–B1", "Grammaire", colors["gram"], ["A2", "B1"], wait + " Shared by A2 and B1; chapters will be tagged by level."),
        placeholder("vp-a2b1", "Vocabulaire progressif A2–B1", "Vocabulaire", colors["vocab"], ["A2", "B1"], wait + " Shared by A2 and B1."),
        placeholder("ae-b1", "Alter Ego B1", "Livre", colors["livre"], ["B1"], wait + " Livre de l'élève."),
        placeholder("ca-b1", "Cahier B1", "Cahier", colors["cahier"], ["B1"], wait + " Cahier d'activités."),
        placeholder("ae-b2", "Alter Ego B2", "Livre", colors["livre"], ["B2"], wait + " Livre de l'élève."),
        placeholder("ca-b2", "Cahier B2", "Cahier", colors["cahier"], ["B2"], wait + " Cahier d'activités."),
        placeholder("gr-b1b2", "Grammaire progressive B1–B2", "Grammaire", colors["gram"], ["B2"], wait + " The B1–B2 grammar book."),
        placeholder("vp-b2c1", "Vocabulaire progressif B2–C1", "Vocabulaire", colors["vocab"], ["B2"], wait + " The B2–C1 vocabulary book."),
    ]


def audio_labels(lessons):
    labels = {}
    for les in lessons:
        if not les["id"].startswith("au-"):
            continue
        for g in les["groups"]:
            for t in g.get("tracks") or []:
                labels[t["n"]] = t.get("label") or ""
    return labels


def track_group(nums, labels, note):
    tracks = []
    for n in nums:
        lab = labels.get(n) or ("Piste %d — with this part of the book" % n)
        tracks.append({"n": n, "label": lab})
    if not tracks:
        return None
    return {"name": "Pistes du CD", "note": note, "tracks": tracks}


def split_dossier(lesson):
    buckets = {"l1": [], "l2": [], "l3": [], "carnet": [], "sex": [], "delf": []}
    for g in lesson["groups"]:
        name = g["name"]
        g = dict(g)
        if g.get("pages") == []:
            g.pop("pages", None)
        if "Leçon 2" in name:
            buckets["l2"].append(g)
        elif "Leçon 3" in name:
            buckets["l3"].append(g)
        elif name.startswith("Carnet"):
            buckets["carnet"].append(g)
        elif name.startswith("S'exercer") or name.startswith("Récap"):
            buckets["sex"].append(g)
        elif name.startswith("Vers le DELF"):
            buckets["delf"].append(g)
        else:
            buckets["l1"].append(g)
    return buckets


def useful(groups):
    kept = []
    notes = []
    for g in groups:
        has = (g.get("pages") or g.get("items") or g.get("tracks") or g.get("quiz"))
        if not has:
            if g.get("note"):
                notes.append(re.sub("<[^>]+>", "", g["note"]))
            continue
        kept.append(g)
    return kept, " ".join(notes)


def make_ae_lesson(lid, label, name, summary, groups, extra, labels, track_nums):
    groups, stray = useful(groups)
    groups = list(groups) + extra
    tg = track_group(track_nums, labels, "CD tracks for this part of the book. A few are pinned to an activity; the later ones are placed with the dossier they belong to.")
    if tg:
        groups = [tg] + groups
    if stray and not summary:
        summary = stray
    elif stray:
        summary = summary + " " + stray
    return {
        "id": lid,
        "label": label,
        "name": name,
        "summary": summary.strip(),
        "original": True,
        "groups": groups,
    }


def build_alterego(sec, labels):
    by_id = {l["id"]: l for l in sec["lessons"]}
    audio = [l for l in sec["lessons"] if l["id"].startswith("au-")]
    content = ae_content()
    ranges = {}
    # 140–207 across dossiers 6–9, four chunks each
    base = 140
    for d in (6, 7, 8, 9):
        ranges["ae-d%dl1" % d] = list(range(base, base + 5))
        ranges["ae-d%dl2" % d] = list(range(base + 5, base + 9))
        ranges["ae-d%dl3" % d] = list(range(base + 9, base + 13))
        ranges["ae-d%d-carnet" % d] = list(range(base + 13, base + 15))
        ranges["ae-d%d-sexercer" % d] = [base + 15]
        ranges["ae-d%d-delf" % d] = [base + 16]
        base += 17
    # 140+17*4 = 208, so last is 207. Check:
    # d6: 140-156 (17), d7 157-173, d8 174-190, d9 191-207. Yes 191+16=207.

    titles = {
        6: ("Voyage, voyages", [
            ("l1", "Au fil des saisons", "Seasons, weather, and how you feel."),
            ("l2", "La France des trois océans", "Locating a place a long way from Paris."),
            ("l3", "Une capitale européenne", "A visit, a holiday note, and être en train de."),
            ("carnet", "Carnet de voyage", "Plan a short stay somewhere French-speaking."),
            ("sex", "S'exercer", "Mixed drills for dossier 6."),
            ("delf", "Vers le DELF A1", "Short listening-style prompts, plus the book's DELF pages."),
        ]),
        7: ("C'est mon choix", [
            ("l1", "Question de goût", "Food preferences and comparison."),
            ("l2", "Quel look ?", "Clothes, sizes, and a small opinion."),
            ("l3", "Des cadeaux pour tous", "Choosing a present."),
            ("carnet", "Carnet de voyage", "Colour and design, in a few reusable lines."),
            ("sex", "S'exercer", "Mixed drills for dossier 7."),
            ("delf", "Vers le DELF A1", "Short prompts on taste, clothes and gifts."),
        ]),
        8: ("Vivre en ville ?", [
            ("l1", "Achats citadins", "Food shopping in town."),
            ("l2", "Un dîner en ville", "Ordering a meal. Book pages 158–161 are not in this copy."),
            ("l3", "Changement de décor", "How a place used to be, and what changed."),
            ("carnet", "Carnet de voyage", "A city square, before and after."),
            ("sex", "S'exercer", "Mixed drills for dossier 8."),
            ("delf", "Vers le DELF A1", "Short prompts on shops, a restaurant and the past."),
        ]),
        9: ("Lieux de vie", [
            ("l1", "Une maison de rêve", "Rooms and a small home improvement."),
            ("l2", "Un toit pour moi", "Reading a housing ad."),
            ("l3", "Cherchons colocataire", "Flatmates, rules, and qui / que."),
            ("carnet", "Carnet de voyage", "Two ways of living."),
            ("sex", "S'exercer", "Mixed drills for dossier 9."),
            ("delf", "Vers le DELF A1", "Short prompts on housing."),
        ]),
    }
    suffix = {"l1": "l1", "l2": "l2", "l3": "l3", "carnet": "-carnet", "sex": "-sexercer", "delf": "-delf"}
    label_prefix = {"l1": "Leçon 1", "l2": "Leçon 2", "l3": "Leçon 3", "carnet": "Carnet de voyage", "sex": "S'exercer", "delf": "Vers le DELF A1"}

    new_lessons = []
    for d in (6, 7, 8, 9):
        buckets = split_dossier(by_id["bk-d%d" % d])
        dossier_name = titles[d][0]
        for key, lname, summary in titles[d][1]:
            lid = "ae-d%d%s" % (d, suffix[key])
            lesson = make_ae_lesson(
                lid,
                "Dossier %d · %s" % (d, label_prefix[key]),
                lname,
                summary + " Dossier : " + dossier_name + ".",
                buckets[key],
                content.get(lid, []),
                labels,
                ranges[lid],
            )
            new_lessons.append(lesson)

    # attach leftover early-CD tracks that were only in the audio buckets
    gaps = {
        "ae-d0": list(range(12, 23)),
        "ae-d1-carnet": [55, 56],
        "ae-d1-sexercer": [57, 58],
        "ae-d2-carnet": [85, 86],
        "ae-d2-sexercer": [87, 88],
        "ae-d2-delf": [89, 90],
        "ae-d3-carnet": [104, 105],
        "ae-d3-sexercer": [106, 107],
        "ae-d4l1": [115],
        "ae-d4-sexercer": [123, 124],
        "ae-d4-delf": [125],
        "ae-d5l1": [129],
        "ae-d5l3": [136],
        "bk-annexes": [23, 24],
    }
    ordered_ids = ["ae-d0"]
    for d in range(1, 6):
        ordered_ids += ["ae-d%dl1" % d, "ae-d%dl2" % d, "ae-d%dl3" % d,
                        "ae-d%d-carnet" % d, "ae-d%d-sexercer" % d, "ae-d%d-delf" % d]
    ordered_ids += [l["id"] for l in new_lessons]
    ordered_ids += ["bk-front", "bk-annexes"]

    lessons = []
    new_by = {l["id"]: l for l in new_lessons}
    for lid in ordered_ids:
        les = new_by.get(lid) or by_id[lid]
        if lid in gaps:
            have = set()
            for g in les["groups"]:
                for t in g.get("tracks") or []:
                    have.add(t["n"])
            extra_nums = [n for n in gaps[lid] if n not in have]
            tg = track_group(extra_nums, labels, "Tracks that sit next to this lesson on the CD.")
            if tg:
                les["groups"] = list(les["groups"]) + [tg]
        if lid == "bk-front":
            les["label"] = "Ouverture"
            les["name"] = "Pages 1–12"
            les["summary"] = "Cover, contents and how the book is organised. Page scans only."
        if lid == "bk-annexes":
            les["label"] = "Annexes"
            les["name"] = "Phonie, lexique, grammaire, transcriptions"
            les["summary"] = "The back of the book, as page scans. Tracks 23–24 are the phonics pages."
        lessons.append(les)

    sec = dict(sec)
    sec["name"] = "Alter Ego A1"
    sec["short"] = "Livre"
    sec["blurb"] = "Dossiers 0–5 keep the line-by-line transcription. Dossiers 6–9 are original study notes on each lesson, with the page scans and the CD tracks. The duplicate scan-only copies of dossiers 3–5 are folded into the transcribed lessons."
    sec["lessons"] = lessons
    return sec, audio


def build_audio(audio_lessons):
    return {
        "id": "audio",
        "name": "CD audio",
        "short": "CD",
        "color": "#5C6B73",
        "blurb": "All 207 tracks in order. Tracks are also attached to the dossier they belong to.",
        "lessons": audio_lessons,
    }


def build_grammar(sec):
    by_id = {l["id"]: l for l in sec["lessons"]}
    for lid, groups in early_groups().items():
        by_id[lid]["groups"] = list(by_id[lid]["groups"]) + groups
        if (by_id[lid].get("summary") or "").strip() == "" or len(by_id[lid]["groups"][0].get("items") or []) < 15:
            pass
    fresh = {l["id"]: l for l in chapters()}
    seq = []
    for n in range(1, 10):
        seq.append("gr-%d" % n)
    seq.append("gr-recap1")
    for n in range(10, 15):
        seq.append("gr-%d" % n)
    for n in range(15, 21):
        seq.append("gr-%d" % n)
    seq.append("gr-recap2")
    for n in range(21, 28):
        seq.append("gr-%d" % n)
    seq.append("gr-recap3")
    for n in range(28, 35):
        seq.append("gr-%d" % n)
    seq.append("gr-recap4")
    for n in range(35, 43):
        seq.append("gr-%d" % n)
    seq.append("gr-recap5")
    for n in range(43, 50):
        seq.append("gr-%d" % n)
    seq.append("gr-recap6")
    for n in range(50, 55):
        seq.append("gr-%d" % n)
    seq.append("gr-recap7")
    for n in range(55, 61):
        seq.append("gr-%d" % n)
    seq.append("gr-recap8")
    seq += ["gr-talk", "gr-test"]
    lessons = []
    for lid in seq:
        if lid in by_id:
            lessons.append(by_id[lid])
        elif lid in fresh:
            lessons.append(fresh[lid])
        else:
            raise SystemExit("missing grammar lesson " + lid)
    # fix inconsistent nothing
    sec = dict(sec)
    sec["name"] = "Grammaire progressive"
    sec["short"] = "Grammaire"
    sec["blurb"] = "All 60 chapters and 8 bilans. Chapters 1–14 keep the transcribed examples and the scans. From chapter 15 on, each chapter is an original lesson with examples and interactive drills. The printed answer key is not copied."
    sec["lessons"] = lessons
    return sec


def build_vocab(sec):
    lessons = []
    for les in sec["lessons"]:
        les = dict(les)
        les["label"] = re.sub(r"^Chapitre", "Unité", les["label"])
        lessons.append(les)
    lessons.extend(vocab_units())
    sec = dict(sec)
    sec["name"] = "Vocabulaire progressif"
    sec["short"] = "Vocabulaire"
    sec["blurb"] = "All 28 units. Units 1–7 keep the transcribed word lists and the scans. Units 8–28 are original A1 lists on the same topics, with a short drill at the end of each one."
    sec["lessons"] = lessons
    return sec


def build_cahier(sec):
    lessons = []
    for les in sec["lessons"]:
        les = dict(les)
        les["groups"] = list(les["groups"])
        if les["id"] == "ca-d0":
            les["groups"].append(cahier_d0_quiz())
        if les["id"] == "ca-d1-companion":
            les["label"] = "Dossier 1 · Aide-mémoire"
            les["summary"] = "Vocabulary and grammar reminders for dossier 1, kept from the earlier notes. The exercises are in the next lesson."
        if les["id"] == "ca-d2-companion":
            les["label"] = "Dossier 2 · Aide-mémoire"
            les["summary"] = "Vocabulary and grammar reminders for dossier 2. The exercises are in the next lesson."
        lessons.append(les)
    # insert exercise lessons after the matching companion / d0
    extras = {l["id"]: l for l in cahier_lessons()}
    ordered = []
    for les in lessons:
        ordered.append(les)
        if les["id"] == "ca-d1-companion":
            ordered.append(extras.pop("ca-d1-ex"))
        if les["id"] == "ca-d2-companion":
            ordered.append(extras.pop("ca-d2-ex"))
    for n in range(3, 10):
        ordered.append(extras.pop("ca-d%d-ex" % n))
    if extras:
        raise SystemExit("unplaced cahier " + ",".join(extras))
    sec = dict(sec)
    sec["name"] = "Cahier d'activités"
    sec["short"] = "Cahier"
    sec["blurb"] = "Dossier 0 is the worked cahier, now also drillable. Dossiers 1–9 are original exercises on the same skills. Scans c004–c031 are attached to dossiers 0–2; later cahier pages were never added to this repository."
    sec["lessons"] = ordered
    return sec


def build_verbs():
    return {
        "id": "verbs",
        "name": "100 verbes",
        "short": "Verbes",
        "color": "#6E4B9A",
        "blurb": "A conjugation reference for the hundred verbs an A1 course actually uses: present, passé composé, imparfait, futur simple and impératif.",
        "lessons": [{
            "id": "verbs-100",
            "label": "Référence",
            "name": "Cent verbes essentiels",
            "summary": "Search a verb and open it. Tap a form to hear it. Where the passé composé uses être, (e) and (e)s show the feminine and plural agreement.",
            "groups": [],
            "verbs": all_verbs(),
        }],
    }


def study_path():
    """Keyed by level. A2, B1 and B2 stay empty until those books are transcribed."""
    def step(n, title, focus, ae, ca, gr, vp, also=None):
        return {"n": n, "title": title, "focus": focus, "ae": ae, "ca": ca, "gr": gr, "vp": vp, "also": also or []}
    def ae(d):
        if d == 0:
            return ["ae-d0"]
        return ["ae-d%dl1" % d, "ae-d%dl2" % d, "ae-d%dl3" % d, "ae-d%d-carnet" % d, "ae-d%d-sexercer" % d, "ae-d%d-delf" % d]
    steps = [
        step(0, "Découverte", "Alphabet, greetings, être, nationalities, numbers to 20.",
             ae(0), ["ca-d0"], ["gr-1", "gr-4", "gr-5", "gr-10"], ["vp-1"], ["sons-alpha", "num-100"]),
        step(1, "Les uns, les autres", "People, tu/vous, avoir, -er verbs, possessives.",
             ae(1), ["ca-d1-companion", "ca-d1-ex"],
             ["gr-2", "gr-6", "gr-7", "gr-8", "gr-14", "gr-16", "gr-19", "gr-20"],
             ["vp-2", "vp-5", "vp-17"]),
        step(2, "La ville", "Places, il y a, directions, a hotel.",
             ae(2), ["ca-d2-companion", "ca-d2-ex"],
             ["gr-12", "gr-13", "gr-21", "gr-22", "gr-23", "gr-24"],
             ["vp-23", "vp-24", "vp-25"]),
        step(3, "Goûts et famille", "Likes, family, adjective agreement.",
             ae(3), ["ca-d3-ex"],
             ["gr-2", "gr-3", "gr-9", "gr-17", "gr-26", "gr-27"],
             ["vp-2", "vp-3", "vp-4", "vp-8"]),
        step(4, "La journée", "Time, dates, daily routine, reflexive verbs.",
             ae(4), ["ca-d4-ex"],
             ["gr-9", "gr-28", "gr-29", "gr-40"],
             ["vp-11", "vp-15"]),
        step(5, "Le passé", "A celebration, news, and the passé composé.",
             ae(5), ["ca-d5-ex"],
             ["gr-44", "gr-45", "gr-46", "gr-47", "gr-recap6"],
             ["vp-3", "vp-27"]),
        step(6, "Voyages", "Seasons, weather, a far-away place, a postcard.",
             ae(6), ["ca-d6-ex"],
             ["gr-22", "gr-30", "gr-43", "gr-50"],
             ["vp-21", "vp-22", "vp-26"]),
        step(7, "Choix", "Taste, clothes, presents, comparison.",
             ae(7), ["ca-d7-ex"],
             ["gr-31", "gr-33", "gr-34"],
             ["vp-8", "vp-9", "vp-14"]),
        step(8, "En ville, pour de vrai", "Shops, a restaurant, a neighbourhood that changed.",
             ae(8), ["ca-d8-ex"],
             ["gr-32", "gr-47", "gr-49"],
             ["vp-12", "vp-13", "vp-23"]),
        step(9, "Où habiter", "Rooms, a housing ad, a flatmate, qui and que.",
             ae(9), ["ca-d9-ex"],
             ["gr-55", "gr-56", "gr-57", "gr-60", "gr-recap8"],
             ["vp-10", "vp-11"]),
    ]
    return {"A1": steps, "A2": [], "B1": [], "B2": []}


def retitle(sec, **kwargs):
    sec = dict(sec)
    sec.update(kwargs)
    return sec


def main():
    data = load_data()
    by = {s["id"]: s for s in data}
    labels = audio_labels(by["alterego"]["lessons"])
    alter, audio_lessons = build_alterego(by["alterego"], labels)
    audio = build_audio(audio_lessons)
    cahier = build_cahier(by["cahier"])
    grammar = build_grammar(by["grammaire"])
    vocab = build_vocab(by["vocab-prog"])
    verbs = build_verbs()
    # lighter blurbs on the reference banks
    sons = retitle(by["sons"], blurb="Letter names, accents, and the sounds you need before dossier 0.")
    pron = retitle(by["pron"], name="Prononciation", short="Sons",
                   blurb="Vowels, consonants, silent letters, liaison and rhythm. The extra lessons repeat the same rules from another angle.")
    nombres = retitle(by["nombres"], blurb="0 to 100, the big numbers, and a phone number.")
    ref = retitle(by["grammar"], name="Grammaire — mémo", short="Mémo",
                  blurb="A compact reference for être, avoir, the tenses and a few pronouns. The chapter-by-chapter course is under Grammaire progressive.")
    themes = retitle(by["vocab"], name="Mots par thème", short="Thèmes",
                     blurb="Four homemade theme lists, plus the dictionary of every phrase on the site.")

    for sec in (alter, cahier, grammar, vocab, verbs, ref, pron, sons, nombres, themes, audio):
        sec["level"] = "A1"
    order = [
        ("alterego", alter),
        ("cahier", cahier),
        ("grammaire", grammar),
        ("vocab-prog", vocab),
        ("verbs", verbs),
        ("grammar", ref),
        ("pron", pron),
        ("sons", sons),
        ("nombres", nombres),
        ("vocab", themes),
        ("audio", audio),
    ]
    colors = {
        "livre": alter["color"],
        "cahier": cahier["color"],
        "gram": grammar["color"],
        "vocab": vocab["color"],
    }
    OUT.mkdir(exist_ok=True)
    for old in OUT.glob("*.js"):
        old.unlink()
    for name, sec in order:
        emit_section(name, sec)
        print(name, "lessons", len(sec["lessons"]), "bytes", (OUT / (name + ".js")).stat().st_size)
    emit_section_list("levels", later_levels(colors))
    (OUT / "levels.js").write_text(
        (OUT / "levels.js").read_text(encoding="utf-8")
        + "window.LEVELS=" + json.dumps(LEVEL_META, ensure_ascii=False, separators=(",", ":")) + ";\n",
        encoding="utf-8",
    )
    emit_path(study_path())
    print("path", (OUT / "path.js").stat().st_size)


if __name__ == "__main__":
    main()
