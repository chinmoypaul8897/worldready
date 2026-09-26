#!/usr/bin/env python3
"""Generate docs/glossary.xlsx for WorldReady.

Authored by Claude Code (worker P03), never by IBM Bob. This is our own original
terminology list (no copied proprietary text). Bob reads this .xlsx during the i18n
work to keep terms, brand names, and translations consistent.

Columns:
    Term (English) | Part of speech | French (fr-CA) | Arabic (ar) | Do not translate | Notes

"Do not translate" values:
    YES        -> keep the English/brand term verbatim in every language
    NO         -> translate normally
    LABEL ONLY -> translate the on-screen label, but keep the ENGLISH value as the
                  data / URL / filter value (e.g. planet names double as flight filters)

Run:  python scripts/gen-glossary.py   (writes docs/glossary.xlsx)
"""

import os
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side

ROWS = [
    # --- Brand / product names: never translate ---
    ("Galaxium", "proper noun", "Galaxium", "Galaxium", "YES",
     "Brand name. Never translate or transliterate; keep Latin script even in Arabic (allow-listed in the scan)."),
    ("Galaxium Travels", "proper noun", "Galaxium Travels", "Galaxium Travels", "YES",
     "Company / app name. Use as the <title> and header brand."),
    ("Galaxium Class", "noun (seat class)", "Galaxium Class", "Galaxium Class", "YES",
     "Premium seat class. Brand term — keep English in all languages."),
    ("WorldReady", "proper noun", "WorldReady", "WorldReady", "YES",
     "Our product name. Never translate."),
    ("Bob", "proper noun", "Bob", "Bob", "YES",
     "IBM Bob (the IDE that built the app). Keep verbatim."),

    # --- Core domain terms: translate ---
    ("flight", "noun", "vol", "رحلة", "NO", "The core travel unit."),
    ("booking", "noun", "réservation", "حجز", "NO", "A confirmed reservation."),
    ("hold", "noun", "réservation temporaire", "حجز مؤقت", "NO",
     "A temporary 15-minute seat reservation. Do NOT use 'prise' / 'blocage'."),
    ("quote", "noun", "devis", "عرض سعر", "NO", "A price quote, valid 24h."),
    ("seat", "noun", "place", "مقعد", "NO",
     "Prefer 'place' over 'siège' for availability counts in fr-CA (e.g. '3 places restantes')."),
    ("destination", "noun", "destination", "وجهة", "NO", "Planet the flight arrives at."),
    ("origin", "noun", "origine", "المنشأ", "NO", "Departure planet."),
    ("departure", "noun", "départ", "المغادرة", "NO", ""),
    ("arrival", "noun", "arrivée", "الوصول", "NO", ""),
    ("economy", "noun (seat class)", "économique", "الدرجة الاقتصادية", "NO", "Seat class."),
    ("business", "noun (seat class)", "affaires", "درجة رجال الأعمال", "NO",
     "Seat class 'Business' -> 'Classe affaires'."),
    ("passenger", "noun", "passager", "مسافر", "NO", ""),
    ("cancel", "verb", "annuler", "إلغاء", "NO", "Action on a booking."),
    ("confirm", "verb", "confirmer", "تأكيد", "NO", ""),
    ("release", "verb", "libérer", "إلغاء الحجز المؤقت", "NO", "Release a temporary hold."),
    ("sign in", "verb", "se connecter", "تسجيل الدخول", "NO",
     "Use the verb 'se connecter'; avoid the noun 'connexion' for the button."),
    ("register", "verb", "s'inscrire", "إنشاء حساب", "NO", "Create an account."),
    ("price", "noun", "prix", "السعر", "NO",
     "Format via Intl.NumberFormat keyed to the locale; CAD in fr-CA, not USD."),
    ("email", "noun", "courriel", "البريد الإلكتروني", "NO",
     "Quebec term: use 'courriel', NOT 'e-mail' or 'mail'."),
    ("spaceport", "noun", "astroport", "ميناء فضائي", "NO", "Departure/arrival facility."),

    # --- Planet names: translate the LABEL, keep English as the data/filter value ---
    ("Earth", "proper noun (planet)", "Terre", "الأرض", "LABEL ONLY",
     "Translate the display label; keep 'Earth' as the slug/filter value (DestinationDetail filter)."),
    ("Mars", "proper noun (planet)", "Mars", "المريخ", "LABEL ONLY",
     "Label translates only in Arabic; keep 'Mars' as the /flights?destination= value."),
    ("Moon", "proper noun (planet)", "Lune", "القمر", "LABEL ONLY", "Keep 'Moon' as the data value."),
    ("Venus", "proper noun (planet)", "Vénus", "الزهرة", "LABEL ONLY", "Keep 'Venus' as the data value."),
    ("Jupiter", "proper noun (planet)", "Jupiter", "المشتري", "LABEL ONLY", "Keep 'Jupiter' as the data value."),
    ("Europa", "proper noun (moon)", "Europe", "أوروبا", "LABEL ONLY",
     "The moon Europa -> fr 'Europe' (add context to avoid the continent); keep 'Europa' as the data value."),
    ("Pluto", "proper noun (planet)", "Pluton", "بلوتو", "LABEL ONLY", "Keep 'Pluto' as the data value."),
]

