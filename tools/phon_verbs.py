# -*- coding: utf-8 -*-
"""Respelling for new cards, and conjugations for the verb reference.

The respelling is an English-speaker hint. The speaker button is the real model.
"""
import re

SPECIAL = {
    "je": "zhuh", "tu": "tew", "il": "eel", "elle": "ell", "on": "ohn",
    "nous": "noo", "vous": "voo", "ils": "eel", "elles": "ell",
    "le": "luh", "la": "lah", "les": "lay", "un": "uhn", "une": "ewn", "des": "day",
    "du": "dew", "au": "oh", "aux": "oh", "de": "duh", "et": "ay", "est": "eh",
    "ai": "ay", "a": "ah", "as": "ah", "ont": "ohn", "avez": "ah-VAY", "avons": "ah-VOHN",
    "suis": "swee", "es": "eh", "sommes": "sum", "êtes": "et", "sont": "sohn",
    "ne": "nuh", "pas": "pah", "plus": "plew", "que": "kuh", "qui": "kee", "quoi": "kwah",
    "dans": "dahn", "sur": "sewr", "sous": "soo", "avec": "ah-VEK", "pour": "poor",
    "par": "par", "mais": "meh", "très": "treh", "bien": "byan", "bon": "bohn",
    "oui": "wee", "non": "nohn", "où": "oo", "ou": "oo", "en": "ahn", "y": "ee",
    "ce": "suh", "cet": "set", "cette": "set", "ces": "say",
    "mon": "mohn", "ma": "mah", "mes": "may", "ton": "tohn", "ta": "tah", "tes": "tay",
    "son": "sohn", "sa": "sah", "ses": "say", "notre": "NOH-truh", "votre": "VOH-truh",
    "leur": "luhr", "leurs": "luhr", "chez": "shay", "vers": "vehr", "sans": "sahn",
    "aujourd'hui": "oh-zhoor-DWEE", "demain": "duh-MAN", "hier": "yehr",
    "bonjour": "bohn-ZHOOR", "bonsoir": "bohn-SWAHR", "salut": "sah-LEW",
    "merci": "mair-SEE", "s'il": "seel", "plaît": "pleh", "voilà": "vwah-LAH",
    "c'est": "seh", "il": "eel", "elle": "ell", "aussi": "oh-SEE", "alors": "ah-LOR",
    "donc": "dohnk", "car": "kar", "comme": "kum", "tout": "too", "tous": "toos",
    "toute": "toot", "toutes": "toot", "peu": "puh", "trop": "troh", "assez": "ah-SAY",
    "encore": "ahn-KOR", "déjà": "day-ZHAH", "jamais": "zhah-MEH", "toujours": "too-ZHOOR",
    "ici": "ee-SEE", "là": "lah", "maintenant": "man-teh-NAHN", "après": "ah-PREH",
    "avant": "ah-VAHN", "pendant": "pahn-DAHN", "depuis": "duh-PWEE",
    "petit": "puh-TEE", "petite": "puh-TEET", "grand": "grahn", "grande": "grahnd",
    "français": "frahn-SEH", "française": "frahn-SEZ", "france": "frahns",
    "paris": "pah-REE", "madame": "mah-DAM", "monsieur": "muh-SYUH", "mademoiselle": "mad-mwah-ZEL",
    "je suis": "zhuh swee", "j'ai": "zhay", "il y a": "eel ee ah",
    "s'il vous plaît": "seel voo PLEH", "s'il te plaît": "seel tuh PLEH",
    "qu'est-ce que": "kess-kuh", "qu'est-ce qui": "kess-kee", "est-ce que": "ess-kuh",
    "n'est": "neh", "j'habite": "zhah-BEET", "j'aime": "zhem", "j'adore": "zhah-DOR",
}


def _respell_stem(w):
    w = w.replace("ç", "s").replace("œ", "eu").replace("æ", "ae")
    w = w.replace("à", "a").replace("â", "a").replace("î", "i").replace("ï", "i")
    w = w.replace("û", "u").replace("ù", "u").replace("ô", "o")
    # digraphs, longest first
    rules = [
        ("eau", "oh"), ("au", "oh"), ("oi", "wah"), ("ou", "oo"),
        ("ien", "yan"), ("ein", "an"), ("ain", "an"), ("aim", "an"),
        ("oin", "wan"), ("on", "ohn"), ("om", "ohn"),
        ("an", "ahn"), ("am", "ahn"), ("en", "ahn"), ("em", "ahn"),
        ("un", "uhn"), ("um", "uhn"), ("in", "an"), ("im", "an"), ("yn", "an"), ("ym", "an"),
        ("eu", "uh"), ("œu", "uh"), ("ai", "eh"), ("ei", "eh"), ("ê", "eh"), ("è", "eh"), ("é", "ay"),
        ("ch", "sh"), ("ph", "f"), ("gn", "ny"), ("qu", "k"), ("gu", "g"),
        ("ill", "y"), ("ll", "l"),
        ("j", "zh"), ("ç", "s"),
    ]
    # Don't apply nasal if a vowel follows the n/m inside the word later — handled crudely
    # by only replacing when not followed by a vowel. Do it with a scanner.
    out = []
    i = 0
    vowels = set("aeiouyéèêëàâîïôùû")
    while i < len(w):
        if w[i] in "h" and i == 0:
            i += 1
            continue
        matched = False
        for src, dst in rules:
            if w.startswith(src, i):
                nxt = w[i + len(src):i + len(src) + 1]
                nasal = src in {"ien", "ein", "ain", "aim", "oin", "on", "om", "an", "am", "en", "em", "un", "um", "in", "im", "yn", "ym"}
                if nasal and nxt and nxt in vowels and nxt not in "e":
                    matched = False
                else:
                    # -en- before vowel is often not nasal (tenir) — skip if vowel follows
                    if nasal and nxt and nxt in vowels:
                        matched = False
                    else:
                        out.append(dst)
                        i += len(src)
                        matched = True
                if matched:
                    break
        if matched:
            continue
        ch = w[i]
        table = {
            "é": "ay", "è": "eh", "ê": "eh", "ë": "eh",
            "à": "a", "â": "a", "ù": "ew", "û": "ew", "u": "ew",
            "ô": "oh", "o": "oh", "a": "ah", "e": "uh", "i": "ee", "y": "ee",
            "c": "k", "g": "g", "r": "r", "s": "s", "t": "t", "d": "d",
            "p": "p", "b": "b", "f": "f", "v": "v", "z": "z", "n": "n", "m": "m",
            "l": "l", "x": "ks", "k": "k", "w": "w",
        }
        # soft g/c
        nxt = w[i + 1] if i + 1 < len(w) else ""
        if ch == "g" and nxt in "eiéèêy":
            out.append("zh")
        elif ch == "c" and nxt in "eiéèêy":
            out.append("s")
        elif ch == "s" and i > 0 and w[i - 1] in vowels and nxt in vowels:
            out.append("z")
        else:
            out.append(table.get(ch, ch))
        i += 1
    return "".join(out)


