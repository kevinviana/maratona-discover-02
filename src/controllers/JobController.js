const Job = require("../models/Job")
const JobUtils = require("../utils/JobUtils")
const Profile = require("../models/Profile")

module.exports = {
    create(req, res) {
        return res.render("job")
    },
    
    async save(req, res) {
        await Job.create({
            name: req.body.name,
            "daily-hours": req.body["daily-hours"],
            "total-hours": req.body["total-hours"],
            created_at: Date.now()
        });
        return res.redirect('/');
    },

    async show(req, res) {
        const jobs = await Job.get();
        const profile = await Profile.get();

        const jobId = req.params.id

        const job = jobs.find(job => Number(job.id) === Number(jobId))

        if (!job) {
            return res.send('Job not found')
        }

        job.budget = JobUtils.calculateBudget(job, profile["value-hour"])
        return res.render("job-edit", { job })
    },

    async update(req, res) {
        const jobId = req.params.id
        const jobs = await Job.get();

        const job = jobs.find(job => Number(job.id) === Number(jobId))

        if (!job) {
            return res.send('Job not found')
        }

        const updatedJob = {
            ...job,
            name: req.body.name,
            "total-hours": req.body["total-hours"],
            "daily-hours": req.body["daily-hours"]
        }

        const newJobs = jobs.map((job) => {

            if(Number(job.id) === Number(jobId)) {
                job = updatedJob
            }
            return job
        });
        Job.update(newJobs)

        res.redirect('/job/' + jobId)
    },

    delete(req,res) {
        const jobId = req.params.id
        
        Job.delete(jobId)

        return res.redirect('/')
    }
}