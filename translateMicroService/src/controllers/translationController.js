import { Result } from "../infra/erroHandling/result.js";
import { jsonrepair } from "jsonrepair";

export class TranslationController {

    #endPoint = "https://api-free.deepl.com/v2/translate"

    async findTranslations(params, body) {
        const { texts, target_language: targetLang } = body;

        const result = await this.#getTranslationText(texts[0], targetLang);
        return Result.ok({ translation: result.translations[0].text })
    }



    async #getTranslationText(text = "", targetLang) {

        const fetching = await fetch(this.#endPoint, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`
            },
            body: new URLSearchParams({
                text: text,
                target_lang: targetLang,
            }),
        });

        let data = null;
        const textJson = await fetching.text();
        try {
            data = JSON.parse(textJson)
        } catch (error) {
            data = JSON.parse(jsonrepair(textJson));

        }
        return data;
    }
}