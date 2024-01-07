const express = require("express");
const router = express.Router();
const { Meal } = require("../model/mealBooking");
const Joi = require("joi");
const authAdmin = require("../middleware/authAdmin");
const moment = require("moment");

router.post('/disableDatesInRange', authAdmin, async (req, res) => {
    try {
        const { value, error } = disableDatesInRangeValidationSchema().validate(req.body);
        if (error) return res.status(400).send({ Message: "Please enter valid data" });

        const startDisable = moment(value.startDate);
        const endDisable = moment(value.endDate);

        // Check if any existing dates are within the specified range
        const existingMeals = await Meal.find({
            date: {
                $gte: startDisable.toDate(),
                $lte: endDisable.toDate()
            },
        });

        if (existingMeals.length === 0) {
            // No existing dates found, create new disabled dates
            for (let currentMoment = startDisable.clone();
                currentMoment.isSameOrBefore(endDisable);
                currentMoment.add(1, 'day')) {
                await Meal.create({
                    date: currentMoment.toDate(),
                    disableData: {
                        reason: value.reason,
                        disable: true,
                    },
                });
            }
            res.json({ message: 'Dates disabled successfully' });
        } else {
            // Existing dates found, update their disable flag
            await Meal.updateMany(
                {
                    date: {
                        $gte: startDisable.toDate(),
                        $lte: endDisable.toDate(),
                    },
                },
                {
                    $set: {
                        'disableData.reason': value.reason,
                        'disableData.disable': true,
                    },
                }
            );
            res.json({ message: 'Dates disabled successfully' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const disableDatesInRangeValidationSchema = () => {
    const Schema = Joi.object({
        startDate: Joi.string().required().label("Start Date"),
        endDate: Joi.string().required().label("End Date"),
        reason: Joi.string().required().min(5).label("Reason")
    });
    return Schema;
}

router.post("/disabledate", authAdmin, async (req, res) => {
    try {
      const {value, error} = disableDateValidationSchema().validate(req.body);
      let disableDate = moment(value.date).startOf("day").utcOffset(0, true);
      
      // Check if date already exists in database
      const existingMeal = await Meal.findOne({ date: disableDate });
  
      if (existingMeal) {
        // Update existing date
        existingMeal.disableData.reason = value.reason;
        existingMeal.disableData.disable = true;
        await existingMeal.save();
      } else {
        // enter date and disable
        const newMeal = new Meal({
          date: disableDate,
          'disableData.reason': value.reason,
          'disableData.disable': true
        });
        await newMeal.save();
      }
  
      res.status(200).send({ message: "Date successfully disabled." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong." });
    }
  });

  const disableDateValidationSchema = () => {
    const Schema = Joi.object({
        date: Joi.string().required().label("Date"),
        reason: Joi.string().required().min(5).label("Reason")
    });
    return Schema;
}

module.exports = router;