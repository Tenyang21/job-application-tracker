import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401);
    const user = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string,
    ) as { id: number };
    (req as any).userId = user.id;
    next();
  } catch (error) {
    return res.sendStatus(403);
  }
}

export default authenticate;