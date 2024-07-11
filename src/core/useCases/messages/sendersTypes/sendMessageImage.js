import { MessageRepository } from "../../../../infra/repository/messageRepository.js";
import { RepositoryContext } from "../../../../infra/repository/context/contextRepository.js";
import { SendMessageFile } from "../Messegers/messegerFile.js";


const databaseStrategy = new MessageRepository(process.env.CONNECION_STRING);
const repositoryContext = new RepositoryContext(databaseStrategy);
const useCase = new SendMessageFile(repositoryContext);

process.on("message", async ({ messageText, userId, chatId, language, messageArrayBuffer }) => {
    const messageType = "image";
    const data = new Blob(messageArrayBuffer, {
        type: "image/png"
    });
    const result = await useCase.execute({ messageText, userId, chatId, language, messageType, data });
    process.send({ ...result, value: result.getValue() })
})
