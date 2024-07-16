import { RepositoryContext } from "../../../../infra/database/context/contextRepository.js";
import { MessageMysql } from "../../../../infra/database/messageRepository.js";
import { SendMessageText } from "../Messegers/messegerText.js";

const databaseStrategy = new MessageMysql(process.env.CONNECION_STRING);
const repositoryContext = new RepositoryContext(databaseStrategy);
const useCase = new SendMessageText(repositoryContext);

process.on("message", async ({ messageText, userId, chatId, language }) => {
    const result = await useCase.execute(messageText, userId, chatId, language);
    process.send({ ...result, value: result.getValue() })
})
