const { Router } = require ('express')
const router = Router()
const auth = require('../middlewares/auth');
const userController = require('../controllers/Users')
const campaignController = require('../controllers/Campaign');

// create a new admin
router.post('/add_admin', auth,userController.createAdmin)

//admin approving users Campaign
router.put('/approve', auth,campaignController.updateCampaignStatus)


module.exports = router;