import { RepositoryContext } from "../../../../infra/database/context/contextRepository.js";
import { MessageMysql } from "../../../../infra/database/messageRepository.js";
import { SendMessageFile } from "../Messegers/messegerFile.js";


const databaseStrategy = new MessageMysql(process.env.CONNECION_STRING);
const repositoryContext = new RepositoryContext(databaseStrategy);
const useCase = new SendMessageFile(repositoryContext);

process.on("message", async ({ userId, chatId, language, messageArrayBuffer }) => {
    const messageType = "audio";
    const messageText = "";
    const data = new Blob(messageArrayBuffer, {
        type: "audio/mp3"
    });
    const result = await useCase.execute({ messageText, userId, chatId, language, messageType, data });
    process.send({ ...result, value: result.getValue() })
})
