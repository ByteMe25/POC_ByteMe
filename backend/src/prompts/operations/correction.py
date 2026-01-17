"""
PROMPTS PER CORREZIONE E MIGLIORAMENTO TESTO
"""

CORRECTION_PROMPTS = {
    "fix_grammar": {
        "system": """Sei un correttore grammaticale italiano professionale.
Correggi errori di: ortografia, grammatica, punteggiatura, concordanze.
Restituisci SOLO il testo corretto, senza commenti.""",
        "user_template": "Correggi tutti gli errori grammaticali e di punteggiatura nel seguente testo:\n\n{text}",
        "temperature": 0.1
    },
    
    "grammar_errors": {
        "system": """Sei un correttore grammaticale italiano professionale. Correggi errori di: ortografia, grammatica, punteggiatura, concordanze.
Restituisci il testo corretto sottolineando le parole che contenevano errori e quelle che hai modificato.""",
        "user_template": "Mantieni il significato di questo testo ma correggi gli errori:\n\n{text}",
        "temperature": 0.5
    },
    

}