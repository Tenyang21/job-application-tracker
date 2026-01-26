const express = require("express");
const app = express();
const port = 3000;
const dataa = require("./db");
app.use(express.json());

app.get("/api/home", async (req, res) => {
    try {
        //userId comes from authentication
        await dataa.getData(userId);
        //getting the percentage of replies
        const replies = await dataa.getCountReplies(userId);
        //number of application applied
        const rows = await dataa.getCountRows();
        let percentage = 0;
        if(replies != null) {
            percentage = (replies / rows) * 100;
        }
        const rejections = await dataa.getRejections();
        const incomingPhone = await dataa.getIncomingPhone();
        const incomingInterview = await dataa.getIncomingInterview();


    } catch (error) {
        console.log(error);
    }


})

app.post("/api/edit", async (req, res) => {
    try {
        const {companyName, dateApplied, statuses, incomingPhone, incomingInterview, notes} = req.body
        await addData(UserId, companyName, dateApplied, statuses, incomingPhone, incomingInterview, notes);
    } catch (error) {
        console.log("Error");
    }
})

app.put("/api/update/applicationId", async (req, res) => {
    try {
        const id = req.params.applicationId;
        const {companyName, dateApplied, statuses, incomingPhone, incomingInterview, notes} = req.body
        await updateData(UserId, id, companyName, dateApplied, statuses, incomingPhone, incomingInterview, notes);
    } catch (error) {
        console.log(error);
    }
})

app.delete("api/delete/applicationId", async (req, res) => {
    try {
        const id = req.params.applicationId;
        await deleteData(UserId, id);
    } catch (error) {
        console.log(error);
    }
})

app.listen(port, () => {
    console.log(`Sever running at http://localhost:${port}`);
});
