import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

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

export const authenticateuser = async function (email, password)  {
  try {
//find etrieve multiple documents that match a query.
//Return Value: An array of documents (even if only one document matches the query, it will still return an array with that single document).

//findone   Retrieve a single document that matches a query.
//Return Value: A single document object (or null if no documents match the query).
    // console.log('*',this)
    //this is giving an error
    //Since authenticateuser is defined as an exported function and not as a method on an object, this will not refer to the object you expect.
    const user = await UserModel.findOne({ email: email });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        return user;
      } else {
        return { results: false, message: "Password is incorrect" };
      }
    }
  } catch (err) {
    throw err;
  }
};

export const UserModel = model("users", userSchema);
