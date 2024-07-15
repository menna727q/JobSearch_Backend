import express from "express"
import { connectDB } from "./db/connection.js"
import { userRouter } from "./src/modules/user/user.router.js"
import bodyParser from "body-parser"
import { companyrouter } from "./src/modules/company/company.router.js"
import { jobRouter } from "./src/modules/jobs/jobs.router.js"
import { globalErrorHandling } from "./src/utils/asyncHandler.js"
const app= express()

app.use(bodyParser.json())

app.use('/user',userRouter)
app.use('/company',companyrouter)
app.use('/job',jobRouter)

app.use((req,res,next)=>{
    console.log("middleware 1")
    next(new Error("error"))
})
app.use((req,res,next)=>{
    console.log("middleware 2")
})

app.use(globalErrorHandling)
const port=3000
connectDB()

app.listen(port,()=>{
    console.log("Server is running on port",port)
})