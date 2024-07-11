import { RepositoryContext } from "../../../../infra/repository/context/contextRepository.js";
import { MessageRepository } from "../../../../infra/repository/messageRepository.js";
import { SendMessageFile } from "../Messegers/messegerFile.js";


const messageRepository = new MessageRepository(process.env.CONNECION_STRING);
const repositoryContext = new RepositoryContext(messageRepository);
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
