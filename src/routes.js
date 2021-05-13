const express = require('express')
const routes = express.Router()

const views = __dirname + "/views/"

const profile = {
    "name": "Kévin",
    "avatar": "http://github.com/kevinviana.png",
    "monthly-budget": 3000,
    "hours-per-day": 5,
    "days-per-week": 5,
    "vacation-per-year": 4,
    "value-hour":75,
}

const jobs = [
    {
        id: 1,
        name: "Pizzaria Guloso",
        "daily-hours": 2,
        "total-hours": 60,
        created_at: Date.now(),
    },
    {
        id: 1,
        name: "OneTwo Project",
        "daily-hours": 3,
        "total-hours": 47,
        created_at: Date.now(),
    }
]

function remainingDays(job) {

    const daysToDueDate = (job["total-hours"] / job["daily-hours"]).toFixed()

    const createdDate = new Date(job.created_at)
    const dueDay = createdDate.getDate() + Number(daysToDueDate)
    const dueDateInMs = createdDate.setDate(dueDay)

    const remainingDaysInMs = dueDateInMs - Date.now()
    const oneDayInMs = 1000 * 60 * 60 * 24

    const remainingDaysInDays = Math.ceil(remainingDaysInMs / oneDayInMs)

    return remainingDaysInDays
}


routes.get('/', (req, res) => {

    const updatedJobs = jobs.map((job) => {

        const remaining = remainingDays(job)

        const status = remaining <= 0 ? 'done' : 'progress'

        return {
            ...job,
            remaining,
            status,
            budget: profile['value-hour'] * job['total-hours']
        }
    })

    res.render(views + "index", { jobs: updatedJobs })

})
routes.get('/job', (req, res) => res.render(views + "job"))
routes.post('/job', (req, res) => {

    const last_id = jobs[jobs.length - 1]?.id || 1;
        //const job = req.body;
        //job.created_at = Date.now();

        jobs.push({
            id: last_id + 1,
            name: req.body.name,
            "daily-hours": req.body["daily-hours"],
            "total-hours": req.body["total-hours"],
            created_at: Date.now()
        });
    return res.redirect('/');
})
routes.get('/job/edit', (req, res) => res.render(views + "job-edit"))
routes.get('/profile', (req, res) => res.render(views + "profile", { profile }))



module.exports = routes;
