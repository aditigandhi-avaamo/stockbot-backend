// var ticketsRaw = await (Storage.user.get("ticket_history"));
// var tickets = ticketsRaw ? JSON.parse(ticketsRaw) : [];

// var ticket = tickets.find(function(t) {
//   return t.ticketId === context.ticket_id;
// });

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

console.log(
  "Total tickets:",
  tickets ? tickets.length : 0
);
console.log(JSON.stringify(tickets));

var ticketId = context.ticket_id || "";

var match = ticketId.match(/HRC\d+/);
if (match) {
  ticketId = match[0];
}

console.log("Reopening ticket:", ticketId);

var ticket = tickets.find(function(t) {
  return t.ticketId === ticketId;
});

console.log("Found ticket:", JSON.stringify(ticket));

if (!ticket) {
  return {
    success: false,
    avm_instruction: "Ticket not found. Tell the user the ticket ID could not be located."
  };
}

ticket.status = "Reopened";
ticket.reopenedAt = new Date().toISOString();

await (Storage.user.set(
  "ticket_history",
  JSON.stringify(tickets)
));

await (Storage.global.set(
  "ticket_history_" + authEmpId,
  JSON.stringify(tickets)
));

return {
  success: true,
  avm_instruction: "Ticket reopened successfully. Tell the user: Your ticket " + context.ticket_id + " has been reopened. Our IT team will follow up shortly."
};