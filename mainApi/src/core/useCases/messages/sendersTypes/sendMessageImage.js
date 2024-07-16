import { MessageMysql } from "../../../../infra/database/messageRepository.js";
import { RepositoryContext } from "../../../../infra/database/context/contextRepository.js";
import { SendMessageFile } from "../Messegers/messegerFile.js";


const databaseStrategy = new MessageMysql(process.env.CONNECION_STRING);
const repositoryContext = new RepositoryContext(databaseStrategy);
const useCase = new SendMessageFile(repositoryContext);

process.on("message", async ({ messageText, userId, chatId, language, messageArrayBuffer }) => {
    const messageType = "image";
    const result = await useCase.execute(messageText, userId, chatId, language, messageType, messageArrayBuffer );
    process.send({ ...result, value: result.getValue() })
})