def phon_word(w):
    raw = w
    w = w.lower().replace("’", "'")
    w = w.strip(".,!?;:«»\"()[]")
    if not w:
        return ""
    if w in SPECIAL:
        return SPECIAL[w]
    prefix = ""
    m = re.match(r"^(j'|l'|n'|d'|m'|t'|s'|c'|qu')(.+)$", w)
    if m:
        pref = {"j'": "zh", "l'": "l", "n'": "n", "d'": "d", "m'": "m", "t'": "t", "s'": "s", "c'": "s", "qu'": "k"}[m.group(1)]
        rest = m.group(2)
        if rest in SPECIAL:
            return (pref + SPECIAL[rest]).strip()
        prefix = pref
        w = rest
    # silent endings
    core = w
    if len(core) > 3 and core.endswith("ent") and not core.endswith(("ment", "tient")):
        core = core[:-3]
    elif len(core) > 2 and core[-1] in "sdtxzp" and core[-2] not in "éèêàâ":
        # keep c, r, f, l (caReFuL) and consonants after consonant
        if core[-2] in "aeiouyàâéèêëùûîï":
            if core[-1] in "sdtxz":
                core = core[:-1]
            elif core[-1] == "p" and not core.endswith("cap"):
                core = core[:-1]
    # final mute e
    mute_e = core.endswith("e") and not core.endswith(("é", "ée")) and len(core) > 2 and core[-2] not in "aeiouy"
    if mute_e:
        core = core[:-1]
    spelled = _respell_stem(core)
    # stress last chunk
    if len(spelled) > 3:
        spelled = spelled[:-3] + spelled[-3:].upper() if False else spelled
    token = (prefix + spelled) if prefix and not prefix.endswith(" ") else prefix + spelled
    # capitalise last 3 letters as a stress hint when the word is long
    if len(token) >= 5 and token[-1].isalpha():
        token = token[:-3] + token[-3:].upper()
    return token


def phon(text):
    if text is None:
        return ""
    s = str(text).replace("’", "'")
    s = re.sub(r"[«»\"“”]", "", s)
    # multiword specials
    low = s.lower()
    for phrase in ("s'il vous plaît", "s'il te plaît", "qu'est-ce que", "qu'est-ce qui", "est-ce que", "il y a", "je suis", "aujourd'hui"):
        if phrase in low:
            low = low.replace(phrase, " " + SPECIAL[phrase] + " ")
            # fall through word by word on the remainder — easier to just split original
    parts = re.split(r"(\s+)", s)
    out = []
    i = 0
    tokens = s.split()
    # phrase pass
    joined = " ".join(t.lower().strip(".,!?;:") for t in tokens)
    # replace known phrases in the token list
    tl = [t for t in tokens]
    low_tl = [t.lower().strip(".,!?;:«»") for t in tl]
    i = 0
    acc = []
    phrases = sorted([p for p in SPECIAL if " " in p], key=len, reverse=True)
    while i < len(low_tl):
        hit = False
        for p in phrases:
            bits = p.split()
            if low_tl[i:i + len(bits)] == bits:
                acc.append(SPECIAL[p])
                i += len(bits)
                hit = True
                break
        if not hit:
            acc.append(phon_word(tl[i]))
            i += 1
    return " ".join(x for x in acc if x)


def card(fr, en, ph=None):
    return [fr, ph if ph is not None else phon(fr), en]


def cloze(q, a, *alts, hint=""):
    d = {"t": "cloze", "q": q, "a": a}
    if alts:
        d["alt"] = list(alts)
    if hint:
        d["hint"] = hint
    return d


def choice(q, opts, a):
    return {"t": "choice", "q": q, "opts": list(opts), "a": a}


def translate(q, a, *alts):
    d = {"t": "translate", "q": q, "a": a}
    if alts:
        d["alt"] = list(alts)
    return d


# ---------- conjugations ----------

PRONOUNS = ["je", "tu", "il", "nous", "vous", "ils"]


def _je(stem_vowel, form):
    """Attach je/j' to a verb form that does not include the pronoun."""
    if form[:1] in "aàâeéèêiîoôuûyh" or form.startswith(("eu",)):
        # h is usually mute, so j'habite
        return "j'" + form
    return "je " + form


