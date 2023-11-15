import express from 'express'
import {registerUser,userLogin,savedPassword,fetchSavedData, deleteSavedData} from '../../controller/userController'
import verifyUserToken from '../../middlewares/authorisation/authorisation'

const router = express.Router()
console.log("Request in routes");

router.post('/sign-up',registerUser)

router.post('/login',userLogin)

router.post('/save-password',verifyUserToken,savedPassword)

router.get('/fetch-saved-data',verifyUserToken,fetchSavedData)

router.delete('/delete-saved-data',verifyUserToken,deleteSavedData)

export default router;