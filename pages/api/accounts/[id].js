import { getConnection, closeConnectionMongoose } from "../../../lib/mongoose/dbConnect";
import { 
  getModel, 
  findOneMongoose,
  findByIdAndUpdateMongoose,
  createUserCredentialMongoose, 
  createDocumentMongoose,
  createVerificationMongoose,
  findByIdMongoose,
} from "../../../lib/mongoose/dbModel";
import userSchema from "../../../models/User";
import accountSchema from "../../../models/Account";
import assert from "assert"
import { getProviders, signIn, signOut, useSession, getSession } from 'next-auth/react'

const dbName = process.env.ZULAR_DB

export default async function handler (req, res) {
  const {
    method,
    query: { id },
    body,
  } = req;
  
  //
  let connDb
  let sessionMongo
  let session = await getSession({ req })
  
  if ( !session || !session?.user.verified || session?.user._id !== id ) {
    return res.status(401).json({ msg: "Invalid session" });
  }
  else {
    switch (method) {
      case "GET":
        /* 
        try {
          let connDb = await getConnection(process.env.ZULAR_DB)  
          
          let User = getModel("User", userSchema, connDb)
          let Account = getModel("Account", accountSchema, connDb)  
          let userDoc = await User.findById(session.user._id).populate("accountId")
          
          let account = JSON.parse(JSON.stringify(userDoc.accountId))
          const { _id, __v, ...rest } = account
          
          return rest
        }
        
        catch (error) {
          console.log(error)
          return res.status(500).json({ msg: error.message });
        }
        finally {
          // Close the connection to the MongoDB cluster
          //await closeConnectionMongoose(connDb)
        }
        */
        return res.status(201).json({success:'success'})
      case "PUT":
        /* 
        try {
          connDb = await getConnection(dbName)
          let User = getModel("User", userSchema, connDb)
          let Account = getModel("Account", accountSchema, connDb)          
          let userDoc = await User.findById(session.user._id)

          sessionMongo = await connDb.startSession();    
          sessionMongo.startTransaction();
          
          let newAccountDoc = await findByIdAndUpdateMongoose(Account, userDoc.accountId, body, sessionMongo)
          assert.ok( newAccountDoc );
          
          await sessionMongo.commitTransaction();
          sessionMongo.endSession();
          
          return res.status(201).json(newAccountDoc)
          
        }         
        catch (error) {
          console.log(error)
          if (typeof sessionMongo !== "undefined") {
            await sessionMongo.abortTransaction();
          }
          return res.status(500).json({ msg: error.message });
        }
        finally {
          if (typeof sessionMongo !== "undefined") {  
            await sessionMongo.endSession();
          }
          // Close the connection to the MongoDB cluster
          //await closeConnectionMongoose(connDb)
        }
        */
        default:
          return res.status(401).json({ msg: "This method is not supported" });
    }
  }
};