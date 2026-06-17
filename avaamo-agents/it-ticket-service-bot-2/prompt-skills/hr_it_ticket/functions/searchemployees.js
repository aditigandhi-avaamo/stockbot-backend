console.log("searchEmployees", context.query);

var result = searchEmployeesHelper(context.query);
console.log("searchEmployees result", JSON.stringify(result));

// Store results for index-based or verbal selection later
if (result.success && result.messages) {
  var listMsg = result.messages[1];
  if (listMsg && listMsg.list_view) {
    var stored = listMsg.list_view.items.map(function(item) {
      var hc = item.links[0].hidden_content || "";
      var parts = hc.split("::");
      return {
        fullName:   parts[1] || "",
        employeeId: parts[2] || "",
        email:      parts[3] || "",
        department: parts[4] || ""
      };
    });
    await (Storage.user.set("last_employee_search", JSON.stringify(stored)));
    console.log("searchEmployees: stored", stored.length, "results for verbal selection");
  }
}

return result;