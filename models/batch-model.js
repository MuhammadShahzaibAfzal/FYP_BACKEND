const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema(
  {
    name : {
        type : String,
        required : true,
        unique : true
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      requried: true,
    },
  },
  { timestamps: true }
);

// Pre-save middleware to validate startDate and endDate
batchSchema.pre("save", function (next) {
  if (this.startDate >= this.endDate) {
    return next(new Error("startDate must be less than endDate"));
  }
  next();
});

const BatchModel = mongoose.model("Batch", batchSchema);

module.exports = BatchModel;
