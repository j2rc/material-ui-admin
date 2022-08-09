export default async function handler (req, res) {

    await new Promise( function (resolve, reject) {

        setTimeout(() => {
            console.log("resolve")
            resolve({
                data: "success",
              })  
        }, 60000);

    })
    console.log("enviado")
    return res.status(201).json({time: "1 minute"})
};