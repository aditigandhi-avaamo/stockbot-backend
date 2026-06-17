console.log("FULL CONTEXT");
console.log(JSON.stringify(context));
console.log("viewTicketDetails", context.ticket_id);

var authEmpId = await (Storage.user.get("auth_empid")) || "";

var globalRaw = null;
try {
  globalRaw = await (Storage.global.get("ticket_history_" + authEmpId));
} catch(e) {}

var sessionRaw = null;
try {
  sessionRaw = await (Storage.user.get("ticket_history"));
} catch(e) {}

var globalTickets = globalRaw ? JSON.parse(globalRaw) : [];
var sessionTickets = sessionRaw ? JSON.parse(sessionRaw) : [];

var seen = {};
globalTickets.forEach(function(t) {
  seen[t.ticketId] = true;
});

sessionTickets.forEach(function(t) {
  if (!seen[t.ticketId]) {
    globalTickets.push(t);
    seen[t.ticketId] = true;
  }
});

var tickets = globalTickets;

console.log("Total tickets available:", tickets.length);

var ticketId = context.ticket_id || "";

// Extract ticket ID if a full phrase was passed
var match = ticketId.match(/HRC\d+/);
if (match) {
  ticketId = match[0];
}

console.log("Resolved ticketId:", ticketId);

var ticket = tickets.find(function(t) {
  return t.ticketId === ticketId;
});

if (!ticket) {
  console.log("Ticket not found for:", ticketId);

  return {
    success: false,
    avm_instruction:
      "Ticket not found. Tell the user the ticket ID could not be located."
  };
}

// Build comments section
var commentsHTML = "";
if (ticket.comments && ticket.comments.length > 0) {
  commentsHTML += "<br><b>Comments</b><br>";
  ticket.comments.forEach(function(c) {
    var date = new Date(c.timestamp).toLocaleString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
    commentsHTML += "• " + c.comment + " <i>(" + date + ")</i><br>";
  });
} else {
  commentsHTML = "<br><b>Comments:</b> None<br>";
}

var attachLine = ticket.attachmentName
  ? "<b>Attachment:</b> " + ticket.attachmentName + "<br>"
  : "<b>Attachment:</b> None<br>";

var createdByLine = (ticket.raisedBy && ticket.raisedBy !== ticket.requesterName)
  ? "<b>Created By</b><br>" + ticket.raisedBy + "<br>" + ticket.raisedByEmail + "<br><br>"
  : "";

var html =
  "<b>Ticket ID:</b> " + ticket.ticketId + "<br>" +
  "<b>Status:</b> " + ticket.status + "<br><br>" +
  "<b>Requested For</b><br>" +
  ticket.requesterName + "<br>" +
  ticket.requesterEmail + "<br><br>" +
  createdByLine +
  "<b>Issue Details</b><br>" +
  "<b>Category:</b> " + ticket.category + "<br>" +
  "<b>Subcategory:</b> " + ticket.subcategory + "<br>" +
  "<b>Description:</b> " + ticket.description + "<br>" +
  attachLine +
  commentsHTML;

return {
  success: true,
  ticket: ticket,
  message: {
    card: {
      description: html,
      links: [
        {
          type: "post_message",
          title: "Add Comment",
          value: "I want to add a comment",
          hidden_content: "update_ticket::" + ticket.ticketId
        },
        {
          type: "post_message",
          title: "Close Ticket",
          value: "I want to close this ticket",
          hidden_content: "close_ticket::" + ticket.ticketId
        },
        {
          type: "post_message",
          title: "Reopen Ticket",
          value: "I want to reopen this ticket",
          hidden_content: "reopen_ticket::" + ticket.ticketId
        }
      ]
    }
  }
};
 
 