const express = require("express");
const router = express.Router();
const { User } = require("../model/user");
const { Meal } = require("../model/mealBooking");
const Joi = require("joi");
const authAdmin = require("../middleware/auth-admin");
const moment = require("moment");

router.post("/mealbook", async (req, res) => {
  console.log(req.body);
  try {
    const { value, error } = mealBookingSchemaValidation().validate(req.body);
    if (error) return res.status(400).send({ Message: "Please enter valid data", Error: error.message });

    const startDate = moment(value.startDate).startOf("day");
    const endDate = moment(value.endDate).endOf("day");
    const dates = getDatesBetweenStartAndEnd(startDate, endDate);
    const disableDates = await Meal.find({ 'disableData.disable': true }, { date: 1, _id: 0 });

    let userEmp;
    if (value.type == "employee") {
      userEmp = await User.findOne({ _id: value.userId });

      if (!userEmp) return res.status(400).send({ message: "Bad Request", data: "user is not exist." });

      // check if it's enabled or not
      if (!userEmp.enabled) return res.status(400).send({ message: "Bad Request", data: "User has been disabled. Please contact admin." });
    }
    for await (const date of dates) {
      let meal;
      if (value.type == "employee") {
        meal = await Meal.findOne({
          date: { $eq: new Date(date).toISOString() },
          type: "employee",
          userId: value.userId,
          'disableData.disable': false
        });
      }
      if (value.type == "custom") {
        meal = await Meal.findOne({
          date: { $eq: new Date(date).toISOString() },
          type: "custom",
          'disableData.disable': false
        });
      }
      if (value.type == "non employee") {
        meal = await Meal.findOne({
          date: { $eq: new Date(date).toISOString() },
          type: "non employee",
          'disableData.disable': false
        });
      }

      if (!meal) {
        // New entry
        const mealData = {
          date: date,
          type: value.type,
          notes: value.notes,
        };
        if (value.type == "employee") {
          if (value.lunch) {
            mealData.lunch = 1
          }
          if (value.dinner) {
            mealData.dinner = 1
          }
          mealData.userId = value.userId;
          mealData.employeeId = userEmp.employeeId;
          mealData.firstName = userEmp.firstName;
          mealData.lastName = userEmp.lastName;
          mealData.departmentName = userEmp.departmentName;
        }
        if (value.type == "custom" || value.type == "non employee") {
          mealData.lunch = value.lunch;
          mealData.dinner = value.dinner;
        }
        meal = new Meal(mealData);
        await meal.save();
      } else {
        // Existing entry
        if (value.type == "custom" || value.type == "non employee") {
          // Check if value.lunch and value.dinner are valid numbers
          if (!isNaN(value.lunch)) {
            meal.lunch = meal.lunch + value.lunch;
          }
          if (!isNaN(value.dinner)) {
            meal.dinner = meal.dinner + value.dinner;
          }
        }
        else {
          if (value.lunch) {
            meal.lunch = 1;
          }
          if (value.dinner) {
            meal.dinner = 1;
          }
        }
        await meal.save();
      }
    }
    res.status(200).send({ Message: "Meal booking successful" });
  } catch (err) {
    console.log("Meal Booking Error", err);
    res.status(500).send({ Message: "Something went wrong", Error: err.message });
  }
});

const mealBookingSchemaValidation = () => {
  const schema = Joi.object({
    startDate: Joi.string().required().label("Start Date"),
    endDate: Joi.string().required().label("End Date"),
    type: Joi.string().required().min(6).max(12).label("Category"),
    userId: Joi.string().label("User ID"),
    lunch: Joi.number().label("Count"),
    dinner: Joi.number().label("Count"),
    notes: Joi.string().label("Notes"),
  });
  return schema;
};

const getDatesBetweenStartAndEnd = (startDate, endDate) => {
  let now = startDate.clone(),
    dates = [];
  while (now.isSameOrBefore(endDate)) {
    dates.push(now.format("YYYY-MM-DD"));
    now.add(1, "days");
  }
  return dates;
};

