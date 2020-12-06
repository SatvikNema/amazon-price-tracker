import express from "express";
const router = express.Router();
import { CronJob as cronJob } from "cron";
import Product from "../models/product";
import { updateDetail } from "../utils/notifications";
import { isAdminAccount } from "../middleware/checkUserMiddleware";

const cronTimeString = "0 6 */1 * *", // "*/20 * * * * *",  "0 6 */1 * *"
	onComplete = null,
	start = false,
	timeZone = "Asia/Kolkata";

let updateJob = null;
async function onTick() {
	try {
		const products = await Product.find();
		const promisedOfUpdates = products.map(updateDetail);
		await Promise.all(promisedOfUpdates);
		// console.log("all updated");
	} catch (e) {
		console.log("err while running update-cron");
	}
}

router.get("/startUpdateJob", isAdminAccount, async (req, res) => {
	try {
		updateJob = new cronJob({
			cronTime: cronTimeString,
			onTick: onTick,
			onComplete: onComplete,
			start: start,
			timeZome: timeZone,
		});
		updateJob.start();
		const obj = {
			nextTime: updateJob.nextDates().toLocaleString(),
		};
		return res.json(obj);
	} catch (e) {
		res.status(404).json("Error: " + e);
	}
});

router.get("/stopUpdateJob", isAdminAccount, async (req, res) => {
	try {
		if (updateJob) updateJob.stop();
		res.json("update job was stopped!");
	} catch (e) {
		console.log(e);
	}
});

export default router;
