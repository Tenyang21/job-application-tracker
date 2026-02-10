const express = require("express");
const app = express();
const port = 3000;
const dataa = require("./db");
app.use(express.json());

app.get("/test", (req, res) => {
  res.send("TEST WORKS");
});

app.get("/api/home", async (req, res) => {
  try {
    //userId comes from authentication
    const userId = 1;
    const data = await dataa.getData(userId);
    const companies = data.map((a) => a.company_name); //returns array of name of companies
    const incomingPhone = data.map((a) => a.incoming_phone);
    const incomingInterview = data.map((a) => a.incoming_interview);
    //getting the percentage of replies
    const replies = await dataa.getCountReplies(userId);
    //number of application applied
    const rows = await dataa.getCountRows(userId);
    let percentage = 0;
    if (replies > 0) {
      percentage = (replies / rows) * 100;
    }
    const rejections = await dataa.getRejections(userId);

    res.json({
      percentageReply: percentage,
      applicationsApplied: rows,
      rejections: rejections,
      company: companies,
      incomingPhone: incomingPhone,
      incomingInterview: incomingInterview,
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/sort", async (req, res) => {
  try {
    const userId = 1;
    let events = [];
    const applications = await dataa.upcomingEvents(userId);
    console.log("applications", applications);
    console.log(Array.isArray(applications));
    applications.forEach((a) => {
      if (a.incoming_phone && a.incoming_phone >= Date.now()) {
        events.push({
          type: "phone",
          company: a.company_name,
          date: a.incoming_phone,
        });
      }
    });
    applications.forEach((a) => {
      if (a.incoming_interview && a.incoming_interview >= Date.now()) {
        events.push({
          type: "interview",
          company: a.company_name,
          date: a.incoming_interview,
        });
      }
    });
    events.sort((a, b) => new Date(a.date) - new Date(b.date));
    res.json({ upcomingEvents: events });
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/edit", async (req, res) => {
  try {
    const {
      company_name, //must match the property name for destruc.
      date_applied,
      statuses,
      incoming_phone,
      incoming_interview,
      notes,
    } = req.body;
    const userId = 1;
    const data = await dataa.addData(
      userId,
      company_name,
      date_applied,
      statuses,
      incoming_phone,
      incoming_interview,
      notes,
    );
    res.json({
      message: "Application created successfully",
      data: data, //must send it to client since id is needed for other methods
    });
  } catch (error) {
    console.log("Error");
  }
});

app.patch("/api/update/:applicationId", async (req, res) => {
  try {
    const id = req.params.applicationId;
    const {
      company_name,
      date_applied,
      statuses,
      incoming_phone,
      incoming_interview,
      notes,
    } = req.body;
    const userId = 1;
    await dataa.updateData(
      userId,
      id,
      company_name,
      date_applied,
      statuses,
      incoming_phone,
      incoming_interview,
      notes,
    );
    res.json({
      message: "Application updated successfully",
    });
  } catch (error) {
    console.log(error);
  }
});

app.delete("/api/delete/:applicationId", async (req, res) => {
  try {
    const id = parseInt(req.params.applicationId);
    const userId = 1;
    await dataa.deleteData(userId, id);
    res.json({
      message: "Application deleted successfully",
    });
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Sever running at http://localhost:${port}`);
});
