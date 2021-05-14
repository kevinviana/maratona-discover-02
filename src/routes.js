const express = require('express')
const routes = express.Router()

const views = __dirname + "/views/"

const Profile = {
    data: {
        name: "Kévin",
        avatar: "http://github.com/kevinviana.png",
        "monthly-budget": 0,
        "hours-per-day": 0,
        "days-per-week": 0,
        "vacation-per-year": 0,
        "value-hour": 0,
    },

    controllers: {
        index(req, res) {
            return res.render(views + "profile", { profile: Profile.data })
        },
        update(req, res) {
            const data = req.body
            //semanas em um ano = 52
            const weeksPerYear = 52
            //semanas de trabalho mensais = semanas no ano - semanas de ferias no ano
            const monthlyWorkWeeks = (weeksPerYear - data["vacation-per-year"]) / 12
            //total de horas de trabalho semanais = dias de trabalho semanais * horas de trabalho por dia
            const totalWeeklyWorkingHours = data["days-per-week"] * data["hours-per-day"]
            //total de horas de trabalho mensais = total de horas de trabalho semanais * semanas de trabalho mensais
            const totalMonthlyWorkingHours = totalWeeklyWorkingHours * monthlyWorkWeeks
            //valor da hora de trabalho = ganhos mensais / total de horas de trabalho mensais
            data["value-hour"] = data["monthly-budget"] / totalMonthlyWorkingHours

            Profile.data = data

            return res.redirect("/profile")
        },
    }
}

const Job = {
    data: [
        {
            id: 1,
            name: "Pizzaria Guloso",
            "daily-hours": 2,
            "total-hours": 60,
            created_at: Date.now(),
            budget: 4500
        },
        {
            id: 2,
            name: "OneTwo Project",
            "daily-hours": 3,
            "total-hours": 47,
            created_at: Date.now(),
            budget: 4500
        }
    ],

    controllers: {
        index(req, res) {

            const updatedJobs = Job.data.map((job) => {

                const remaining = Job.services.remainingDays(job)

                const status = remaining <= 0 ? 'done' : 'progress'

                return {
                    ...job,
                    remaining,
                    status,
                    budget: Profile.data['value-hour'] * job['total-hours']
                }
            })

            return res.render(views + "index", { jobs: updatedJobs })
        },

        save(req, res) {

            const last_id = Job.data[Job.data.length - 1]?.id || 0;
            //const job = req.body;
            //job.created_at = Date.now();

            Job.data.push({
                id: last_id + 1,
                name: req.body.name,
                "daily-hours": req.body["daily-hours"],
                "total-hours": req.body["total-hours"],
                created_at: Date.now()
            });
            return res.redirect('/');
        },

        create(req, res) {
            return res.render(views + "job")
        },

        show(req, res) {

            const jobId = req.params.id

            const job = Job.data.find(job => Number(job.id) === Number(jobId))

            if (!job) {
                return res.send('Job not found')
            }

            return res.render(views + "job-edit", { job })
        }
    },

    services: {
        remainingDays(job) {

            const daysToDueDate = (job["total-hours"] / job["daily-hours"]).toFixed()

            const createdDate = new Date(job.created_at)
            const dueDay = createdDate.getDate() + Number(daysToDueDate)
            const dueDateInMs = createdDate.setDate(dueDay)

            const remainingDaysInMs = dueDateInMs - Date.now()
            const oneDayInMs = 1000 * 60 * 60 * 24

            const remainingDaysInDays = Math.ceil(remainingDaysInMs / oneDayInMs)

            return remainingDaysInDays
        },
    },
}

routes.get('/', Job.controllers.index)
routes.get('/job', Job.controllers.create)
routes.post('/job', Job.controllers.save)
routes.get('/job/:id', Job.controllers.show)
routes.get('/profile', Profile.controllers.index)
routes.post('/profile', Profile.controllers.update)



module.exports = routes;
