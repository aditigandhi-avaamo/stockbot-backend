console.log("authenticateEmployee called");

// ── Read JWT context (injected by Avaamo from user_info param) ──
var ctxFirstName = (context.user.first_name || "").trim();
var ctxEmail     = (context.user.email      || "").trim().toLowerCase();
var ctxEmpId     = "";
var ctxDept      = "";

try {
  ctxEmpId = (context.user.custom_properties.employee_id || "").trim().toUpperCase();
  ctxDept  = (context.user.custom_properties.department  || "").trim();
} catch(e) {
  console.log("No custom_properties on context.user");
}

console.log("JWT context → empId:", ctxEmpId, "email:", ctxEmail);

// ── If JWT has both empId and email, trust it directly ──
// Don't re-verify against DB — JWT was already verified by the auth handler
if (ctxEmpId && ctxEmail) {
  await (Storage.user.set("auth_verified", "true"));
  await (Storage.user.set("auth_name",     ctxFirstName + " " + (context.user.last_name || "").trim()));
  await (Storage.user.set("auth_empid",    ctxEmpId));
  await (Storage.user.set("auth_email",    ctxEmail));
  await (Storage.user.set("auth_dept",     ctxDept));

  console.log("authenticateEmployee: SSO verified →", ctxFirstName);
  return {
    success: true,
    silent: true,
    employee: {
      fullName:   ctxFirstName + " " + (context.user.last_name || "").trim(),
      employeeId: ctxEmpId,
      email:      ctxEmail,
      department: ctxDept
    },
    avm_instruction: "User authenticated via SSO. Greet them: 'Hi " + ctxFirstName + ", I'm HRC Bot. How can I help you today?' Do NOT ask for Employee ID or email."
  };
}

// ── No JWT → fall back to manual entry ──
var empId = (context.employee_id || "").trim().toUpperCase();
var email = (context.email       || "").trim().toLowerCase();

console.log("Manual auth attempt → empId:", empId, "email:", email);

if (!empId || !email) {
  return {
    success: false,
    partial_match: "none",
    avm_instruction: "No credentials from JWT or manual input. Ask the user for their Employee ID and email address."
  };
}

var emp = verifyLoginEmployee(empId, email);

if (emp) {
  await (Storage.user.set("auth_verified", "true"));
  await (Storage.user.set("auth_name",     emp.fullName));
  await (Storage.user.set("auth_empid",    emp.employeeId));
  await (Storage.user.set("auth_email",    emp.email));
  await (Storage.user.set("auth_dept",     emp.department));
  return { success: true, employee: emp };
}

var db = getEmployeeDB();
var idOnly = false, emailOnly = false;
for (var i = 0; i < db.length; i++) {
  if (db[i].employeeId.toLowerCase() === empId.toLowerCase()) idOnly    = true;
  if (db[i].email.toLowerCase()      === email.toLowerCase()) emailOnly = true;
}

return {
  success: false,
  partial_match: idOnly ? "employee_id" : emailOnly ? "email" : "none"
};

// console.log("authenticateEmployee called");

// // ── Try JWT context first (user already authenticated via HTML login page) ──
// var ctxFirstName = (context.user.first_name || "").trim();
// var ctxLastName  = (context.user.last_name  || "").trim();
// var ctxEmail     = (context.user.email      || "").trim();
// var ctxEmpId     = "";
// var ctxDept      = "";

// try {
//   ctxEmpId = (context.user.custom_properties.employee_id || "").trim();
//   ctxDept  = (context.user.custom_properties.department  || "").trim();
// } catch(e) {}

// console.log("JWT context:", ctxFirstName, ctxLastName, ctxEmail, ctxEmpId);

// // If JWT provided valid details, auto-authenticate without asking
// if (ctxEmpId && ctxEmail) {
//   var emp = verifyLoginEmployee(ctxEmpId, ctxEmail);

//   if (emp) {
//     await (Storage.user.set("auth_verified", "true"));
//     await (Storage.user.set("auth_name",     emp.fullName));
//     await (Storage.user.set("auth_empid",    emp.employeeId));
//     await (Storage.user.set("auth_email",    emp.email));
//     await (Storage.user.set("auth_dept",     emp.department));
//     console.log("authenticateEmployee: auto-verified from JWT", emp.fullName);
//     return {
//       success: true,
//       employee: emp,
//       silent: true,
//       avm_instruction: "User authenticated silently via SSO. Greet them by first name and ask how you can help. Do NOT ask for Employee ID or email."
//     };
//   }
// }

// // ── Fallback: manual entry (employee_id and email passed as parameters) ──
// var empId = (context.employee_id || "").trim();
// var email = (context.email       || "").trim();

// console.log("manual auth attempt:", empId, email);

// if (!empId || !email) {
//   return {
//     success: false,
//     partial_match: "none",
//     avm_instruction: "No credentials provided from JWT or manual input. Ask the user for their Employee ID and email address."
//   };
// }

// var emp = verifyLoginEmployee(empId, email);

// if (emp) {
//   await (Storage.user.set("auth_verified", "true"));
//   await (Storage.user.set("auth_name",     emp.fullName));
//   await (Storage.user.set("auth_empid",    emp.employeeId));
//   await (Storage.user.set("auth_email",    emp.email));
//   await (Storage.user.set("auth_dept",     emp.department));
//   return { success: true, employee: emp };
// }

// var db = getEmployeeDB();
// var idOnly = false;
// var emailOnly = false;
// for (var i = 0; i < db.length; i++) {
//   if (db[i].employeeId.toLowerCase() === empId.toLowerCase()) idOnly    = true;
//   if (db[i].email.toLowerCase()      === email.toLowerCase()) emailOnly = true;
// }

// return {
//   success: false,
//   partial_match: idOnly ? "employee_id" : emailOnly ? "email" : "none"
// };

// // console.log("authenticateEmployee called");

// // var empId = "";
// // var email = "";

// // try {
// //   empId = context.user.custom_properties.employee_id || "";
// //   email = context.user.email || "";
// // } catch(e) {}

// // empId = empId || (context.employee_id || "").trim();
// // email = email || (context.email || "").trim();

// // console.log("empId:", empId, "email:", email);

// // var emp = verifyLoginEmployee(empId, email);

// // if (emp && emp.employeeId) {
// //   await (Storage.user.set("auth_verified", "true"));
// //   await (Storage.user.set("auth_name",  emp.fullName));
// //   await (Storage.user.set("auth_empid", emp.employeeId));
// //   await (Storage.user.set("auth_email", emp.email));
// //   await (Storage.user.set("auth_dept",  emp.department));
// //   return { success: true, employee: emp, silent: true };
// // }

// // var db = getEmployeeDB();
// // var idOnly = false, emailOnly = false;
// // for (var i = 0; i < db.length; i++) {
// //   if (db[i].employeeId.toLowerCase() === empId.toLowerCase()) idOnly = true;
// //   if (db[i].email.toLowerCase() === email.toLowerCase()) emailOnly = true;
// // }
// // return { success: false, partial_match: idOnly ? "employee_id" : emailOnly ? "email" : "none" };