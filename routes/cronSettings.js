const router = require("express").Router(),
	cronJob = require("cron").CronJob,
	fetch = require("node-fetch"),
	Product = require("../models/product"),
	{ isAdminAccount, updateDetail } = require("./utils");
const domain = null;
let updateJob = null;
// const cronTimeString = "0 0 */1 * *",
const cronTimeString = "*/20 * * * * *",
	onComplete = null,
	start = false,
	timeZone = "Asia/Kolkata";

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
		const onTickWithRes = onTick.bind({ res });
		updateJob = new cronJob({
			cronTime: cronTimeString,
			onTick: onTickWithRes,
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
module.exports = router;
