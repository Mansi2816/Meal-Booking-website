const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema({
  date : {
    type : mongoose.Schema.Types.Date,
    required: true,
  
  },
  type : {
    type : String,
    enum : [ "employee", "custom", "non employee"],
    required: true
  },
  userId : {
    type : mongoose.Schema.Types.ObjectId,
    required: false,
  },
  employeeId:{
    type : String,
    required : false
  },
  firstName : {
    type : String,
    required : false
  },
  lastName : {
    type : String,
    required : false
  },
  departmentName : {
    type : String,
    required : false
  },
  lunch : {
    type : Number,
    required : false,
    default : 0
  },
  dinner : {
    type : Number,
    required : false,
    default : 0
  },
  notes:{
    type: String,
    required: false
  },
  reedemLunchAt : { 
    type : mongoose.Schema.Types.Date,
    required : false
  },
  reedemDinnerAt : {
    type : mongoose.Schema.Types.Date,
    required : false
  },
  disableData :{
    disabledAt : {  // 20 jan
      type : mongoose.Schema.Types.Date,
      required : false
    },
    reason : {  // public holiday 
      type : String,
      required : false
    },
    disable:{
      type : Boolean,
      default : false
    }
  }
}, { timestamps : true}); 

const Meal = mongoose.model("meal", mealSchema);

module.exports.Meal = Meal;