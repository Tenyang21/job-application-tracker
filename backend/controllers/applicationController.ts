import * as dataa from "../models/applicationModel";
import { UpcomingEvents, UpdateBody } from "../types";
import { Request, Response, NextFunction } from "express";

export const Home = async (req: Request, res: Response) => {
  try {
    //userId comes from authentication
    const userId = req.userId;
    const data = await dataa.getData(userId!); //! - non null assertion
    const replies = await dataa.getCountReplies(userId!);
    const rows = await dataa.getCountRows(userId!);
    const rejects = await dataa.getRejections(userId!);

    const replyRate = parseInt(replies.count); //.count gets the value from the object
    const totalApplications = parseInt(rows.count);
    const rejections = parseInt(rejects.count);

    let percentage = 0;
    if (replyRate > 0) {
      percentage = Math.trunc((replyRate / totalApplications) * 100);
    }
    res.status(200).json({
      stats: {
        totalApplications: totalApplications,
        replyRate: percentage,
        rejections: rejections,
      },
      applications: data.map((a) => ({ ...a, _id: a.application_id })), //match it with frontend
    }); //due to frontend design
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to load application" });
  }
};

export const sortEvents = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    let events: UpcomingEvents[] = [];
    const applications = await dataa.upcomingEvents(userId!);
    const now = new Date();
    applications.forEach((a) => {
      if (a.statuses === "rejected") return;
      if (a.incoming_phone && new Date(a.incoming_phone) >= now) {
        events.push({
          type: "phone",
          company_name: a.company_name,
          date: a.incoming_phone,
          application_id: a.application_id,
        });
      }
      if (a.incoming_interview && new Date(a.incoming_interview) >= now) {
        events.push({
          type: "interview",
          company_name: a.company_name,
          date: a.incoming_interview,
          application_id: a.application_id,
        });
      }
    });
    events.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    res.status(200).json(events);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to load application" });
  }
};

export const addApplication = async (req: Request, res: Response) => {
  try {
    const {
      company_name, //must match the property name for destruc.
      date_applied,
      statuses,
      incoming_phone,
      incoming_interview,
      notes,
      position,
    } = req.body as UpdateBody;
    const userId = req.userId;
    const data = await dataa.addData(
      userId!,
      company_name,
      date_applied,
      statuses,
      incoming_phone || null,
      incoming_interview || null,
      notes,
      position,
    );
    res.status(200).json({
      success: "Application created successfully",
      data: data, //must send it to client since id is needed for other methods
    });
  } catch (error) {
    console.log("Error");
    res.status(500).json({ error: "Failed to load application" });
  }
};

export const updateApplication = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.applicationId as string);
    const {
      company_name,
      date_applied,
      statuses,
      incoming_phone,
      incoming_interview,
      notes,
      position,
    } = req.body as UpdateBody; //type it expects.
    const userId = req.userId;
    await dataa.updateData(
      userId!,
      id,
      company_name,
      date_applied,
      statuses,
      incoming_phone || null,
      incoming_interview || null,
      notes,
      position,
    );
    res.status(200).json({
      success: "Application updated successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update application" });
  }
};

export const deleteApplication = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.applicationId as string);
    const userId = req.userId;
    await dataa.deleteData(userId!, id);
    res.status(200).json({
      success: "Application deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to load application" });
  }
};