def _with_pronouns(forms):
    out = []
    for p, f in zip(PRONOUNS, forms):
        if p == "je":
            out.append(_je("", f))
        elif p == "il":
            out.append("il/elle " + f)
        elif p == "ils":
            out.append("ils/elles " + f)
        else:
            out.append(p + " " + f)
    return out


def _pp_note_etre(pp):
    return pp + "(e)(s)"


# classes return dict of lists WITHOUT pronouns, plus aux, pp, note, imperative forms without pronouns

def er_regular(inf, pp=None):
    stem = inf[:-2]
    # manger / commencer adjustments
    nous = stem + "ons"
    if stem.endswith("g"):
        nous = stem + "eons"
    if stem.endswith("c"):
        nous = stem[:-1] + "çons"
    forms = [stem + "e", stem + "es", stem + "e", nous, stem + "ez", stem + "ent"]
    fut_stem = inf
    pc_stem = stem + "é" if pp is None else pp
    return {
        "present": forms,
        "futur_stem": fut_stem,
        "pp": pc_stem,
        "imparfait_stem": nous[:-3] if False else (stem + "e" if stem.endswith("g") else (stem[:-1] + "ç" if stem.endswith("c") else stem)),
        "imperatif": [stem + "e", nous, stem + "ez"],
    }


def er_accent_grave(inf):
    """acheter → achète / achetons / achèterai."""
    stem = inf[:-2]  # achet
    # vowel before last consonant doubles the accent pattern: è on the e before the consonant
    # stem without last consonant's preceding e: ach + t, the e is the one before t
    if not stem.endswith("e") and "e" in stem:
        pass
    # Find the e that changes: the last 'e' in the stem before the final consonant cluster
    m = re.match(r"^(.*[bcdfghjklmnpqrstvwxz])e([bcdfghjklmnpqrstvwxz]+)$", stem)
    if not m:
        m = re.match(r"^(.*)e([bcdfghjklmnpqrstvwxz]+)$", stem)
    pre, cons = m.group(1), m.group(2)
    je = pre + "è" + cons + "e"
    nous = stem + "ons"
    return {
        "present": [je, pre + "è" + cons + "es", je, nous, stem + "ez", pre + "è" + cons + "ent"],
        "futur_stem": pre + "è" + cons + "er",
        "pp": stem + "é",
        "imparfait_stem": stem,
        "imperatif": [je, nous, stem + "ez"],
    }


def er_accent_aigu(inf):
    """préférer → préfère / préférons / préférerai."""
    stem = inf[:-2]
    m = re.match(r"^(.*)é([bcdfghjklmnpqrstvwxz]+)$", stem)
    pre, cons = m.group(1), m.group(2)
    je = pre + "è" + cons + "e"
    nous = stem + "ons"
    return {
        "present": [je, pre + "è" + cons + "es", je, nous, stem + "ez", pre + "è" + cons + "ent"],
        "futur_stem": inf,
        "pp": stem + "é",
        "imparfait_stem": stem,
        "imperatif": [je, nous, stem + "ez"],
    }


def er_yer(inf, future_i=True):
    """essayer → essaie / essayons / essaierai.  envoyer is special."""
    stem = inf[:-2]  # essay, nettoi? nettoyer stem nettoy
    ystem = stem[:-1]  # essa / nettoi wait stem is essayer-er = essay, drop y = essa
    base = stem[:-1]  # essa
    je = base + "ie"
    nous = stem + "ons"
    fut = (base + "ier") if future_i else inf
    return {
        "present": [je, base + "ies", je, nous, stem + "ez", base + "ient"],
        "futur_stem": fut,
        "pp": stem[:-1] + "yé" if stem.endswith("y") else stem + "é",
        "imparfait_stem": stem,
        "imperatif": [je, nous, stem + "ez"],
    }


def ir_iss(inf):
    stem = inf[:-2]
    return {
        "present": [stem + "is", stem + "is", stem + "it", stem + "issons", stem + "issez", stem + "issent"],
        "futur_stem": inf,
        "pp": stem + "i",
        "imparfait_stem": stem + "iss",
        "imperatif": [stem + "is", stem + "issons", stem + "issez"],
    }


def ir_short(inf, pp, aux="avoir"):
    """partir → pars/partons. dormir, sortir, sentir, mentir."""
    stem = inf[:-2]  # part
    # dormir stem dorm, je dors (drop last t? dormir: dors not dorms)
    if stem.endswith("t"):
        je = stem[:-1] + "s"  # pars? part[:-1]+s = pars. sortir stem sort → sors. Yes.
        il = stem[:-1]
    else:
        # dormir stem dorm → dors
        je = stem[:-1] + "s"
        il = stem[:-1]
    return {
        "present": [je, je, il, stem + "ons", stem + "ez", stem + "ent"],
        "futur_stem": inf,
        "pp": pp,
        "imparfait_stem": stem,
        "imperatif": [je, stem + "ons", stem + "ez"],
        "aux": aux,
    }


FUT_END = ["ai", "as", "a", "ons", "ez", "ont"]
IMP_END = ["ais", "ais", "ait", "ions", "iez", "aient"]


def expand(spec, aux="avoir"):
    pres = spec["present"]
    fut = [spec["futur_stem"] + e for e in FUT_END]
    # futur_stem may already be full infinitive-like "parler" + ai = parlerai. Good.
    # For être etc we pass fully built lists instead.
    imp_stem = spec["imparfait_stem"]
    imp = [imp_stem + e for e in IMP_END]
    pp = spec["pp"]
    return pres, fut, imp, pp, spec.get("imperatif"), spec.get("aux", aux)


