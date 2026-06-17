var region    = "";
var firstName = "";
var email     = "";
var empId     = "";
var dept      = "";

try {
  region    = (context.user.custom_properties.region      || "").trim();
  empId     = (context.user.custom_properties.employee_id || "").trim().toUpperCase();
  dept      = (context.user.custom_properties.department  || "").trim();
  firstName = (context.user.first_name || "").trim();
  email     = (context.user.email      || "").trim();
} catch(e) {}

await (Storage.user.set("auth_verified", "true"));
await (Storage.user.set("auth_name",     firstName));
await (Storage.user.set("auth_empid",    empId));
await (Storage.user.set("auth_email",    email));
await (Storage.user.set("auth_dept",     dept));
await (Storage.user.set("user_region",   region));
await (User.setProperty("region", region));

console.log("setUserRegion: region=" + region + " name=" + firstName + " empId=" + empId);



return {
  success: true,
  region: region,
  messages: [
    {
      text: "Hi " + firstName + "! 👋 I'm HRC Bot, your IT support assistant. How can I help you today?"
    }
  ],
  avm_instruction: "Greeting sent. Wait for the user's response. Do NOT call authenticateEmployee(). Auth is already complete via SSO."
};