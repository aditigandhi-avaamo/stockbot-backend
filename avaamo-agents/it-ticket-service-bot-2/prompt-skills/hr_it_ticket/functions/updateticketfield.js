console.log("updateTicketField input:", JSON.stringify({
  description:           context.description,
  category:              context.category,
  subcategory:           context.subcategory,
  requester_name:        context.requester_name,
  requester_employee_id: context.requester_employee_id,
  requester_email:       context.requester_email,
  requester_department:  context.requester_department,
  attachment_name:       context.attachment_name,
  attachment_url:        context.attachment_url
}));

if (context.description           !== null && context.description           !== undefined)
  await (Storage.user.set("ticket_description",    context.description));

if (context.category              !== null && context.category              !== undefined)
  await (Storage.user.set("ticket_category",       context.category));

if (context.subcategory           !== null && context.subcategory           !== undefined)
  await (Storage.user.set("ticket_subcategory",    context.subcategory));

if (context.requester_name        !== null && context.requester_name        !== undefined)
  await (Storage.user.set("ticket_requester_name",  context.requester_name));

if (context.requester_employee_id !== null && context.requester_employee_id !== undefined)
  await (Storage.user.set("ticket_requester_empid", context.requester_employee_id));

if (context.requester_email       !== null && context.requester_email       !== undefined)
  await (Storage.user.set("ticket_requester_email", context.requester_email));

if (context.requester_department  !== null && context.requester_department  !== undefined)
  await (Storage.user.set("ticket_requester_dept",  context.requester_department));

if (context.attachment_name !== null && context.attachment_name !== undefined)
  await (Storage.user.set("ticket_attachment_name", context.attachment_name));

if (context.attachment_url  !== null && context.attachment_url  !== undefined)
  await (Storage.user.set("ticket_attachment_url",  context.attachment_url));

// Save dynamic category mapping if category/subcategory were manually set
if (context.category && context.subcategory && context.description) {
  var existingRaw = await (Storage.global.get("dynamic_category_mappings"));
  var existing = existingRaw ? JSON.parse(existingRaw) : [];
  existing.push({
    category:    context.category,
    subcategory: context.subcategory,
    sample_text: context.description.toLowerCase().substring(0, 50)
  });
  await (Storage.global.set("dynamic_category_mappings", JSON.stringify(existing)));
}
if (context.pending_intents !== undefined) {
  await (Storage.user.set("pending_intents", context.pending_intents));
  console.log("pending_intents saved:", context.pending_intents);
}

// ── KEY: detect no-attachment decision ──
// When called with attachment_name="" and attachment_url="" → user said No to attachment
var isNoAttachment = (
  context.attachment_name === "" &&
  context.attachment_url  === ""
);

if (isNoAttachment) {
  await (Storage.user.set("ticket_stage", "attachment_done"));
  return {
    success: true,
    avm_instruction: "No attachment recorded. STOP. You MUST now ask this exact question: 'Are you raising this ticket for yourself or on behalf of someone else?' Even if the user mentioned a colleague or friend earlier in the conversation, you must ask this question explicitly and wait for their answer. Do not call getTicketSummary(). Do not assume the answer."
  };
}

// For all other field updates
var currentStage = await (Storage.user.get("ticket_stage")) || "";

if (currentStage === "classified" || currentStage === "") {
  return {
    success: true,
    avm_instruction: "Fields updated. STOP. You MUST now ask: 'Would you like to attach a screenshot or document to this ticket?' Do not call getTicketSummary()."
  };
}

if (currentStage === "attachment_done") {
  return {
    success: true,
    avm_instruction: "Fields updated. STOP. You MUST now ask: 'Are you raising this ticket for yourself or on behalf of someone else?' Do not call getTicketSummary()."
  };
}

return {
  success: true,
  avm_instruction: "Fields updated in storage. Now call getTicketSummary() to show the user the updated summary."
};