IRREG = {}


def put(inf, present, futur, imparfait, pp, imperatif, aux="avoir", note=""):
    IRREG[inf] = {
        "present": present, "futur": futur, "imparfait": imparfait,
        "pp": pp, "imperatif": imperatif, "aux": aux, "note": note,
    }


def _std_imp(stem):
    return [stem + e for e in IMP_END]


# hand-built irregulars (forms WITHOUT pronouns)
put("aller",
    ["vais", "vas", "va", "allons", "allez", "vont"],
    ["irai", "iras", "ira", "irons", "irez", "iront"],
    _std_imp("all"),
    "allé", ["va", "allons", "allez"], aux="être",
    note="Movement verb: passé composé with être. Feminine: allée, allés, allées.")
put("avoir",
    ["ai", "as", "a", "avons", "avez", "ont"],
    ["aurai", "auras", "aura", "aurons", "aurez", "auront"],
    _std_imp("av"),
    "eu", ["aie", "ayons", "ayez"],
    note="Also the auxiliary for most passé composé forms.")
put("être",
    ["suis", "es", "est", "sommes", "êtes", "sont"],
    ["serai", "seras", "sera", "serons", "serez", "seront"],
    _std_imp("ét"),
    "été", ["sois", "soyons", "soyez"],
    note="Past participle été never changes. Être is the auxiliary of movement and pronominal verbs.")
put("faire",
    ["fais", "fais", "fait", "faisons", "faites", "font"],
    ["ferai", "feras", "fera", "ferons", "ferez", "feront"],
    _std_imp("fais"),
    "fait", ["fais", "faisons", "faites"])
put("dire",
    ["dis", "dis", "dit", "disons", "dites", "disent"],
    ["dirai", "diras", "dira", "dirons", "direz", "diront"],
    _std_imp("dis"),
    "dit", ["dis", "disons", "dites"],
    note="Vous dites, ils disent — the only surprises.")
put("voir",
    ["vois", "vois", "voit", "voyons", "voyez", "voient"],
    ["verrai", "verras", "verra", "verrons", "verrez", "verront"],
    _std_imp("voy"),
    "vu", ["vois", "voyons", "voyez"])
put("savoir",
    ["sais", "sais", "sait", "savons", "savez", "savent"],
    ["saurai", "sauras", "saura", "saurons", "saurez", "sauront"],
    _std_imp("sav"),
    "su", ["sache", "sachons", "sachez"],
    note="Savoir is a fact or a skill (je sais nager). Connaître is a person or a place.")
put("connaître",
    ["connais", "connais", "connaît", "connaissons", "connaissez", "connaissent"],
    ["connaîtrai", "connaîtras", "connaîtra", "connaîtrons", "connaîtrez", "connaîtront"],
    _std_imp("connaiss"),
    "connu", ["connais", "connaissons", "connaissez"])
put("vouloir",
    ["veux", "veux", "veut", "voulons", "voulez", "veulent"],
    ["voudrai", "voudras", "voudra", "voudrons", "voudrez", "voudront"],
    _std_imp("voul"),
    "voulu", ["veuille", "veuillons", "veuillez"],
    note="The polite request is je voudrais (conditional), not the future je voudrai.")
put("pouvoir",
    ["peux", "peux", "peut", "pouvons", "pouvez", "peuvent"],
    ["pourrai", "pourras", "pourra", "pourrons", "pourrez", "pourront"],
    _std_imp("pouv"),
    "pu", None,
    note="No everyday imperative. Possibility in the past: j'ai pu.")
put("devoir",
    ["dois", "dois", "doit", "devons", "devez", "doivent"],
    ["devrai", "devras", "devra", "devrons", "devrez", "devront"],
    _std_imp("dev"),
    "dû", None,
    note="Past participle dû takes a circumflex, but due / dus / dues do not.")
put("boire",
    ["bois", "bois", "boit", "buvons", "buvez", "boivent"],
    ["boirai", "boiras", "boira", "boirons", "boirez", "boiront"],
    _std_imp("buv"),
    "bu", ["bois", "buvons", "buvez"])
put("croire",
    ["crois", "crois", "croit", "croyons", "croyez", "croient"],
    ["croirai", "croiras", "croira", "croirons", "croirez", "croiront"],
    _std_imp("croy"),
    "cru", ["crois", "croyons", "croyez"])
put("lire",
    ["lis", "lis", "lit", "lisons", "lisez", "lisent"],
    ["lirai", "liras", "lira", "lirons", "lirez", "liront"],
    _std_imp("lis"),
    "lu", ["lis", "lisons", "lisez"])
put("écrire",
    ["écris", "écris", "écrit", "écrivons", "écrivez", "écrivent"],
    ["écrirai", "écriras", "écrira", "écrirons", "écrirez", "écriront"],
    _std_imp("écriv"),
    "écrit", ["écris", "écrivons", "écrivez"])
put("mettre",
    ["mets", "mets", "met", "mettons", "mettez", "mettent"],
    ["mettrai", "mettras", "mettra", "mettrons", "mettrez", "mettront"],
    _std_imp("mett"),
    "mis", ["mets", "mettons", "mettez"])
put("prendre",
    ["prends", "prends", "prend", "prenons", "prenez", "prennent"],
    ["prendrai", "prendras", "prendra", "prendrons", "prendrez", "prendront"],
    _std_imp("pren"),
    "pris", ["prends", "prenons", "prenez"])
