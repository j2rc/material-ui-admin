import nextConnect from 'next-connect';
import multer from 'multer';
import { getProviders, signIn, signOut, useSession, getSession } from 'next-auth/react'
import { uploadImage, deleteImage } from '../../../../lib/cloudinary';

const dbName = process.env.ZULAR_DB

const storage = multer.diskStorage({
  destination: "./tmp",
  filename: function (req, file, cb) {
    const uniqueSuffix = 'image'
    cb(null, uniqueSuffix)
  }
})

const upload = multer({ storage: storage })

const handler = nextConnect({
  onError(error, req, res) {
    res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
  },
});

handler.use(upload.any())

handler.use( async (req, res, next) => {
  const {
    method,
    query: { id },
    body,
    files,
  } = req;

  let session = await getSession({ req })

  if ( !session || !session?.user.verified ) {
    console.log("invalid session")
    return res.status(401).json({ msg: "Invalid session" });
  }
  
  else {
    switch (method) {
      case "GET":
        console.log(method, id)
        return res.status(201).json({success:'success'})
      case "POST":
      case "PUT":
        /* 
        console.log("en put")
        let result = await uploadImage('./tmp/image')
        console.log("result1")
        console.log(result)
        /* 
        files.forEach( function ( file, index ) {
          console.log("antes")
          const encode_img = file.buffer.toString("base64")
          uploadImage(encode_img)
        });          
        --
       */
       return res.status(201).json({success:'success'})
        
      default:
        return res.status(401).json({ msg: "This method is not supported" });
    }
  }


  /*
  let data = {
    ...req.body,
  }  
  req.files.forEach( item => {
    data = {
      ...data,
      [item.fieldname]: {
        name: item.originalname,
        contentType: item.mimetype,
        data: item.buffer
        
      }
    }    
  });  
  */
})

export default handler;
 
export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
