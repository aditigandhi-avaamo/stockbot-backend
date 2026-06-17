console.log("getTicketSummary", context.requestor_type);
 
// ── PREREQUISITE GUARD ──
var stage       = await (Storage.user.get("ticket_stage"))            || "";
var description = await (Storage.user.get("ticket_description"))      || "";
var category    = await (Storage.user.get("ticket_category"))         || "";
var subcategory = await (Storage.user.get("ticket_subcategory"))      || "";
var attachName  = await (Storage.user.get("ticket_attachment_name"))  || null;
 
// If attachment step was never resolved, block and redirect
if (stage === "classified" || stage === "") {
  console.log("getTicketSummary: BLOCKED — attachment step not resolved, stage:", stage);
  return {
    success: false,
    avm_instruction: "STOP. You called getTicketSummary() too early. The attachment step has not been resolved yet. You MUST ask the user: 'Would you like to attach a screenshot or document to this ticket?' Wait for yes or no. Do not call getTicketSummary() again until the attachment step is done."
  };
}
 
// If requester_type is missing or unclear, block
if (!context.requestor_type) {
  console.log("getTicketSummary: BLOCKED — requestor_type not provided");
  return {
    success: false,
    avm_instruction: "STOP. requestor_type was not provided. Ask the user: 'Are you raising this ticket for yourself or on behalf of someone else?' Wait for the answer. Then call getTicketSummary() with the correct requestor_type."
  };
}
 
var attachUrl      = await (Storage.user.get("ticket_attachment_url"))  || "";
var createdByName  = await (Storage.user.get("auth_name"))              || "N/A";
var createdByEmail = await (Storage.user.get("auth_email"))             || "N/A";
var requesterName, requesterEmpId, requesterEmail, requesterDept;
 
if (context.requestor_type === "myself") {
  requesterName  = await (Storage.user.get("auth_name"))  || "N/A";
  requesterEmpId = await (Storage.user.get("auth_empid")) || "N/A";
  requesterEmail = await (Storage.user.get("auth_email")) || "N/A";
  requesterDept  = await (Storage.user.get("auth_dept"))  || "N/A";
 
  await (Storage.user.set("ticket_requester_name",  requesterName));
  await (Storage.user.set("ticket_requester_empid", requesterEmpId));
  await (Storage.user.set("ticket_requester_email", requesterEmail));
  await (Storage.user.set("ticket_requester_dept",  requesterDept));
} else {
  requesterName  = await (Storage.user.get("ticket_requester_name"))  || "N/A";
  requesterEmpId = await (Storage.user.get("ticket_requester_empid")) || "N/A";
  requesterEmail = await (Storage.user.get("ticket_requester_email")) || "N/A";
  requesterDept  = await (Storage.user.get("ticket_requester_dept"))  || "N/A";
 
  // Guard: if someone_else but requester not resolved yet
  if (requesterName === "N/A" || requesterEmpId === "N/A") {
    console.log("getTicketSummary: BLOCKED — someone_else but requester not resolved");
    return {
      success: false,
      avm_instruction: "STOP. The ticket is for someone else but their details have not been resolved yet. Ask for the other employee's name or email and call searchEmployees() first. Do not call getTicketSummary() until the employee is found and saved."
    };
  }
}
 
await (Storage.user.set("ticket_summary_shown", "true"));
await (Storage.user.set("ticket_stage",         "summary_shown"));
 
console.log("getTicketSummary: summary_shown. Fields:", {
  requesterName, requesterEmpId, requesterEmail, requesterDept,
  description, category, subcategory, attachName
});
 
var attachLine = attachName
  ? "<b>Attachment:</b> " + attachName + "<br>"
  : "<b>Attachment:</b> None<br>";
 
// ── CHANGED: emails only, no Name/EmpID/Dept block ──
var createdByLine = "";
 
if (context.requestor_type === "myself") {
  createdByLine =
    "<b>Created By</b><br>" +
    "Email: " + createdByEmail + "<br>";
} else {
  createdByLine =
    "<b>Created For</b><br>" +
    "Email: " + requesterEmail + "<br><br>" +
    "<b>Created By</b><br>" +
    "Email: " + createdByEmail + "<br>";
}
 
// ── CHANGED: removed Requested For Name/EmpID/Dept block entirely ──
var summaryHTML =
  "<b>Ticket Summary</b><br><br>" +
  createdByLine +
  "<br><br><b>Issue Details</b><br>" +
  "Description: " + description + "<br>" +
  "Category: " + category + "<br>" +
  "Sub-Category: " + subcategory + "<br>" +
  attachLine;
 
return {
  success: true,
  summary: {
    requesterName, requesterEmpId, requesterEmail, requesterDept,
    description, category, subcategory,
    attachment: attachName || null
  },
  message: {
    card: {
      description: summaryHTML,
      links: [
        // ── CHANGED: added hidden_content to both buttons ──
        {
          type: "post_message",
          title: "✅ Confirm & Generate Ticket",
          value: "Please confirm and generate my ticket",
          hidden_content: "confirm_ticket"
        },
        {
          type: "post_message",
          title: "✏️ Update Something",
          value: "I want to update something",
          hidden_content: "update_ticket"
        }
      ]
    }
  }
};