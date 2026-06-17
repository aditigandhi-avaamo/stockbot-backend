// console.log("viewMyTickets", context.filter);

// var authEmpId = await (Storage.user.get("auth_empid")) || "";
// var authName  = await (Storage.user.get("auth_name"))  || "";

// var ticketsRaw = await (Storage.user.get("ticket_history"));
// if (!ticketsRaw) {
//   ticketsRaw = await (Storage.global.get("ticket_history_" + authEmpId));
// }

// var tickets = ticketsRaw ? JSON.parse(ticketsRaw) : [];
console.log("viewMyTickets", context.filter);

var authEmpId = await (Storage.user.get("auth_empid")) || "";
var authName  = await (Storage.user.get("auth_name"))  || "";

var globalRaw = null;
try { globalRaw = await (Storage.global.get("ticket_history_" + authEmpId)); } catch(e) {}

var sessionRaw = null;
try { sessionRaw = await (Storage.user.get("ticket_history")); } catch(e) {}

var globalTickets  = globalRaw  ? JSON.parse(globalRaw)  : [];
var sessionTickets = sessionRaw ? JSON.parse(sessionRaw) : [];

var seen = {};
globalTickets.forEach(function(t) { seen[t.ticketId] = true; });
sessionTickets.forEach(function(t) {
  if (!seen[t.ticketId]) { globalTickets.push(t); seen[t.ticketId] = true; }
});

var tickets = globalTickets;

tickets = tickets.filter(function(ticket) {
  return ticket.createdByEmpId === authEmpId ||
         ticket.requesterEmpId === authEmpId ||
         ticket.raisedBy       === authName;
});

var filter = context.filter || "all";
var now = new Date();

if (filter === "today") {
  var startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  tickets = tickets.filter(function(t) { return new Date(t.createdAt) >= startOfDay; });
} else if (filter === "this_week") {
  var weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  tickets = tickets.filter(function(t) { return new Date(t.createdAt) >= weekAgo; });
} else if (filter === "last_month") {
  var monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  tickets = tickets.filter(function(t) { return new Date(t.createdAt) >= monthAgo; });
} else if (filter === "last_hour") {
  var hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  tickets = tickets.filter(function(t) { return new Date(t.createdAt) >= hourAgo; });
} else if (filter === "last_half_hour") {
  var halfHourAgo = new Date(now.getTime() - 30 * 60 * 1000);
  tickets = tickets.filter(function(t) { return new Date(t.createdAt) >= halfHourAgo; });
}

var statusFilter = context.status_filter || "";
if (statusFilter) {
  tickets = tickets.filter(function(t) {
    return t.status.toLowerCase() === statusFilter.toLowerCase();
  });
}

var categoryFilter = context.category_filter || "";
if (categoryFilter) {
  tickets = tickets.filter(function(t) {
    return t.category && t.category.toLowerCase() === categoryFilter.toLowerCase();
  });
}

var subcategoryFilter = context.subcategory_filter || "";
if (subcategoryFilter) {
  tickets = tickets.filter(function(t) {
    return t.subcategory && t.subcategory.toLowerCase().indexOf(subcategoryFilter.toLowerCase()) !== -1;
  });
}

var keywordFilter = context.keyword_filter || "";
if (keywordFilter) {
  tickets = tickets.filter(function(t) {
    return t.description && t.description.toLowerCase().indexOf(keywordFilter.toLowerCase()) !== -1;
  });
}

console.log("viewMyTickets: found", tickets.length, "for filter", filter);

if (tickets.length === 0) {
  return {
    success: false,
    avm_instruction: "No tickets found. Tell the user and ask if they want to view tickets from a different time period or raise a new one."
  };
}

tickets.sort(function(a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });

