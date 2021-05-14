const express = require('express')
const routes = express.Router()

const views = __dirname + "/views/"

const Profile = {
    data: {
        name: "Kévin",
        avatar: "http://github.com/kevinviana.png",
        "monthly-budget": 3000,
        "hours-per-day": 5,
        "days-per-week": 5,
        "vacation-per-year": 4,
        "value-hour": 30,
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
            const valueHour= data["monthly-budget"] / totalMonthlyWorkingHours

            Profile.data = {
                ...Profile.data,
                ...req.body,
                "value-hour": valueHour
            }

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
        },
        {
            id: 2,
            name: "OneTwo Project",
            "daily-hours": 3,
            "total-hours": 47,
            created_at: Date.now(),
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
                    budget: Job.services.calculateBudget(job, Profile.data["value-hour"])
                }
            })

            return res.render(views + "index", { jobs: updatedJobs })
        },
        
        create(req, res) {
            return res.render(views + "job")
        },
        
        save(req, res) {

            const last_id = Job.data[Job.data.length - 1]?.id || 0;

            Job.data.push({
                id: last_id + 1,
                name: req.body.name,
                "daily-hours": req.body["daily-hours"],
                "total-hours": req.body["total-hours"],
                created_at: Date.now()
            });
            return res.redirect('/');
        },

        show(req, res) {

            const jobId = req.params.id

            const job = Job.data.find(job => Number(job.id) === Number(jobId))

            if (!job) {
                return res.send('Job not found')
            }

            job.budget = Job.services.calculateBudget(job, Profile.data["value-hour"])
            return res.render(views + "job-edit", { job })
        },

        update(req, res) {

            const jobId = req.params.id

            const job = Job.data.find(job => Number(job.id) === Number(jobId))

            if (!job) {
                return res.send('Job not found')
            }

            const updatedJob = {
                ...job,
                name: req.body.name,
                "total-hours": req.body["total-hours"],
                "daily-hours": req.body["daily-hours"]
            }

            Job.data = Job.data.map((job) => {

                if(Number(job.id) === Number(jobId)) {
                    job = updatedJob
                }

                return job
            })
            res.redirect('/job/' + jobId)
        },

        delete(req,res) {

            const jobId = req.params.id

            Job.data = Job.data.filter(job => Number(job.id) !== Number(jobId))

            return res.redirect('/')
        }
    },

    services: {
        remainingDays(job) {

            const daysToDueDate = Math.ceil(job["total-hours"] / job["daily-hours"])

            const createdDate = new Date(job.created_at)
            const dueDay = createdDate.getDate() + Number(daysToDueDate)
            const dueDateInMs = createdDate.setDate(dueDay)

            const remainingDaysInMs = dueDateInMs - Date.now()
            const oneDayInMs = 1000 * 60 * 60 * 24

            const remainingDaysInDays = Math.ceil(remainingDaysInMs / oneDayInMs)

            return remainingDaysInDays
        },
        calculateBudget(job, valueHour) {
            const budget = valueHour * job['total-hours']

            return budget
        }
    },
}

routes.get('/', Job.controllers.index)
routes.get('/job', Job.controllers.create)
routes.post('/job', Job.controllers.save)
routes.get('/job/:id', Job.controllers.show)
routes.post('/job/:id', Job.controllers.update)
routes.post('/job/delete/:id', Job.controllers.delete)
routes.get('/profile', Profile.controllers.index)
routes.post('/profile', Profile.controllers.update)



module.exports = routes;