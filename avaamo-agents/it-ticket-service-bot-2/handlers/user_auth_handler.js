console.log("Starting JWT verification...", context.params.user_info);
var secret = '8e27664a-a10a-428b-80cb-3ab71453a31c';
return new Promise(function(resolve, reject) {
  JWT.verify(context.params.user_info, secret, function(err, decoded) {
    if (err) {
      console.error("JWT verify error:", err.message);
      return resolve({
        uuid:       "guest_" + Date.now(),
        authStatus: "fail"
      });
    }
    console.log("Decoded JWT:", JSON.stringify(decoded));
    var cp    = decoded.custom_properties || {};
    var empId = (cp.employee_id || decoded.uuid || "").trim().toUpperCase();
    if (empId) {
      return resolve({
        uuid:        empId + "_" + Date.now(),
        employee_id: empId,
        department:  cp.department      || "",
        region:      cp.region          || "",
        first_name:  decoded.first_name || "",
        last_name:   decoded.last_name  || "",
        email:       decoded.email      || "",
        authStatus:  "true"
      });
    } else {
      return resolve({
        uuid:       "guest_" + Date.now(),
        authStatus: "fail"
      });
    }
  });
});

// return {
//   uuid: user.uuid || "guest_" + Date.now(),
//   employee_id: user.employee_id || "",
//   email: user.email || "",
//   first_name: user.first_name || "",
//   last_name: user.last_name || "",
//   department: user.department || "",
//   authStatus: "true"
// };
// return {
//   uuid: context.user.uuid,
//   authStatus: "true"
// };