put("apprendre",
    ["apprends", "apprends", "apprend", "apprenons", "apprenez", "apprennent"],
    ["apprendrai", "apprendras", "apprendra", "apprendrons", "apprendrez", "apprendront"],
    _std_imp("appren"),
    "appris", ["apprends", "apprenons", "apprenez"])
put("comprendre",
    ["comprends", "comprends", "comprend", "comprenons", "comprenez", "comprennent"],
    ["comprendrai", "comprendras", "comprendra", "comprendrons", "comprendrez", "comprendront"],
    _std_imp("compren"),
    "compris", ["comprends", "comprenons", "comprenez"])
put("vivre",
    ["vis", "vis", "vit", "vivons", "vivez", "vivent"],
    ["vivrai", "vivras", "vivra", "vivrons", "vivrez", "vivront"],
    _std_imp("viv"),
    "vécu", ["vis", "vivons", "vivez"])
put("suivre",
    ["suis", "suis", "suit", "suivons", "suivez", "suivent"],
    ["suivrai", "suivras", "suivra", "suivrons", "suivrez", "suivront"],
    _std_imp("suiv"),
    "suivi", ["suis", "suivons", "suivez"],
    note="Je suis here is suivre, not être. Context tells you which.")
put("rire",
    ["ris", "ris", "rit", "rions", "riez", "rient"],
    ["rirai", "riras", "rira", "rirons", "rirez", "riront"],
    _std_imp("ri"),
    "ri", ["ris", "rions", "riez"])
put("courir",
    ["cours", "cours", "court", "courons", "courez", "courent"],
    ["courrai", "courras", "courra", "courrons", "courrez", "courront"],
    _std_imp("cour"),
    "couru", ["cours", "courons", "courez"])
put("venir",
    ["viens", "viens", "vient", "venons", "venez", "viennent"],
    ["viendrai", "viendras", "viendra", "viendrons", "viendrez", "viendront"],
    _std_imp("ven"),
    "venu", ["viens", "venons", "venez"], aux="être",
    note="Passé composé with être: je suis venu, je suis venue.")
put("tenir",
    ["tiens", "tiens", "tient", "tenons", "tenez", "tiennent"],
    ["tiendrai", "tiendras", "tiendra", "tiendrons", "tiendrez", "tiendront"],
    _std_imp("ten"),
    "tenu", ["tiens", "tenons", "tenez"])
put("obtenir",
    ["obtiens", "obtiens", "obtient", "obtenons", "obtenez", "obtiennent"],
    ["obtiendrai", "obtiendras", "obtiendra", "obtiendrons", "obtiendrez", "obtiendront"],
    _std_imp("obten"),
    "obtenu", ["obtiens", "obtenons", "obtenez"])
put("recevoir",
    ["reçois", "reçois", "reçoit", "recevons", "recevez", "reçoivent"],
    ["recevrai", "recevras", "recevra", "recevrons", "recevrez", "recevront"],
    _std_imp("recev"),
    "reçu", ["reçois", "recevons", "recevez"])
put("envoyer",
    ["envoie", "envoies", "envoie", "envoyons", "envoyez", "envoient"],
    ["enverrai", "enverras", "enverra", "enverrons", "enverrez", "enverront"],
    _std_imp("envoy"),
    "envoyé", ["envoie", "envoyons", "envoyez"],
    note="Future stem is enverr-, not envoi-.")
put("ouvrir",
    ["ouvre", "ouvres", "ouvre", "ouvrons", "ouvrez", "ouvrent"],
    ["ouvrirai", "ouvriras", "ouvrira", "ouvrirons", "ouvrirez", "ouvriront"],
    _std_imp("ouvr"),
    "ouvert", ["ouvre", "ouvrons", "ouvrez"],
    note="Conjugates like a regular -er verb, but the participle is ouvert.")
put("conduire",
    ["conduis", "conduis", "conduit", "conduisons", "conduisez", "conduisent"],
    ["conduirai", "conduiras", "conduira", "conduirons", "conduirez", "conduiront"],
    _std_imp("conduis"),
    "conduit", ["conduis", "conduisons", "conduisez"])
put("introduire",
    ["introduis", "introduis", "introduit", "introduisons", "introduisez", "introduisent"],
    ["introduirai", "introduiras", "introduira", "introduirons", "introduirez", "introduiront"],
    _std_imp("introduis"),
    "introduit", ["introduis", "introduisons", "introduisez"])

# -dre family built below
for inf, pp, aux in (
    ("attendre", "attendu", "avoir"),
    ("entendre", "entendu", "avoir"),
    ("descendre", "descendu", "être"),
    ("perdre", "perdu", "avoir"),
    ("rendre", "rendu", "avoir"),
    ("répondre", "répondu", "avoir"),
    ("vendre", "vendu", "avoir"),
):
    stem = inf[:-2]  # attendr? attendre[:-2] = attendr is wrong. attendre -> stem attend (drop re)
    stem = inf[:-2]
    if inf.endswith("re"):
        stem = inf[:-2]
    # attendre[:-2] = "attend" if we drop "re"? a-t-t-e-n-d-r-e length: attendre = attend + re, [:-2] = attend. Yes.
    put(inf,
        [stem + "s", stem + "s", stem, stem + "ons", stem + "ez", stem + "ent"],
        [inf[:-1] + e for e in ["ai", "as", "a", "ons", "ez", "ont"]] if False else [inf[:-2] + "r" + e for e in FUT_END],
        _std_imp(stem),
        pp, [stem + "s", stem + "ons", stem + "ez"], aux=aux,
        note=("Movement: je suis descendu(e). A drink you put down uses avoir: j'ai descendu un café." if inf == "descendre" else ""))

