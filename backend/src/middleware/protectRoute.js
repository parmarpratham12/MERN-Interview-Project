// import { requireAuth } from '@clerk/express'
// import User from '../models/User.js'

// export const protectRoute = [
//   requireAuth({ signInUrl: "/sign-in" }),
//   async (req, res, next) => {

//     try {

//       const clerkId = req.auth.userId;
//       if (!clerkId) return res.status(401).json({ msg: "Unauthorized - invalid token" })

//       // find user in db by clerk ID
//       const user = await User.findOne({ clerkId })

//       if (!user) return res.status(404).json({ msg: "User not Found" })
//       // attach user to req
//       req.user = user
//       next()

//     }
//     catch (error) {
//       console.error("Error in protectRoute middleware", error)
//       res.status(500).json({ message: "Internal server Error" })

//     }

//   }


// ];
import { clerkClient } from '@clerk/express';
import User from '../models/User.js';
import { upsertStreamUser } from '../lib/stream.js';

export const protectRoute = async (req, res, next) => {
  try {
    // 1. Clerk's global clerkMiddleware() has already verified the JWT and populated req.auth
    const auth = typeof req.auth === "function" ? req.auth() : req.auth;
    const clerkId = auth?.userId;

    // 2. If the user is unauthenticated, return a clean JSON 401 response (No Redirection!)
    if (!clerkId) {
      return res.status(401).json({ msg: "Unauthorized - invalid token" });
    }

    // 3. Find the user in the MongoDB database
    let user = await User.findOne({ clerkId });

    // 4. If user doesn't exist in our DB, auto-sync them from Clerk
    if (!user) {
      try {
        console.log(`User ${clerkId} not found in DB. Auto-syncing from Clerk...`);
        const clerkUser = await clerkClient.users.getUser(clerkId);
        
        user = await User.create({
          clerkId,
          email: clerkUser.emailAddresses[0]?.emailAddress || "",
          name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "Anonymous",
          profileImage: clerkUser.imageUrl || ""
        });
        
        console.log(`User ${user.name} auto-created in MongoDB.`);

        await upsertStreamUser({
          id: clerkId,
          name: user.name,
          image: user.profileImage
        });
      } catch (syncError) {
        console.error("Failed to auto-sync user from Clerk:", syncError);
        return res.status(404).json({ msg: "User not Found" });
      }
    }

    // 5. Attach the MongoDB document to req.user and call next() to pass execution to the controller
    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware", error);
    res.status(500).json({ message: "Internal server Error" });
  }
  
};



