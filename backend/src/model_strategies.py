# ai_model_strategies.py
import os
from openai import OpenAI

_model_instances: dict[str, AIModelStrategy] = {}

def get_model(model_class: Type[AIModelStrategy]) -> AIModelStrategy:
    key = model_class.__name__
    if key not in _model_instances:
        _model_instances[key] = model_class()
    return _model_instances[key]

class AIModelStrategy:
    """Interfaccia comune per tutti i modelli AI"""
    def generate(self, system_prompt, user_prompt):
        raise NotImplementedError

class ZucchettiLlamaStrategy(AIModelStrategy):
    """Strategia per il modello Llama via infrastruttura Zucchetti"""
    def __init__(self):
        self.client = OpenAI(
            api_key=os.getenv("OPENAI_API_KEY"),
            base_url=os.getenv("OPENAI_BASE_URL")
        )
        self.model = "llama3.2:3b"

    def generate(self, system_prompt, user_prompt):
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ]
        )
        return response.choices[0].message.content

class GeminiStrategy(AIModelStrategy):
    """Strategia per Google Gemini"""
    """def __init__(self):
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        self.model = genai.GenerativeModel('gemini-pro')

    def generate(self, system_prompt, user_prompt):
        # Gemini gestisce il system prompt in modo leggermente diverso
        # Uniamo i prompt o usiamo la configurazione specifica del modello
        full_prompt = f"{system_prompt}\n\nRichiesta utente: {user_prompt}"
        response = self.model.generate_content(full_prompt)
        return response.text"""