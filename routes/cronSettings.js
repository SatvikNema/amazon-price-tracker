const router = require("express").Router(),
	cronJob = require("cron").CronJob,
	fetch = require("node-fetch"),
	{ isAdminAccount } = require("./utils"),
	updateURL = process.env.baseURL + "/updateAll";

// const cronTimeString = "0 0 */1 * *",
const cronTimeString = "*/20 * * * * *",
	onTick = () => {
		fetch(updateURL)
			.then((res) => res.json())
			.then((response) => console.log(response))
			.catch((e) => console.log(e));
		// console.log("hello");
	},
	onComplete = null,
	start = false,
	timeZone = "Asia/Kolkata";

const updateJob = new cronJob(
	cronTimeString,
	onTick,
	onComplete,
	start,
	timeZone
);
router.get("/startUpdateJob", isAdminAccount, async (req, res) => {
	try {
		updateJob.start();
		// res.json("Update job started");
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
		updateJob.stop();
		res.json("update job was stopped!");
	} catch (e) {
		console.log(e);
	}
});
module.exports = router;
