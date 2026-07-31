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
import User from '../models/User.js'

export const protectRoute = async (req, res, next) => {
  try {
    // 1. Clerk's global clerkMiddleware() has already verified the JWT and populated req.auth
    const clerkId = req.auth.userId;

    // 2. If the user is unauthenticated, return a clean JSON 401 response (No Redirection!)
    if (!clerkId) {
      return res.status(401).json({ msg: "Unauthorized - invalid token" });
    }

    // 3. Find the user in the MongoDB database
    const user = await User.findOne({ clerkId });

    // 4. If user doesn't exist in our DB, return a 404
    if (!user) {
      return res.status(404).json({ msg: "User not Found" });
    }

    // 5. Attach the MongoDB document to req.user and call next() to pass execution to the controller
    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware", error);
    res.status(500).json({ message: "Internal server Error" });
  }
};



