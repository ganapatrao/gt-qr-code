import { Schema, model } from "mongoose";
import  bcrypt  from "bcrypt";

const userSchema = Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: false },
  },
  {
    timestamps: true, //gtx
  }
);

userSchema.pre("save", function (next) {
  let user = this;
  //if not modified or not return
  if (!user.isModified("password")) return next();

  //generate salt
  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function (err, hashresult) {
      if (err) return next(err);

      user.password = hashresult;
      next();
    });
  });
});

export const UserModel = model("users", userSchema);
