import { RepositoryContext } from "../../../../infra/repository/context/contextRepository.js";
import { MessageRepository } from "../../../../infra/repository/messageRepository.js";
import { SendMessageText } from "../Messegers/messegerText.js";

const messageRepository = new MessageRepository(process.env.CONNECION_STRING);
const repositoryContext = new RepositoryContext(messageRepository);
const useCase = new SendMessageText(repositoryContext);

process.on("message", async ({ messageText, userId, chatId, language }) => {
    const result = await useCase.execute(messageText, userId, chatId, language);
    process.send({ ...result, value: result.getValue() })
})
