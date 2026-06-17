console.log("generateTicket called");
 
var ticketId = generateTicketId();
 
// ── FIXED: await syntax — || fallback is now OUTSIDE the await() call ──
var description    = await (Storage.user.get("ticket_description"))    || "N/A";
var category       = await (Storage.user.get("ticket_category"))       || "N/A";
var subcategory    = await (Storage.user.get("ticket_subcategory"))    || "N/A";
var requesterName  = await (Storage.user.get("ticket_requester_name")) || "";
var requesterEmpId = await (Storage.user.get("ticket_requester_empid"))|| "";
var requesterEmail = await (Storage.user.get("ticket_requester_email"))|| "";
var requesterDept  = await (Storage.user.get("ticket_requester_dept")) || "";
var attachName     = await (Storage.user.get("ticket_attachment_name"))|| "";
var attachUrl      = await (Storage.user.get("ticket_attachment_url")) || "";
var raisedByEmail  = await (Storage.user.get("auth_email"))            || "";
var raisedByName   = await (Storage.user.get("auth_name"))             || "";
var raisedByEmpId  = await (Storage.user.get("auth_empid"))            || "";
 
var createdAt = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
 
var ticket = {
  ticketId:       ticketId,
  status:         "Open",
  priority:       "Medium",
  createdAt:      createdAt,
  requesterName:  requesterName,
  requesterEmpId: requesterEmpId,
  requesterEmail: requesterEmail,
  requesterDept:  requesterDept,
  description:    description,
  category:       category,
  subcategory:    subcategory,
  attachmentName: attachName || null,
  attachmentUrl:  attachUrl  || null,
  raisedBy:       raisedByName,
  raisedByEmail:  raisedByEmail,
  // ── ADDED: so viewMyTickets filter can match by EmpID ──
  createdByEmpId: raisedByEmpId
};
 
await (Storage.user.set("last_ticket",    JSON.stringify(ticket)));
await (Storage.user.set("last_ticket_id", ticketId));
 
// ── FIXED: await syntax on history save ──
var historyRaw = null;
try { historyRaw = await (Storage.user.get("ticket_history")); } catch (e) {}
var history = historyRaw ? JSON.parse(historyRaw) : [];
history.push(ticket);
await (Storage.user.set("ticket_history", JSON.stringify(history)));
// Read existing global history and merge before saving
var existingGlobalRaw = null;
try { existingGlobalRaw = await (Storage.global.get("ticket_history_" + raisedByEmpId)); } catch(e) {}
var existingGlobal = existingGlobalRaw ? JSON.parse(existingGlobalRaw) : [];

// Merge — add new ticket if not already there
var seenIds = {};
existingGlobal.forEach(function(t) { seenIds[t.ticketId] = true; });
if (!seenIds[ticket.ticketId]) { existingGlobal.push(ticket); }

await (Storage.global.set("ticket_history_" + raisedByEmpId, JSON.stringify(existingGlobal)));
 
// ── ADDED: reset LLaMB flags so next ticket also runs knowledge search ──
await (Storage.user.set("llamb_called",       ""));
await (Storage.user.set("llamb_answer_shown", ""));
 
// Build confirmation message — emails only, no names/IDs
var isSelf = (requesterEmail === raisedByEmail);
 
var ackHTML =
  "<b>Ticket ID:</b> " + ticketId + "<br>" +
  "<b>Status:</b> Open<br>" +
  "<b>Created:</b> " + createdAt + "<br><br>";

if (isSelf) {

  ackHTML +=
    "<b>Created By</b><br>" +
    "Email: " + raisedByEmail + "<br><br>";

} else {

  ackHTML +=
    "<b>Created For</b><br>" +
    "Email: " + requesterEmail + "<br><br>" +

    "<b>Created By</b><br>" +
    "Email: " + raisedByEmail + "<br><br>";
}
 
ackHTML +=
  "<b>Issue Details</b><br>" +
  "Description: " + description + "<br>" +
  "Category: " + category + "<br>" +
  "Sub-Category: " + subcategory + "<br>" +
  "Attachment: " + (attachName || "None") + "<br><br>" +

  "Our IT team will reach out within 24 hours.";

// ── MULTI-INTENT: check pending queue ──
var pendingRaw = "";
try { pendingRaw = await (Storage.user.get("pending_intents")) || ""; } catch(e) {}
var pendingList = [];
try { pendingList = pendingRaw ? JSON.parse(pendingRaw) : []; } catch(e) {}

var nextIntent = null;
if (pendingList.length > 0) {
  nextIntent = pendingList.shift();
  await (Storage.user.set("pending_intents", JSON.stringify(pendingList)));
}

var links = [];

if (nextIntent) {
  links.push({
    type: "post_message",
    title: "▶ Continue with next issue",
    value: "Continue with next ticket",
    hidden_content: "next_intent::" + nextIntent
  });
  links.push({
    type: "post_message",
    title: "🎫 Raise a different ticket",
    value: "I want to raise another ticket",
    hidden_content: "raise_another_ticket"
  });
} else {
  links.push({
    type: "post_message",
    title: "🎫 Raise Another Ticket",
    value: "I want to raise another ticket",
    hidden_content: "raise_another_ticket"
  });
}


return {
  success: true,
  avm_instruction: nextIntent
    ? "Ticket created. Show the card. The user can continue with the next issue or raise a different one."
    : "Ticket created. Show the card.",
  message: {
    card: {
      title: "✅ Ticket Generated Successfully",
      description: ackHTML,
      links: links
    }
  }
};
// return {
//   success: true,
//   avm_instruction: nextIntent? "Ticket created. Now immediately call resetTicketContext(), then start a new ticket flow for this exact issue without asking the user to describe it again: \"" + nextIntent + "\". Do not ask any questions. Begin with handleKnowledge() using this description."
//     : "Ticket created. Display the confirmation card. Then ask: 'Is there anything else I can help you with?'",
//   message: {
//     card: {
//       title: "✅ Ticket Generated Successfully",
//       description: ackHTML,
//       links: [
//         {
//           type: "post_message",
//     	  title: nextIntent ? "▶ Continue: " + nextIntent.substring(0, 30) +    		    "..." : "Raise Another Ticket",
//     	  value: raiseAnotherValue,
//           hidden_content: raiseAnotherHidden
//         }
//       ]
//     }
//   }
// };