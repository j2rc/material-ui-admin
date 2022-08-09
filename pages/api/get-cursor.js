import { getConnection, closeConnectionMongoose } from "../../lib/mongoose/dbConnect";
import { 
  getModel, 
  findOneMongoose,
  findByIdAndUpdateMongoose,
  createUserCredentialMongoose, 
  createDocumentMongoose,
  createVerificationMongoose,
  findByIdMongoose,
} from "../../lib/mongoose/dbModel";
import userSchema from "../../models/User";
import airbnbSchema from "../../models/Airbnb";
import assert from "assert"

export default async function handler (req, res) {
  let connDb = await getConnection(process.env.ZULAR_DB)  
  let Airbnb = getModel("listingsAndReview", airbnbSchema, connDb)
  let User = getModel("User", userSchema, connDb)
  let cursor = await Airbnb.find()
  
  return res.status(201).json({data: cursor })
};