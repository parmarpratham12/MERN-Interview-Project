import { StreamChat } from "stream-chat";
import { StreamClient} from "@stream-io/node-sdk";
import { ENV } from "./env.js";

const apiKey =ENV.STREAM_API_KEY;
const apiSecret =ENV.STREAM_API_SECRET;

if (!apiKey || !apiSecret){
    console.log("Stream api key or secret is missing.");
    
}
export const streamClient = new StreamClient(apiKey,apiSecret); // will be use for video-call
export const chatClient = StreamChat.getInstance(apiKey,apiSecret); // this is for chat feature

export const upsertStreamUser = async (userData) => {
    try{

        await chatClient.upsertUsers(userData);
        console.log("Stream user upserted sucessfully",userData);
    }
    catch(error){
        console.log("Error upserting Stream user", error)
    }
}

export const deleteStreamUser = async (userId) => {
    try{

        await chatClient.deleteUsers([userId]);
        console.log("Stream user deleted sucessfully",userId);
    }
    catch(error){
        console.log("Error deleting Stream user", error)
    }
}

  