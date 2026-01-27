const express = require("express");
const app = express();
const port = 3000;
const dataa = require("./db");
app.use(express.json());

app.get("/api/home", async (req, res) => {
    try {
        //userId comes from authentication
        const userId = 1;
        const data = await dataa.getData(userId);
        const companies = data.map(a => a.company_name); //returns array of name of companies
        const incomingPhone = data.map(a => a.incoming_phone);
        const incomingInterview = data.map(a => a.incoming_interview);
        //getting the percentage of replies
        const replies = await dataa.getCountReplies(userId);
        //number of application applied
        const rows = await dataa.getCountRows();
        let percentage = 0;
        if(replies != null) {
            percentage = (replies / rows) * 100;
        }
        const rejections = await dataa.getRejections();

        res.json({
            percentageReply: percentage,
            applicationsApplied: rows,
            rejections: rejections,
            comapany: companies,
            incomingPhone, incomingPhone,
            incomingInterview: incomingInterview, 
        });



    } catch (error) {
        console.log(error);
    }


})

app.post("/api/edit", async (req, res) => {
    try {
        const {companyName, dateApplied, statuses, incomingPhone, incomingInterview, notes} = req.body
        const userId = 1;
        const data = await dataa.addData(userId, companyName, dateApplied, statuses, incomingPhone, incomingInterview, notes);
        res.json({
            message: 'Application created successfully',
            data: data, //must send it to client since id is needed for other methods
        })
    } catch (error) {
        console.log("Error");
    }
})

app.put("/api/update/applicationId", async (req, res) => {
    try {
        const id = req.params.applicationId;
        const {companyName, dateApplied, statuses, incomingPhone, incomingInterview, notes} = req.body
        const userId = 1;
        await updateData(userId, id, companyName, dateApplied, statuses, incomingPhone, incomingInterview, notes);
        res.json({
            message: 'Application updated successfully'
        })
    } catch (error) {
        console.log(error);
    }
})

app.delete("api/delete/applicationId", async (req, res) => {
    try {
        const id = req.params.applicationId;
        const userId = 1;
        await deleteData(userId, id);
        res.json({
            message: 'Application deleted successfully'
        })
        }
    catch (error) {
        console.log(error);
    }
})

app.listen(port, () => {
    console.log(`Sever running at http://localhost:${port}`);
});
