



export class MessageFile {

    /**
     * 
     * @param {string} messageId 
     * @param { Blob } data 
     * @param {string} fileName 
     */
    constructor(messageId,data,fileName){
        this.messageId = messageId;
        this.fileName = fileName;
        this.data = data;
    }
}