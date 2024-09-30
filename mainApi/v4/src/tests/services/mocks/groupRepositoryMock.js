import { Result } from "../../../infra/errorHandling/result.js";

export class GroupRepositoryMock {

    async findOne(chatId) {
        return Result.ok([{
            groupPhoto:null,
            groupName:'grupo zoeira',
            groupDescription:"um grupo aberto a atodos",
            chatId:"95171413-c9f0-42f9-9a83-81913a4c4dfc",
            chatType:"group"
        }])
    }

    async insertOne(group){
        return Result.ok(group)
    }

    async patchOne(group){
        return Result.ok(group)
    }
}