import { describe, it, expect, vi, beforeEach } from 'vitest'
import { callAI } from '../editorApiCall'

beforeEach(() => vi.resetAllMocks()) //prima di ogni singolo test, resetta tutti i mock

describe('callAI', () => {
  it('chiama il giusto endpoint con text e operation', async () => { //sto "mockando" la chiamata di fetch senza fare un vero fetch
    global.fetch = vi.fn().mockResolvedValue({                  
      ok: true,
      json: () => Promise.resolve({ generated_text: 'Risultato' }),
    })

    const result = await callAI('Testo', 'summary')

    expect(fetch).toHaveBeenCalledWith('/api/ai/generate', {  //verifica che fetch sia stato chiamato con i parametri giusti, quindi URL corretto, metodo POST, body con il formato atteso
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'Testo', operation: 'summary' }),
    })
    expect(result).toBe('Risultato')
  })

  it('lancia errore se response non è ok', async () => { //sto "mockando" un errore
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500 })

    await expect(callAI('Testo', 'summary')).rejects.toThrow('Errore API: 500') //verifica che in questo caso callAI non ritorni un valore ma lanci un'eccezione con quel messaggio specifico
  })
})