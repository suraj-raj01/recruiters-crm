import { getMetrics } from "../data/store.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getDashboardMetrics = asyncHandler(async (req, res) => {
  const metrics = await getMetrics();
  res.json({ metrics });
});
