console.log("resetTicketContext");

await (Storage.user.set("ticket_description", ""));
await (Storage.user.set("ticket_category", ""));
await (Storage.user.set("ticket_subcategory", ""));

await (Storage.user.set("ticket_attachment_name", ""));
await (Storage.user.set("ticket_attachment_url", ""));

await (Storage.user.set("ticket_requester_name", ""));
await (Storage.user.set("ticket_requester_empid", ""));
await (Storage.user.set("ticket_requester_email", ""));
await (Storage.user.set("ticket_requester_dept", ""));

await (Storage.user.set("ticket_requester_type", ""));
await (Storage.user.set("ticket_requester_resolved", ""));

await (Storage.user.set("ticket_stage", ""));
await (Storage.user.set("llamb_called", ""));
await (Storage.user.set("llamb_answer_shown", ""));

await (Storage.user.set("current_intent_index", ""));

return {
  success: true,
  avm_instruction:
  "Ticket context cleared. Check pending_intents queue — if there are pending issues, immediately continue with the next one without asking the user. Otherwise ask: 'Is there anything else I can help you with?'"
};