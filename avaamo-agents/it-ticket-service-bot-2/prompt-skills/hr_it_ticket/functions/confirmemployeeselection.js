console.log("confirmEmployeeSelection", context.employee_id, context.selection_index, context.department_hint);

var emp = null;

// Priority 1: direct employee_id lookup
if (context.employee_id) {
  emp = lookupEmployee(null, context.employee_id, null);
  console.log("confirmEmployeeSelection: by ID", context.employee_id, JSON.stringify(emp));
}

// Priority 2: index or department from last search results
if (!emp) {
  var lastSearchRaw = await (Storage.user.get("last_employee_search"));
  var lastSearch = lastSearchRaw ? JSON.parse(lastSearchRaw) : [];
  console.log("confirmEmployeeSelection: last search results", lastSearch.length);

  if (lastSearch.length > 0) {

    // By department hint
    if (context.department_hint) {
      var hint = context.department_hint.toLowerCase();
      for (var i = 0; i < lastSearch.length; i++) {
        if (lastSearch[i].department.toLowerCase().indexOf(hint) !== -1) {
          emp = lastSearch[i];
          console.log("confirmEmployeeSelection: matched by department", emp.fullName);
          break;
        }
      }
    }

    // By index (first/second/third)
    if (!emp && context.selection_index !== null && context.selection_index !== undefined) {
      var idx = parseInt(context.selection_index);
      if (!isNaN(idx) && idx >= 0 && idx < lastSearch.length) {
        emp = lastSearch[idx];
        console.log("confirmEmployeeSelection: matched by index", idx, emp.fullName);
      }
    }

    // If only one result and user said yes/ok/continue/correct
    if (!emp && lastSearch.length === 1) {
      emp = lastSearch[0];
      console.log("confirmEmployeeSelection: single result auto-selected", emp.fullName);
    }
  }
}

console.log("confirmEmployeeSelection final:", JSON.stringify(emp));

if (!emp) {
  return {
    success: false,
    avm_instruction: "Could not identify which employee the user selected. Call searchEmployees() again with a more specific name, or ask the user to provide the Employee ID directly."
  };
}

// ── SELF-SELECTION GUARD ──
var authEmpId = await (Storage.user.get("auth_empid")) || "";
if (emp.employeeId === authEmpId) {
  return {
    success: false,
    avm_instruction: "The selected employee is the same as the authenticated user. Tell the user: 'It looks like you selected yourself. If this ticket is for you, say \"myself\" and I'll use your session details. If it is for a different person, please provide their name or employee ID.' Do not call getTicketSummary()."
  };
}

await (Storage.user.set("ticket_requester_name",  emp.fullName));
await (Storage.user.set("ticket_requester_empid", emp.employeeId));
await (Storage.user.set("ticket_requester_email", emp.email));
await (Storage.user.set("ticket_requester_dept",  emp.department));

return {
  success: true,
  employee: emp,
  avm_instruction: "Employee stored successfully. Say: 'You have selected " + emp.fullName + " from " + emp.department + " as the ticket requester.' Then immediately call getTicketSummary() with requestor_type 'someone_else'. Do not ask any more questions before calling getTicketSummary()."
};