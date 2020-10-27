const {tokenVerifier} = require('../helpers/jwt');
const { Campaigns } = require('../models')

const authentication = (req,res,next) => {
    const {token} = req.headers;
    if(!token){
        res.status(404).json({message: 'token not found'})
    }else{
        try{
            const decode = tokenVerifier(token);
            req.userData = decode;
            next()
        }catch(err){ res.status(500).json({message: err.message})}
    }
}

const authoCampaign = (req,res,next) => {
    console.log("Authorization campaign works!");
    const id = req.params.id;
    const UserId = req.userData.id

    Campaigns.findOne({
        where : {
            id
        }
    }).then(element=>{
        if(element){
            if(element.UserId === UserId){
                next();
            }else{
                throw {
                    status : 403,
                    msg : "User doesn't have any access"
                }
            }
        }else{
            throw {
                status : 404,
                msg : "Campaign not found" 
            }
        }

    }).catch(err=>{
        res.status(500).json(err)
    })
}
// const CampaignStatus = ( req,res,next) => {
//     const role = req.userData.role
//     const CampaignId  = req.params.id
//     try {
//         if (role === "Admin" || "admin") {
//             next()
//         } else {
//             res.status.json({
//                 Status : "403 - Forbidden",
//                 Success : false,
//                 msg: "You are not authorized to perform this action"
//             })
//         }
//     } catch (err){
//         next(err)
//     }
// }
module.exports = {authentication, authoCampaign};
