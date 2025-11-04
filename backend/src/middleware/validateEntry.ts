import { Request, Response, NextFunction } from "express";

export const validateEntry = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { entryType, foodName, symptomType, exerciseType } = req.body;

  if (!entryType) {
    return res.status(400).json({ error: "entryType is required " });
  }

  const validTypes = ["food", "symptom", "exercise"];
  if (!validTypes.includes(entryType)) {
    return res
      .status(400)
      .json({ error: "entryType must be food, symptom, or exercise" });
  }

  // Type-specific validation
  if (entryType === "food" && !foodName) {
    return res
      .status(400)
      .json({ error: "foodName is required for food entries " });
  }

  if (entryType === "symptom" && !symptomType) {
    return res
      .status(400)
      .json({ error: "symptomType is required for symptom entries " });
  }

  if (entryType === "exercise" && !exerciseType) {
    return res
      .status(400)
      .json({ error: "exerciseType is required for exercise entries " });
  }

  next();
};
