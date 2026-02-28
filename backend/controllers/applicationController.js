const dataa = require("../models/applicationModel");

exports.Home = async (req, res) => {
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
};

exports.sortEvents = async (req, res) => {
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
};

exports.addApplication = async (req, res) => {
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
};

exports.updateApplication = async (req, res) => {
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
};

exports.deleteApplication = async (req, res) => {
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
};
