import { UserModel, authenticateuser } from "./users.model.js";
import { prepareResponse } from "../../../utils/response-handler.js";

export const signupUser = async (req, res) => {
  try {
    const isUserExists = await UserModel.findOne({ email: req.body.email });
    //if user tries to signup using email show error message
    if (isUserExists) {
      return res.send({
        data: {},
        meta: { message: "Email already exists" },
      });
    }

    const user = new UserModel(req.body);
    const response = await user.save();

    //since we do ont want the entire sata to show such as password and all we will show only selected data in response
    const result = {
      userId: response._id,
      email: response.email,
      username: response.userName,
    };
    res.send({ data: result, meta: { message: "signup successful" } });
  } catch (error) {
    console.log(error);
    res.send({
      data: {},
      meta: { message: "unable to creatae user at this time" },
    });
  }
};

export const signinUser = async (req, res) => {
  const { email, password } = req.body;
  const userResponse = await authenticateuser(email, password);

  //console.log("hk", !userResponse.results, userResponse.results);//true/false
  //when password is incorrect it returns
  /*{
    "results": false,
    "message": "Password is incorrect"
}
    */
  if (!userResponse.results) {
    //true when the password is incorrect
    const results = prepareResponse(null, userResponse.message);
    res.send(results);
  }

  //Issue Token
};
