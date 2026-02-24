const express = require("express");
const app = express();
const port = 5000;
const dataa = require("./db");
app.use(express.json());

const bcrypt = require("bcrypt");
const saltRounds = 10;

const jwt = require("jsonwebtoken");

const cors = require("cors");
app.use(cors({ origin: "http://localhost:3000" }));

app.get("/api/home", authenticate, async (req, res) => {
  try {
    //userId comes from authentication
    const userId = req.userId;
    const data = await dataa.getData(userId);
    const replies = await dataa.getCountReplies(userId);
    const rows = await dataa.getCountRows(userId);
    const rejects = await dataa.getRejections(userId);

    const replyRate = parseInt(replies.count); //.count gets the value from the object
    const totalApplications = parseInt(rows.count);
    const rejections = parseInt(rejects.count);

    let percentage = 0;
    if (replyRate > 0) {
      percentage = Math.trunc((replyRate / totalApplications) * 100);
    }
    res.json({
      stats: {
        totalApplications: totalApplications,
        replyRate: percentage,
        rejections: rejections,
      },
      applications: data.map((a) => ({ ...a, _id: a.application_id })), //match it with frontend
    }); //due to frontend design
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/sort", authenticate, async (req, res) => {
  try {
    const userId = req.userId;
    let events = [];
    const applications = await dataa.upcomingEvents(userId);
    applications.forEach((a) => {
      if (
        a.incoming_phone &&
        new Date(a.incoming_phone) >= Date.now() &&
        a.statuses != "rejected"
      ) {
        events.push({
          type: "phone",
          company_name: a.company_name,
          date: a.incoming_phone,
          application_id: a.application_id,
        });
      }
    });
    applications.forEach((a) => {
      if (
        a.incoming_interview &&
        new Date(a.incoming_phone) >= Date.now() &&
        a.statuses != "rejected"
      ) {
        events.push({
          type: "interview",
          company_name: a.company_name,
          date: a.incoming_interview,
          application_id: a.application_id,
        });
      }
    });
    events.sort((a, b) => new Date(a.date) - new Date(b.date));
    res.json(events);
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/edit", authenticate, async (req, res) => {
  try {
    const {
      company_name, //must match the property name for destruc.
      date_applied,
      statuses,
      incoming_phone,
      incoming_interview,
      notes,
      position,
    } = req.body;
    const userId = req.userId;
    const data = await dataa.addData(
      userId,
      company_name,
      date_applied,
      statuses,
      incoming_phone || null,
      incoming_interview || null,
      notes,
      position,
    );
    res.json({
      success: "Application created successfully",
      data: data, //must send it to client since id is needed for other methods
    });
  } catch (error) {
    console.log("Error");
  }
});

app.patch("/api/update/:applicationId", authenticate, async (req, res) => {
  try {
    const id = req.params.applicationId;
    const {
      company_name,
      date_applied,
      statuses,
      incoming_phone,
      incoming_interview,
      notes,
      position,
    } = req.body;
    const userId = req.userId;
    await dataa.updateData(
      userId,
      id,
      company_name,
      date_applied,
      statuses,
      incoming_phone || null,
      incoming_interview || null,
      notes,
      position,
    );
    res.json({
      success: "Application updated successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update application" });
  }
});

app.delete("/api/delete/:applicationId", authenticate, async (req, res) => {
  try {
    const id = parseInt(req.params.applicationId);
    const userId = req.userId;
    await dataa.deleteData(userId, id);
    res.json({
      success: "Application deleted successfully",
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email == null || password == null) {
      return res.status(400).json({
        error: "missing or invalid input",
      });
    }
    const userData = await dataa.getUserByEmail(email);
    if (!userData) {
      //user isn't registered yet
      const hash = await bcrypt.hash(password, saltRounds);
      const data = await dataa.signup(email, hash);
      if (data) {
        return res.status(201).json({
          success: "Registered",
        });
      } else {
        return res.status(500).json({
          error: "db connection fail",
        });
      }
    } else {
      return res.status(409).json({
        error: "email already exists",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await dataa.getUserByEmail(email); //this is much better than getting datas from all the users
    if (!userData) {
      return res.status(400).json({
        error: "Invalid email or password",
      });
    }
    const match = await bcrypt.compare(password, userData.password); //check if the password matches
    if (match) {
      const accessToken = jwt.sign(
        { id: userData.user_id },
        process.env.ACCESS_TOKEN_SECRET,
      ); //payload
      res.status(200).json({
        accessToken: accessToken,
        message: "login successfull",
      });
    } else {
      res.status(400).json({
        error: "Invalid email or password",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

function authenticate(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401);
    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.userId = user.id;
    next();
  } catch (error) {
    return res.sendStatus(403);
  }
}

app.listen(port, () => {
  console.log(`Sever running at http://localhost:${port}`);
});
