import { chatClient, streamClient } from "../lib/stream.js"
import Session from "../models/Session.js"



export async function createSession(req,res){
try {
    const {problem,difficulty} = res.body
    const userId = req.user._id
    const clerkId = req.user.clerkId

if(!problem || !difficulty){

    return res.status(400).json({message:"problem and difficulty are required"})
}
    // generate unique call id for stream video
    const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`
    // create session in db
    const session = await Session.create({problem,difficulty,host:userId,callId})
    // create stream videocall
    await streamClient.video.call("default",callId).getOrCreate({


        data:{
            created_by_id : clerkId,
            custom : { problem,difficulty,sessionId:session._id.toString()}
        }
    });
    // chat meassaging
    const channel = chatClient.channel("message",callId,{
        name : `${problem} Session`,
        created_by_id : clerkId,
        members: [clerkId]
    })

await channel.create()
res.status(201).json({session})

} catch (error) {
    console.log("Error in createSession controller:",error.message);
    res.status(500).json({ meassge : "Internal Server Error"}) ;
    
}

}

export async function getActiveSession(_,res){
    try {
       const sessions = await Session.find({status:"active"})
       .populate("host","name profileImage email clerkId") // populate method can retrive host name from host id and this is a functionality of mongodb
       .sort({createdAT:-1})
       .limit(20);

       res.status(200).json({session})
    } catch (error) {
        console.log("Error in GetActiveSession Controller",error.message);
         res.status(500).json({ meassge : "Internal Server Error"}) ;
    }
}

export async function getMyRecentSession(req,res){
    try {
        const userId = req.user._id
        // get sessions where user is either host or participant 
       const sesissons = await Session.find({
            status:"completed",
            $or: [{host : userId } , { participant:userId}]
        }).sort({createdAT:-1})
        .limit(20);
        res.status(200).json({sesissons})

    } catch (error) {
        console.log("Error in getMyRecentSessions controller",error.message);
         res.status(500).json({ meassge : "Internal Server Error"});
        
    }
}

export async function getSessionById(req,res){
    try {
        const {id} = req.params

        const session = await Session.findById(id)
        .populate("host","name email profileImage clerkId")
        .populate("participant","name email profileImage clerkId")

        if (!session) return res.status(404).json({message:" Session not found"})

        res.status(200).json({session})

    } catch (error) {
        console.log("Error in getSessionById controller", error.message);
        res.status(500).json({ meassge : "Internal Server Error"});
        
    }
}

export async function joinSession(req,res){

    try {
        const {id} = req.params
        const userId = req.user._id
        const clerkId = req.user.clerkId

        const session = await Session.findById(id)

        if (!session) return res.status(404).json({message:" Session not found"})

        // check if session is already full - has participant
        if (session.participant) return res.status(404).json({message:" Session is full"})

        session.participant = userId
        await session.save()

        const channel = chatClient.channel("messaging",session.callId)
        await channel.addMembers([clerkId])

        res.status(200).json({session})
        
    } catch (error) {

        console.log("Error in joinSession controller", error.message);
        res.status(500).json({ meassge : "Internal Server Error"});
        
    }

}

export async function endSession(req,res){

    try {
        
        const {id} = req.params
        const userId = req.user._id
        

        const session = await Session.findById(id)

        if (!session) return res.status(404).json({message:" Session not found"})

        // check if user is host
        if (session.host.toString() !== userId.toString())
            return res.status(403).json({message: "only host can end the session"})
        // check if session is already completed
        if (session.status === "completed"){
            return res.status(400).json({message: "session is already completed"});
        }
        session.status = "completed"
        await session.save()

        // delete steam video call
        const call = streamClient.video.call("default",session.callId)
        await call.delete({hard:true})

        //delete stream chat channel
        const channel = chatClient.channel("messaging" ,session.callId)
        await channel.delete();



        res.status(200).json({session,message:" Session is ended sucessfully"})

    } catch (error) {

        console.log("Error in endSession controller", error.message);
        res.status(500).json({ meassge : "Internal Server Error"});
    }
}