# short -ir
for inf, pp, aux, je, il in (
    ("partir", "parti", "être", "pars", "part"),
    ("dormir", "dormi", "avoir", "dors", "dort"),
    ("sentir", "senti", "avoir", "sens", "sent"),
    ("sortir", "sorti", "être", "sors", "sort"),
    ("mentir", "menti", "avoir", "mens", "ment"),
):
    stem = inf[:-2]
    put(inf,
        [je, je, il, stem + "ons", stem + "ez", stem + "ent"],
        [inf + e for e in FUT_END],
        _std_imp(stem),
        pp, [je, stem + "ons", stem + "ez"], aux=aux,
        note=("Passé composé with être." if aux == "être" else ""))


REFLEX = {
    "se coucher": ("coucher", "er"),
    "se laver": ("laver", "er"),
    "se lever": ("lever", "grave"),
    "se reposer": ("reposer", "er"),
    "s'inquiéter": ("inquiéter", "aigu"),
    "se souvenir": ("souvenir", "venir-like"),
    "s'asseoir": ("asseoir", "asseoir"),
}


def _reflex_forms(bare_forms):
    """bare_forms are without pronouns. Add me/te/se/nous/vous/se with elision."""
    refs = ["me", "te", "se", "nous", "vous", "se"]
    out = []
    for r, f in zip(refs, bare_forms):
        if r in ("me", "te", "se") and f[:1] in "aàâeéèêiîoôuûyh":
            rr = r[0] + "'"
            piece = rr + f
        else:
            piece = r + " " + f
        if r == "me":
            out.append(_je("", piece) if not piece.startswith(("m'",)) else "je " + piece)
            # j' + me is wrong. je me / je m'
            out[-1] = "je " + piece
        elif r == "te":
            out.append("tu " + piece)
        elif refs and r == "se" and out and len(out) == 2:
            out.append("il/elle " + piece)
        elif r == "nous":
            out.append("nous nous " + f)
        elif r == "vous":
            out.append("vous vous " + f)
        else:
            out.append("ils/elles " + piece)
    return out


def conjugate_record(inf, en, kind):
    """kind is a tag used for non-stored verbs."""
    if inf in IRREG:
        spec = IRREG[inf]
        present, futur, imparfait = spec["present"], spec["futur"], spec["imparfait"]
        pp, imper, aux, note = spec["pp"], spec["imperatif"], spec["aux"], spec["note"]
        p_full = _with_pronouns(present)
        f_full = _with_pronouns(futur)
        i_full = _with_pronouns(imparfait)
        if aux == "être":
            pc = [
                "je suis " + pp + "(e)",
                "tu es " + pp + "(e)",
                "il/elle est " + pp + "(e)",
                "nous sommes " + pp + "(e)s",
                "vous êtes " + pp + "(e)s",
                "ils/elles sont " + pp + "(e)s",
            ]
        else:
            pc = ["j'ai " + pp if True else "", "tu as " + pp, "il/elle a " + pp, "nous avons " + pp, "vous avez " + pp, "ils/elles ont " + pp]
            pc[0] = "j'ai " + pp
        impv = []
        if imper:
            labels = ["tu", "nous", "vous"]
            impv = [labels[i] + " : " + imper[i] for i in range(3)]
        return {"inf": inf, "en": en, "aux": aux, "note": note, "present": p_full, "pc": pc, "imparfait": i_full, "futur": f_full, "imperatif": impv}

    # patterned
    if kind == "er":
        spec = er_regular(inf)
    elif kind == "grave":
        spec = er_accent_grave(inf)
    elif kind == "aigu":
        spec = er_accent_aigu(inf)
    elif kind == "yer":
        spec = er_yer(inf)
    elif kind == "iss":
        spec = ir_iss(inf)
    else:
        raise SystemExit("no pattern for " + inf)
    pres, fut, imp, pp, imper, aux = expand(spec, "avoir")
    p_full = _with_pronouns(pres)
    f_full = _with_pronouns(fut)
    i_full = _with_pronouns(imp)
    pc = ["j'ai " + pp, "tu as " + pp, "il/elle a " + pp, "nous avons " + pp, "vous avez " + pp, "ils/elles ont " + pp]
    labels = ["tu", "nous", "vous"]
    impv = [labels[i] + " : " + imper[i] for i in range(3)]
    return {"inf": inf, "en": en, "aux": aux, "note": "", "present": p_full, "pc": pc, "imparfait": i_full, "futur": f_full, "imperatif": impv}


