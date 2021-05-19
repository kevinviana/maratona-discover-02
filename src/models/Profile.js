let data = {
    name: "Kévin",
    avatar: "http://github.com/kevinviana.png",
    "monthly-budget": 3000,
    "hours-per-day": 5,
    "days-per-week": 5,
    "vacation-per-year": 4,
    "value-hour": 30,
};

module.exports = {
    get() {
        return data;
    },
    update(newData) {
        data = newData
    }
};