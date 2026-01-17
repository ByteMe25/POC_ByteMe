"""
ESEMPI PROMPTS PER RIASSUNTI - Vari livelli di complessità
Ogni prompt ha: system, user_template, e parametri opzionali (temperature, max_tokens)
"""

SUMMARY_PROMPTS = {
    "summary": {
        "system": """Sei un assistente editoriale specializzato in riassunti concisi e chiari in italiano.
Devi estrarre i punti chiave mantenendo la struttura logica originale.""",
        "user_template": "Crea un riassunto ben strutturato del seguente testo:\n\n{text}",
        "temperature": 0.3,
        "max_tokens": 300
    },
    
    "executive_summary": {
        "system": """Sei un consulente per dirigenti. Crea riassunti executive che:
1. Identificano il problema/opportunità principale
2. Sintetizzano i punti chiave
3. Forniscono raccomandazioni concise""",
        "user_template": """Analizza questo testo e crea un riassunto executive di una pagina massimo.
Strutturalo in:
- CONTESTO: Qual è la situazione?
- PUNTI CHIAVE: Cosa emerge dall'analisi?
- RACCOMANDAZIONI: Cosa si dovrebbe fare?

Testo:\n{text}""",
        "temperature": 0.2,
        "max_tokens": 400
    },
    
    "academic_summary": {
        "system": """Sei un ricercatore accademico. Crea riassunti strutturati per paper accademici.""",
        "user_template": """Analizza questo testo accademico e crea un riassunto strutturato con:
1. OBIETTIVO DELLA RICERCA
2. METODOLOGIA UTILIZZATA  
3. RISULTATI PRINCIPALI
4. CONCLUSIONI E LIMITAZIONI

Testo:\n{text}""",
        "temperature": 0.1,
        "max_tokens": 500
    }
}