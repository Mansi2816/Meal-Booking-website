const express = require("express");
const router = express.Router();
const { Meal } = require("../model/mealBooking");
const Joi = require("joi");
const authAdmin = require("../middleware/auth-admin");
const moment = require("moment");

router.get('/calendarData', async (req, res) => {
    try {
        // const { value, error } = getDataByDateSchemaValidation().validate(req.body);
        // if (error) return res.status(400).send({ Message: "Please enter valid data" });

        let date = moment(req.body.date).startOf("day").utcOffset(0, true);

        const employeeMeal = await Meal.find({
            date: { $eq: date },
            type: "employee",
            'disableData.disable': false
        });
        let fcount;
        console.log(employeeMeal);
        const resultEmployee = employeeMeal.map((meal) => {
            return {
                EmployeeMealBooked: meal.lunch + meal.dinner,
            };
        })

        //custom data fetch
        const customMeal = await Meal.find({
            date: { $eq: date },
            type: "custom",
            'disableData.disable': false
        });
        console.log(customMeal)
        const resultCustom = customMeal.map((meal) => {
            return {
                CustomMealBooked: meal.lunch + meal.dinner,
            }
        })

        //non employee data fetch
        const nonEmployeeMeal = await Meal.find({
            date: { $eq: date },
            type: "non employee",
            'disableData.disable': false
        });
        console.log(nonEmployeeMeal);
        const resultNonEmployee = nonEmployeeMeal.map((meal) => {
            return {
                NonEmployeeBooked: meal.lunch + meal.dinner,
            }
        });

        const resultEmployeeSum = resultEmployee.reduce((sum, meal) => sum + meal.EmployeeMealBooked, 0);
        const resultCustomSum = resultCustom.reduce((sum, meal) => sum + meal.CustomMealBooked, 0);
        const resultNonEmployeeSum = resultNonEmployee.reduce((sum, meal) => sum + meal.NonEmployeeBooked, 0);

        res.status(200).send({"Employee" : resultEmployeeSum, "Non employee" : resultNonEmployeeSum, "Custom" : resultCustomSum});

    } catch (error) {
        res.status(400).send({ Error: "Something went wrong" , Error : error.message});
    }
});

module.exports = router;