var items = tickets.map(function(t) {
  var date = new Date(t.createdAt);
  var dateStr = date.toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric"
  });
  return {
    title: t.ticketId,
    subtitle: t.category + " • " + t.status + " • " + dateStr,
    links: [{
      type: "post_message",
      title: "View Details",
      value: "Viewing ticket " + t.ticketId,
      hidden_content: "view_ticket::" + t.ticketId
    }]
  };
});

var filterLabel = {
  today: "Today", this_week: "This Week",
  last_month: "Last Month", all: "All"
}[filter] || "All";

return {
  success: true,
  messages: [
    { text: "Here are your tickets — **" + filterLabel + "** (" + tickets.length + " found)." },
    { list_view: { top_element_style: "compact", items: items } }
  ]
};

// console.log("viewMyTickets", context.filter);

// var ticketsRaw = await (Storage.user.get("ticket_history"));
// if (!ticketsRaw) {
//   ticketsRaw = await (Storage.global.get("ticket_history_" + authEmpId));
// }
// var tickets = ticketsRaw ? JSON.parse(ticketsRaw) : [];
// var authEmpId = await (Storage.user.get("auth_empid"));
// var authName  = await (Storage.user.get("auth_name"));   // ← fetched before filter, no await inside callback

// // Filter by the authenticated user
// tickets = tickets.filter(function(ticket) {
//   return ticket.createdByEmpId  === authEmpId ||
//          ticket.requesterEmpId === authEmpId ||
//          ticket.raisedBy       === authName;
// });

// // Apply time filter
// var filter = context.filter || "all";
// var now = new Date();

// if (filter === "today") {
//   var startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//   tickets = tickets.filter(function(t) { return new Date(t.createdAt) >= startOfDay; });
// } else if (filter === "this_week") {
//   var weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
//   tickets = tickets.filter(function(t) { return new Date(t.createdAt) >= weekAgo; });
// } else if (filter === "last_month") {
//   var monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
//   tickets = tickets.filter(function(t) { return new Date(t.createdAt) >= monthAgo; });
// }

// // Apply status filter
// var statusFilter = context.status_filter || "";
// if (statusFilter) {
//   tickets = tickets.filter(function(t) {
//     return t.status.toLowerCase() === statusFilter.toLowerCase();
//   });
// }

// } else if (filter === "last_hour") {
//   var hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
//   tickets = tickets.filter(function(t) { return new Date(t.createdAt) >= hourAgo; });
// } else if (filter === "last_half_hour") {
//   var halfHourAgo = new Date(now.getTime() - 30 * 60 * 1000);
//   tickets = tickets.filter(function(t) { return new Date(t.createdAt) >= halfHourAgo; });
// }
// console.log("viewMyTickets: found", tickets.length, "tickets for filter", filter);

// if (tickets.length === 0) {
//   var filterLabel = { today: "today", this_week: "this week", last_month: "last month", all: "" }[filter] || "";
//   return {
//     success: false,
//     avm_instruction: "No tickets found" + (filterLabel ? " for " + filterLabel : "") + ". Tell the user and ask if they want to view tickets from a different time period or raise a new one."
//   };
// }

// // Sort newest first
// tickets.sort(function(a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });

// var items = tickets.map(function(t) {
//   var date = new Date(t.createdAt);
//   var dateStr = date.toLocaleDateString("en-IN", {
//     day: "2-digit", month: "short", year: "numeric"
//   });
//   return {
//     title: t.ticketId,
//     subtitle: t.category + " • " + t.status + " • " + dateStr,
//     links: [{
//       type: "post_message",
//       title: "View Details",
//       value: "Viewing ticket " + t.ticketId,
//       hidden_content: "view_ticket::" + t.ticketId
//     }]
//   };
// });
 
// var filterLabel = {
//   today: "Today", this_week: "This Week",
//   last_month: "Last Month", all: "All"
// }[filter] || "All";
 
// return {
//   success: true,
//   messages: [
//     { text: "Here are your tickets — **" + filterLabel + "** (" + tickets.length + " found)." },
//     { list_view: { top_element_style: "compact", items: items } }
//   ]
// };