router.get("/currentMonthData", authAdmin, async (req, res) => {
  try {
    const { value, error } = currentMonthDataSchemaValidation().validate(req.body);
    if (error) return res.status(400).send({ Message: "Please enter valid data", Error: error.message });

    const startOfMonth = moment().startOf("month").toDate();
    const endOfMonth = moment().endOf("month").toDate();

    if (value.type == "employee") {
      const meals = await Meal.find({
        date: { $gte: startOfMonth, $lte: endOfMonth },
        type: "employee",
        'disableData.disable': false
      });

      const result = meals.map((meal) => {
        return {
          employeeId: meal.employeeId,
          employeeName: `${meal.firstName} ${meal.lastName}`,
          departmentName: meal.departmentName,
          totalMealBooked: meal.lunch + meal.dinner,
          dateOfBooking: meal.date.toLocaleDateString(),
        };
      });

      const combinedResult = result.reduce((acc, current) => {
        const existingEmployee = acc.find(
          (employee) => employee.employeeId === current.employeeId && employee.employeeName === current.employeeName && employee.departmentName === current.departmentName
        );

        if (existingEmployee) {
          existingEmployee.totalMealBooked += current.totalMealBooked;
          existingEmployee.dateOfBooking.push(current.dateOfBooking);
        } else {
          acc.push({
            employeeId: current.employeeId,
            employeeName: current.employeeName,
            departmentName: current.departmentName,
            totalMealBooked: current.totalMealBooked,
            dateOfBooking: [current.dateOfBooking],
          });
        }

        return acc;
      }, []);

      res.status(200).send(combinedResult);
    }
    else if (value.type == "other") {
      //custom data fetch
      const meals = await Meal.find({
        date: { $gte: startOfMonth, $lte: endOfMonth },
        type: "custom",
        'disableData.disable': false
      });
      const CustomNotes = [...new Set(meals.map(item => item.notes))];
      const totalLunchCount = meals.reduce((acc, meal) => acc + meal.lunch, 0);
      const totalDinnerCount = meals.reduce((acc, meal) => acc + meal.dinner, 0);
      const totalCustom = totalLunchCount + totalDinnerCount;



      //non employee data fetch
      const meals2 = await Meal.find({
        date: { $gte: startOfMonth, $lte: endOfMonth },
        type: "non employee",
        'disableData.disable': false
      });

      const totalLunchCount2 = meals2.reduce((acc, meal2) => acc + meal2.lunch, 0);
      const totalDinnerCount2 = meals2.reduce((acc, meal2) => acc + meal2.dinner, 0);
      const totalNonEmployee = totalLunchCount2 + totalDinnerCount2;

      const NonEmployeeNotes = [...new Set(meals2.map(item => item.notes))];

      result = [{ Category: "Custom", Count: totalCustom, notes: CustomNotes }, { Category: "Non Employee", Count: totalNonEmployee, notes: NonEmployeeNotes }];

      res.status(200).send(result);
    } else {
      res.status(200).send({ Message: "Invalid Category" })
    }
  } catch (error) {
    console.error("Error retrieving data:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

const currentMonthDataSchemaValidation = () => {
  const schema = Joi.object({
    type: Joi.string().required().label("Category")
  });
  return schema;
}

router.get('/getDataByDate', authAdmin, async (req, res) => {
  try {
    const { value, error } = getDataByDateSchemaValidation().validate(req.body);
    if (error) return res.status(400).send({ Message: "Please enter valid data" });

    let date = moment(value.date).startOf("day").utcOffset(0, true);

    if (value.type == "employee") {

      const meals = await Meal.find({
        date: { $eq: date },
        type: "employee",
        'disableData.disable': false
      });

      const result = meals.map((meal) => {
        return {
          employeeId: meal.employeeId,
          employeeName: `${meal.firstName} ${meal.lastName}`,
          departmentName: meal.departmentName,
          totalMealBooked: meal.lunch + meal.dinner,
          dateOfBooking: meal.date.toLocaleDateString(),
        };
      });
      res.status(200).send({ result });
    }
    else if (value.type == "other") {
      //custom data fetch
      const meals = await Meal.find({
        date: { $eq: date },
        type: "custom",
        'disableData.disable': false
      });

      const custom = meals.map((meal) => {
        return {
          Category: meal.type,
          Count: meal.lunch + meal.dinner,
          Notes: meal.notes
        }
      })

      //non employee data fetch
      const meals2 = await Meal.find({
        date: { $eq: date },
        type: "non employee",
        'disableData.disable': false
      });

      const NonEmployee = meals2.map((meal) => {
        return {
          Category: meal.type,
          Count: meal.lunch + meal.dinner,
          Notes: meal.notes
        }
      })
      let [data1] = custom;
      let [data2] = NonEmployee;
      res.status(200).send([data1, data2]);
    }
    else res.status(200).send({ Message: "Invalid Category" });
  } catch (error) {
    res.status(400).send({ Error: "Something went wrong" });
  }
});

const getDataByDateSchemaValidation = () => {
  const schema = Joi.object({
    date: Joi.string().required().label("Date"),
    type: Joi.string().required().label("Category")
  });
  return schema;
}

router.post('/getDataByRange', authAdmin, async (req, res) => {
  try {
    const { value, error } = getDataByDateRangeSchemaValidation().validate(req.body);
    if (error) return res.status(400).send({ Message: "Please enter valid data", Error: error });

    const startDate = moment(value.startDate).startOf("day");
    const endDate = moment(value.endDate).endOf("day");

    if (value.type == "employee") {
      const meals = await Meal.find({
        date: { $gte: startDate, $lte: endDate },
        type: "employee",
        'disableData.disable': false
      });

      const result = meals.map((meal) => {
        return {
          employeeId: meal.employeeId,
          employeeName: `${meal.firstName} ${meal.lastName}`,
          departmentName: meal.departmentName,
          totalMealBooked: meal.lunch + meal.dinner,
          dateOfBooking: meal.date.toLocaleDateString(),
        };
      });

      const combinedResult = result.reduce((acc, current) => {
        const existingEmployee = acc.find(
          (employee) => employee.employeeId === current.employeeId && employee.employeeName === current.employeeName && employee.departmentName === current.departmentName
        );

        if (existingEmployee) {
          existingEmployee.totalMealBooked += current.totalMealBooked;
          existingEmployee.dateOfBooking.push(current.dateOfBooking);
        } else {
          acc.push({
            employeeId: current.employeeId,
            employeeName: current.employeeName,
            departmentName: current.departmentName,
            totalMealBooked: current.totalMealBooked,
            dateOfBooking: [current.dateOfBooking],
          });
        }

        return acc;
      }, []);

      res.status(200).send({ combinedResult });
    }
    if (value.type == "other") {
      //custom data fetch
      const meals = await Meal.find({
        date: { $gte: startDate, $lte: endDate },
        type: "custom",
        'disableData.disable': false
      });

      const totalLunchCount = meals.reduce((acc, meal) => acc + meal.lunch, 0);
      const totalDinnerCount = meals.reduce((acc, meal) => acc + meal.dinner, 0);
      const totalCustom = totalLunchCount + totalDinnerCount;

      let notesCustom = [...new Set(meals.map(item => item.notes))];

      //non employee data fetch
      const meals2 = await Meal.find({
        date: { $gte: startDate, $lte: endDate },
        type: "non employee",
        'disableData.disable': false
      });

      const totalLunchCount2 = meals2.reduce((acc, meal2) => acc + meal2.lunch, 0);
      const totalDinnerCount2 = meals2.reduce((acc, meal2) => acc + meal2.dinner, 0);
      const totalNonEmployee = totalLunchCount2 + totalDinnerCount2;

      let notesNonEmployee = [...new Set(meals2.map(item => item.notes))];


      result = [{ Category: "Custom", Count: totalCustom, notes: notesCustom }, { Category: "Non Employee", Count: totalNonEmployee, notes: notesNonEmployee }];

      res.status(200).send(result);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

const getDataByDateRangeSchemaValidation = () => {
  const schema = Joi.object({
    startDate: Joi.string().required().label("Start Date"),
    endDate: Joi.string().required().label("End Date"),
    type: Joi.string().required().label("Category")
  });
  return schema;
}

module.exports = router;