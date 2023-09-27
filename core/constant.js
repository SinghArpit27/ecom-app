// Response Messages
export const responseMessage = {
  SUCCESS: "Success",
  CREATED: "Resource created successfully",
  BAD_REQUEST: "Bad request",
  NOT_FOUND: "Resource not found",
  UNAUTHORIZED: "Unauthorized User",
  INTERNAL_SERVER_ERROR: "Internal server error",

  EMAIL_ALREADY_EXIST: "Email is Already Exist",
  PHONE_ALREADY_EXIST: "Phone is Already Exist",
  USER_CREATED_SUCCESS: "User Created Successfully",
  INCORRECT_CREDENTIALS: "Incorrect credentials",
  LOGIN_SUCCESS: "Login Successfully",
  USER_NOT_FOUND: "User Not Found",
  FORGET_PASSWORD_SUCCESS: "Forget password successfully",
  PASSWORD_CHANGE_SUCCESS: "Password changed successfully",
  PROFILE_UPDATE: "Profile Updated successfully",
  ALREADY_ACTIVATED: "Wallet Already Activated",
  WALLET_ACTIVATED: "Wallet Activate",
  ALERT_ACTIVATE_WALLET: "Wallet Not Activated",
  AMOUNT_ADDED_SUCCESS: "Amount Added Successfully",
  VEHICLE_ADDEDD_SUCCESS: "Vehicle Added Successfully",
  ALREADY_SOLD: "Already Sold",
  INSUFFICIENT_AMOUNT: "Youd Don't have sufficient Amount, Please Add Money in Wallet",
  NOT_ELIGIBLE_TO_BUY_VEHICLE: "You can't buy this vehicle because you are Seller",
  VEHICLE_BUY_SUCCESS: "Vehicle Buy Successfully",
  VEHICLE_NOT_FOUND: "Vehicle Not Found Please Try again later",

  // Testing Messages
  MANUAL_ERR: "ARPIT",
  EMAIL_PHONE_ALREADY_EXIST: "Email or Phone Already Exist",
};

// response Status
export const responseStatus = {
  FAILURE: 0,
  SUCCESS: 1,
};

// Status Codes
export const statusCode = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
  UNAUTHORIZED: 401,
};