HEADERS = ["Term (English)", "Part of speech", "French (fr-CA)", "Arabic (ar)",
           "Do not translate", "Notes"]


def main():
    wb = Workbook()
    ws = wb.active
    ws.title = "Glossary"

    header_fill = PatternFill("solid", fgColor="1F2937")
    header_font = Font(bold=True, color="FFFFFF", size=11)
    dnt_fill = PatternFill("solid", fgColor="FDE68A")       # brand / do-not-translate
    label_fill = PatternFill("solid", fgColor="BFDBFE")     # label-only
    thin = Side(style="thin", color="D1D5DB")
    border = Border(left=thin, right=thin, top=thin, bottom=thin)

    for c, h in enumerate(HEADERS, start=1):
        cell = ws.cell(row=1, column=c, value=h)
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = Alignment(vertical="center", horizontal="left")
        cell.border = border

    for r, row in enumerate(ROWS, start=2):
        for c, val in enumerate(row, start=1):
            cell = ws.cell(row=r, column=c, value=val)
            cell.border = border
            cell.alignment = Alignment(vertical="top", wrap_text=(c == 6))
            # RTL alignment for the Arabic column
            if c == 4:
                cell.alignment = Alignment(vertical="top", horizontal="right", readingOrder=2)
            # highlight flag rows
            flag = row[4]
            if c == 5:
                if flag == "YES":
                    cell.fill = dnt_fill
                elif flag == "LABEL ONLY":
                    cell.fill = label_fill

    widths = [22, 20, 26, 26, 16, 60]
    for i, w in enumerate(widths, start=1):
        ws.column_dimensions[chr(64 + i)].width = w
    ws.freeze_panes = "A2"
    ws.row_dimensions[1].height = 20

    # A short legend on a second sheet.
    legend = wb.create_sheet("Legend")
    legend["A1"] = "WorldReady glossary — legend"
    legend["A1"].font = Font(bold=True, size=12)
    notes = [
        "",
        "Do not translate = YES        Keep the English/brand term verbatim in every language.",
        "Do not translate = NO         Translate normally into French (fr-CA) and Arabic.",
        "Do not translate = LABEL ONLY Translate the on-screen label, but keep the ENGLISH value",
        "                              as the data / URL / filter value (planet names double as",
        "                              flight-search filters, so the value must stay English).",
        "",
        "French is Quebec French (fr-CA): 'vous', CAD currency, 'courriel' for email.",
        "Arabic is right-to-left with Western digits; brand names stay in Latin script.",
        "",
        "Authored by Claude Code (worker P03) — original content, no copied proprietary text.",
    ]
    for i, line in enumerate(notes, start=2):
        legend.cell(row=i, column=1, value=line)
    legend.column_dimensions["A"].width = 100

    out = os.path.join("docs", "glossary.xlsx")
    os.makedirs("docs", exist_ok=True)
    wb.save(out)
    print(f"wrote {out} with {len(ROWS)} terms")


if __name__ == "__main__":
    main()
