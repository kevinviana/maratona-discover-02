module.exports = {
    remainingDays(job) {

        const daysToDueDate = Math.round(job["total-hours"] / job["daily-hours"])

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
}