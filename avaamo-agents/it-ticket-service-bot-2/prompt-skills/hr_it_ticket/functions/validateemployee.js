console.log("validateEmployee", context.name, context.employee_id, context.email);

var emp = lookupEmployee(context.name, context.employee_id, context.email);
console.log("validateEmployee result", JSON.stringify(emp));

if (emp) {
  await (Storage.user.set("ticket_requester_name",  emp.fullName));
  await (Storage.user.set("ticket_requester_empid", emp.employeeId));
  await (Storage.user.set("ticket_requester_email", emp.email));
  await (Storage.user.set("ticket_requester_dept",  emp.department));

  return {
    success: true,
    employee: emp,
    avm_instruction: "Employee found and stored. Now call getTicketSummary() with requestor_type 'someone_else'."
  };
}

return {
  success: false,
  avm_instruction: "Employee not found. Inform the user: 'I could not find anyone matching those details. Please double-check the name, Employee ID, and email and try again.'"
};