def conjugate_pronominal(inf, en, kind):
    bare = {
        "se coucher": "coucher", "se laver": "laver", "se lever": "lever",
        "se reposer": "reposer", "s'inquiéter": "inquiéter",
    }[inf]
    if kind == "grave":
        spec = er_accent_grave(bare)
    elif kind == "aigu":
        spec = er_accent_aigu(bare)
    else:
        spec = er_regular(bare)
    pres, fut, imp, pp, imper, aux = expand(spec)
    # fix je elision inside reflex helper — rebuild carefully
    def pack(forms):
        refs = [("je me ", "je m'"), ("tu te ", "tu t'"), ("il/elle se ", "il/elle s'"),
                ("nous nous ", "nous nous "), ("vous vous ", "vous vous "),
                ("ils/elles se ", "ils/elles s'")]
        out = []
        for (full, eli), f in zip(refs, forms):
            if f[:1] in "aàâeéèêiîoôuûyh" and not full.endswith("nous ") and not full.endswith("vous "):
                out.append(eli + f)
            else:
                out.append(full + f)
        return out
    p_full = pack(pres)
    f_full = pack(fut)
    i_full = pack(imp)
    # passé composé: je me suis lavé(e)
    auxf = ["suis", "es", "est", "sommes", "êtes", "sont"]
    pcs = []
    agree = ["(e)", "(e)", "(e)", "(e)s", "(e)s", "(e)s"]
    refs = [("je me ", "je m'"), ("tu t'es ", None), ("il/elle s'est ", None),
            ("nous nous sommes ", None), ("vous vous êtes ", None), ("ils/elles se sont ", None)]
    # do explicitly
    ppg = pp
    pcs = [
        "je me suis " + ppg + "(e)",
        "tu t'es " + ppg + "(e)" if ppg[:1] in "aàeéèiîoôuûyh" else "tu t'es " + ppg + "(e)",
        "il/elle s'est " + ppg + "(e)",
        "nous nous sommes " + ppg + "(e)s",
        "vous vous êtes " + ppg + "(e)s",
        "ils/elles se sont " + ppg + "(e)s",
    ]
    # tu t'es is always elided because es starts with e. Good, the branch is the same.
    labels_imp = [
        ("lave-toi style", imper[0]),
    ]
    # affirmative imperative: lave-toi, levons-nous, levez-vous
    tu = imper[0]
    # -er tu imperative + toi, with hyphen. Pronoun after, toi not te.
    if tu.endswith("e") and not tu.endswith("es"):
        tu_imp = tu + "-toi"
    else:
        tu_imp = tu + "-toi"
    impv = [tu_imp, imper[1] + "-nous", imper[2] + "-vous"]
    note = "Pronominal verb: passé composé with être, and the participle agrees with the subject (lavé, lavée, lavés, lavées)."
    return {"inf": inf, "en": en, "aux": "être", "note": note, "present": p_full, "pc": pcs, "imparfait": i_full, "futur": f_full, "imperatif": impv}


def souvenir_and_asseoir():
    out = []
    # se souvenir like venir
    pres = ["souviens", "souviens", "souvient", "souvenons", "souvenez", "souviennent"]
    fut = ["souviendrai", "souviendras", "souviendra", "souviendrons", "souviendrez", "souviendront"]
    imp = _std_imp("souven")
    def pack(forms):
        built = []
        prefs = [
            ("je me ", "je m'"), ("tu te ", "tu t'"), ("il/elle se ", "il/elle s'"),
            ("nous nous ", None), ("vous vous ", None), ("ils/elles se ", "ils/elles s'"),
        ]
        for i, f in enumerate(forms):
            full, eli = prefs[i]
            if eli and f[:1] in "aàâeéèêiîoôuûyh":
                built.append(eli + f)
            else:
                built.append(full + f)
        return built
    out.append({
        "inf": "se souvenir", "en": "to remember", "aux": "être",
        "note": "Je me souviens de + noun. Passé composé: je me suis souvenu(e) de…",
        "present": pack(pres), "futur": pack(fut), "imparfait": pack(imp),
        "pc": ["je me suis souvenu(e)", "tu t'es souvenu(e)", "il/elle s'est souvenu(e)",
               "nous nous sommes souvenu(e)s", "vous vous êtes souvenu(e)s", "ils/elles se sont souvenu(e)s"],
        "imperatif": ["souviens-toi", "souvenons-nous", "souvenez-vous"],
    })
    pres = ["assieds", "assieds", "assied", "asseyons", "asseyez", "asseyent"]
    fut = ["assiérai", "assiéras", "assiéra", "assiérons", "assiérez", "assiéront"]
    imp = _std_imp("assey")
    out.append({
        "inf": "s'asseoir", "en": "to sit down", "aux": "être",
        "note": "A common alternative is je m'assois / vous vous assoyez. This table uses assieds.",
        "present": pack(pres), "futur": pack(fut), "imparfait": pack(imp),
        "pc": ["je me suis assis(e)", "tu t'es assis(e)", "il/elle s'est assis(e)",
               "nous nous sommes assis(es)", "vous vous êtes assis(es)", "ils/elles se sont assis(es)"],
        "imperatif": ["assieds-toi", "asseyons-nous", "asseyez-vous"],
    })
    return out


