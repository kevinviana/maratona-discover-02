const Job = require('../models/Job');
const Profile = require('../models/Profile');
const JobUtils = require('../utils/JobUtils');


module.exports = {
    index(req, res) {
        const jobs = Job.get();
        const profile = Profile.get();

        let statusCount = {
            progress: 0,
            done: 0,
            total: jobs.length
        }
        let jobsInProgressTotalHours = 0;

        const updatedJobs = jobs.map((job) => {

            const remaining = JobUtils.remainingDays(job)

            const status = remaining <= 0 ? 'done' : 'progress'

            statusCount[status] += 1;

            jobsInProgressTotalHours =  status == 'progress' ? jobsInProgressTotalHours + Number(job["daily-hours"]) : jobsInProgressTotalHours

            return {
                ...job,
                remaining,
                status,
                budget: JobUtils.calculateBudget(job, profile["value-hour"])
            }
        });
        // qtde de horas que quero trabalhar dia - quantidade de horas dia dos      jobs.status = progress
        const freeHours = profile["hours-per-day"] - jobsInProgressTotalHours;

        return res.render("index", { jobs: updatedJobs, profile: profile, statusCount: statusCount, freeHours: freeHours })
    }
}