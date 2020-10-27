const { Users, Campaigns } = require ('../models')

class AdminController {
    static async createAdmin(req, res,next) {
        const {role} = req.userData
        const { email,password,name,role } = req.body;
        try {
            const found = await Users.findOne({
                where: {
                    email: email 
                }
            })
            if (!found) {
                if (role === "Admin" || "admin"){
                    const createAdmin = await Users.create({
                        email,password,name,role
                    })
                        if(createAdmin){
                            const token = tokenGenerator(createAdmin)
                            res.status(200).json({token});    
                        } else {
                            res.status(400).json({
                                Success: false,
                                msg: "Failed to generate token"
                            })
                        }
                } else {
                    res.status(403).json({
                        status: 403,
                        Success: false,
                        msg: "You are not authorized to perform this action"
                    })
                }    
            } else {
                res.status(400).json({
                    Status: 400,
                    Success: false,
                    msg: "email already exist!"
                })
            }
        } catch (err) {
            next(err)
        }
    }
    static async getAllPendingCampaign(req,res,next){
        const {role} = req.userData
        try {
            if (role === "Admin" || "admin") {
                const getAll = await Campaigns.findAll({
                    where: {
                        status: "pending"
                    }, order:['id','ASC']
                })
                res.status(200).json({
                    status: 200,
                    success: true,
                    data: getAll
                })
            } else {
                req.status(403).json({
                    status: 403,
                    msg: "You are not authorized to perform this action"
                })
            }
        } catch (err) {
            next(err)
        }
    }
    static async updateCampaignStatus(req, res,next) {
        const role = req.userData.role
        const CampaignId  = req.params.id
        try {
            if (role === "Admin" || "admin") {
                const approve = await Campaigns.update({
                    status: "approved"},{
                        where: {
                            id: CampaignId
                        }
                    }
                )
                res.status(200).json({
                    Status: 200,
                    Success: true,
                    msg: "Campaign successfully updated"
                })
            } else {
                res.status.json({
                    Status : "403 - Forbidden",
                    Success : false,
                    msg: "You are not authorized to perform this action"
                })
            }
        } catch (err) {
            next(err)
        }
    }
    static async bannUser(req, res,next) {
        const {role} = req.userData
        const {id} = req.params
        try {
            if (role === "Admin" || "admin") {
                const found = await Users.findOne({
                    id: id
                })
                if (found) {
                    if (found.role === "Admin" || "admin") {
                        res.status(401).json({
                            msg: "Admin cannot bann another admin"
                        })
                    } else {
                        const bann = await Users.update({
                            status: "banned"
                        },{
                            where: { 
                                id :id
                            }
                        })
                        const CampaignStatus = await Campaigns.findAll({
                            where: {
                                UserId : id
                            }
                        })
                        // CampaignStatus.forEach(el => {
                        //     const updateStatus = await Campaigns.update({
                        //         status: 'pending'}, {
                        //             where: {
                        //                 UserId: id,
                        //                 status: 'approved'
                        //             }
                        //     })                            
                        // });
                        // for (let i = 0; i < CampaignStatus.length; i++) {
                            const updateStatus = await CampaignStatus.update({
                                status: 'pending'}, {
                                    where: {
                                        UserId: id,
                                        status: 'approved'
                                    }
                            })
                        // }
                        res.status(200).json({
                            status: 200,
                            success: true,
                            msg: "User successfully banned"
                        })
                    }
                }else {
                    res.status(404).json({
                        Status: "User Not Found",
                    })
                }
            } else {
                res.status(403).json({
                    Status: 403,
                    msg: "You're not authorized to perform this action"
                })
            }
        } catch (err) {
            next(err)
        }
    }
}

module.exports = AdminController