VERBS = [
    ("acheter", "to buy", "grave"),
    ("aider", "to help", "er"),
    ("aller", "to go", "irreg"),
    ("amener", "to bring (someone)", "grave"),
    ("apporter", "to bring (something)", "er"),
    ("apprendre", "to learn", "irreg"),
    ("arriver", "to arrive", "etre-er"),
    ("attendre", "to wait", "irreg"),
    ("avoir", "to have", "irreg"),
    ("bavarder", "to chat", "er"),
    ("boire", "to drink", "irreg"),
    ("changer", "to change", "ge"),
    ("chanter", "to sing", "er"),
    ("chercher", "to look for", "er"),
    ("commander", "to order", "er"),
    ("commencer", "to start", "cer"),
    ("comprendre", "to understand", "irreg"),
    ("conduire", "to drive", "irreg"),
    ("connaître", "to know (someone, a place)", "irreg"),
    ("courir", "to run", "irreg"),
    ("croire", "to believe", "irreg"),
    ("cuisiner", "to cook", "er"),
    ("danser", "to dance", "er"),
    ("décider", "to decide", "er"),
    ("demander", "to ask", "er"),
    ("déménager", "to move house", "ge"),
    ("dépenser", "to spend (money)", "er"),
    ("descendre", "to go down", "irreg"),
    ("dire", "to say", "irreg"),
    ("donner", "to give", "er"),
    ("dormir", "to sleep", "irreg"),
    ("écouter", "to listen", "er"),
    ("écrire", "to write", "irreg"),
    ("enlever", "to remove", "grave"),
    ("entendre", "to hear", "irreg"),
    ("envoyer", "to send", "irreg"),
    ("essayer", "to try", "yer"),
    ("être", "to be", "irreg"),
    ("étudier", "to study", "er"),
    ("faire", "to do, to make", "irreg"),
    ("fermer", "to close", "er"),
    ("finir", "to finish", "iss"),
    ("gagner", "to win, to earn", "er"),
    ("gaspiller", "to waste", "er"),
    ("goûter", "to taste", "er"),
    ("habiter", "to live (somewhere)", "er"),
    ("introduire", "to introduce, to insert", "irreg"),
    ("inviter", "to invite", "er"),
    ("jouer", "to play", "er"),
    ("laisser", "to leave (something)", "er"),
    ("laver", "to wash", "er"),
    ("lire", "to read", "irreg"),
    ("manger", "to eat", "ge"),
    ("marcher", "to walk", "er"),
    ("mettre", "to put, to put on", "irreg"),
    ("monter", "to go up", "etre-er"),
    ("nettoyer", "to clean", "yer"),
    ("obtenir", "to obtain", "irreg"),
    ("oublier", "to forget", "er"),
    ("ouvrir", "to open", "irreg"),
    ("partir", "to leave", "irreg"),
    ("parler", "to speak", "er"),
    ("passer", "to pass, to spend (time)", "passer"),
    ("payer", "to pay", "yer"),
    ("penser", "to think", "er"),
    ("perdre", "to lose", "irreg"),
    ("porter", "to wear, to carry", "er"),
    ("prendre", "to take", "irreg"),
    ("préparer", "to prepare", "er"),
    ("quitter", "to leave (a place or a person)", "er"),
    ("recevoir", "to receive", "irreg"),
    ("recommander", "to recommend", "er"),
    ("regarder", "to watch, to look at", "er"),
    ("remplir", "to fill", "iss"),
    ("rendre", "to give back, to make", "irreg"),
    ("réparer", "to repair", "er"),
    ("répondre", "to answer", "irreg"),
    ("rire", "to laugh", "irreg"),
    ("retourner", "to go back", "etre-er"),
    ("savoir", "to know (a fact, a skill)", "irreg"),
    ("se coucher", "to go to bed", "pron-er"),
    ("se laver", "to wash oneself", "pron-er"),
    ("se lever", "to get up", "pron-grave"),
    ("se reposer", "to rest", "pron-er"),
    ("se souvenir", "to remember", "pron-special"),
    ("signer", "to sign", "er"),
    ("s'inquiéter", "to worry", "pron-aigu"),
    ("suivre", "to follow", "irreg"),
    ("trouver", "to find", "er"),
    ("s'asseoir", "to sit down", "pron-special"),
    ("tomber", "to fall", "etre-er"),
    ("travailler", "to work", "er"),
    ("utiliser", "to use", "er"),
    ("vendre", "to sell", "irreg"),
    ("venir", "to come", "irreg"),
    ("visiter", "to visit", "er"),
    ("vivre", "to live", "irreg"),
    ("voyager", "to travel", "ge"),
    ("vouloir", "to want", "irreg"),
    ("voir", "to see", "irreg"),
]


def _etre_er(inf, en):
    rec = conjugate_record(inf, en, "er")
    pp = rec["pc"][0].split()[-1]
    # pc was j'ai pp — rebuild with être
    stem_pp = er_regular(inf)["pp"]
    rec["aux"] = "être"
    rec["pc"] = [
        "je suis " + stem_pp + "(e)",
        "tu es " + stem_pp + "(e)",
        "il/elle est " + stem_pp + "(e)",
        "nous sommes " + stem_pp + "(e)s",
        "vous êtes " + stem_pp + "(e)s",
        "ils/elles sont " + stem_pp + "(e)s",
    ]
    rec["note"] = "Passé composé with être. Add -e for feminine, -s for plural: allé, allée, allés, allées."
    if inf == "passer":
        rec["aux"] = "être / avoir"
        rec["note"] = "Je suis passé(e) when you go past or drop by. J'ai passé when you spend time or take an exam: j'ai passé le week-end à Lyon."
        rec["pc"] = [
            "je suis passé(e)  /  j'ai passé",
            "tu es passé(e)  /  tu as passé",
            "il/elle est passé(e)  /  il/elle a passé",
            "nous sommes passé(e)s  /  nous avons passé",
            "vous êtes passé(e)(s)  /  vous avez passé",
            "ils/elles sont passé(e)s  /  ils/elles ont passé",
        ]
    return rec


def all_verbs():
    specials = {v["inf"]: v for v in souvenir_and_asseoir()}
    out = []
    for inf, en, kind in VERBS:
        if kind == "pron-special":
            out.append(specials[inf])
            continue
        if kind == "etre-er" or kind == "passer":
            out.append(_etre_er(inf, en))
            continue
        if kind == "pron-er":
            out.append(conjugate_pronominal(inf, en, "er"))
            continue
        if kind == "pron-grave":
            out.append(conjugate_pronominal(inf, en, "grave"))
            continue
        if kind == "pron-aigu":
            out.append(conjugate_pronominal(inf, en, "aigu"))
            continue
        if kind == "ge":
            out.append(conjugate_record(inf, en, "er"))
            continue
        if kind == "cer":
            out.append(conjugate_record(inf, en, "er"))
            continue
        if kind == "irreg":
            out.append(conjugate_record(inf, en, "irreg"))
            continue
        out.append(conjugate_record(inf, en, kind))
    if len(out) != 100:
        raise SystemExit("expected 100 verbs, got %d" % len(out))
    return out
