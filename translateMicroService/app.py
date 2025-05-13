import requests
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import logging

# Carregar variáveis de ambiente
DEEPL_API_KEY = "62bbde3e-4c12-4954-be15-45d4c358d069:fx"

# Configuração de logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

app = Flask(__name__)
CORS(app, resources={r"/translate": {"origins": "*"}})

# Validar idiomas
def validar_idioma(idioma):
    return idioma.lower() in ["pt-br", "en"]

# Traduzir texto usando a API do DeepL
def traduzir_texto_deepl(texto, idioma_de_destino):
    try:
        idioma_de_destino = "PT" if idioma_de_destino == "pt-br" else idioma_de_destino.upper()


        response = requests.post(
            "https://api-free.deepl.com/v2/translate",
            data={
                "auth_key": DEEPL_API_KEY,
                "text": texto,
                "target_lang": idioma_de_destino,
            },
        )

        if response.status_code == 200:
            return response.json()["translations"][0]["text"]
        else:
            logging.error(f"Erro na API DeepL: {response.json()}")
            return None
    except Exception as e:
        logging.error(f"Erro ao traduzir o texto: {texto}. Erro: {e}")
        return None

@app.route("/translate", methods=["POST"])
def traduzir():
    try:
        dados = request.json
        textos = dados.get("texts", [])
        idioma_de_destino = dados.get("target_language", "").lower()
        print(idioma_de_destino)

        if not isinstance(textos, list) or not all(isinstance(texto, str) for texto in textos):
            return jsonify({"erro": "O campo 'textos' deve ser uma lista de strings."}), 400

        
        traducoes = [
            {
                "translate": traduzir_texto_deepl(texto, idioma_de_destino) or "Não foi possível traduzir este texto."
            }
            for texto in textos
        ]

        return jsonify({"translates": traducoes})

    except Exception as e:
        logging.error(f"Erro geral no servidor: {e}")
        return jsonify({"erro": "Ocorreu um erro interno no servidor."}), 500

if __name__ == "__main__":
    app.run(debug=True)