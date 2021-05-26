const Profile = require('../models/Profile')

module.exports = {
    async index(req, res) {
        return res.render("profile", { profile: await Profile.get() })
    },
    async update(req, res) {
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
        const valueHour = data["monthly-budget"] / totalMonthlyWorkingHours

        const profile = await Profile.get();
        
        await Profile.update({
            ...profile,
            ...req.body,
            "value-hour": valueHour}) 

        return res.redirect("/profile")
    },
}