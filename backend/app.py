import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai

app = Flask(__name__)
CORS(app)

client = genai.Client(api_key=os.getenv("API_KEY"))

def build_prompt(operation, text):
    prompts = {
        'summary': f"Sei un assistente che riassume testi in italiano in modo chiaro e conciso. NON usare frasi introduttive, rispondi SOLO con il riassunto.\n\nFai un riassunto breve e chiaro in italiano di:\n\n{text}",
        'fix_grammar': f"Sei un correttore di bozze. NON usare frasi introduttive. Rispondi SOLO con il testo corretto.\n\nCorreggi eventuali errori grammaticali e ortografici:\n\n{text}",
        'translate_en': f"Sei un traduttore professionista. Rispondi SOLO con il testo tradotto, senza frasi introduttive.\n\nTraduci in inglese:\n\n{text}",
    }
    return prompts.get(operation, prompts['summary'])

@app.route('/api/ai/generate', methods=['POST'])
def generate():
    data = request.json
    text = data.get('text', '')
    operation = data.get('operation', 'summary')

    if not text:
        return jsonify({"result": "❌ Nessun testo fornito."}), 400

    try:
        prompt = build_prompt(operation, text)
        response = client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=prompt
        )
        return jsonify({"result": response.text}), 200
    except Exception as e:
        import traceback
        traceback.print_exc()  # ← stampa il full traceback nei log
        return jsonify({"result": f"❌ Errore: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000, debug=True)