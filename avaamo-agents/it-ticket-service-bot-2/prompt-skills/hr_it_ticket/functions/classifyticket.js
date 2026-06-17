var llambCalled = await (Storage.user.get("llamb_called")) || "";
if (!llambCalled) {
  return {
    success: false,
    avm_instruction: "STOP. You must call handleKnowledge() with the user's description BEFORE calling classifyTicket(). Call handleKnowledge() now, then come back to classifyTicket() only if handleKnowledge() returns success:false or the user still wants to raise a ticket."
  };
}

console.log("classifyTicket", context.description);

var learnedRaw = await (Storage.global.get("dynamic_category_mappings"));
var learnedMappings = learnedRaw ? JSON.parse(learnedRaw) : [];
var text = (context.description || "").toLowerCase();

for (var i = 0; i < learnedMappings.length; i++) {
  var map = learnedMappings[i];
  if (text.indexOf(map.sample_text) !== -1) {
    await (Storage.user.set("ticket_category",    map.category));
    await (Storage.user.set("ticket_subcategory", map.subcategory));
    await (Storage.user.set("ticket_description", context.description));
    await (Storage.user.set("ticket_stage",       "classified"));
    console.log("classifyTicket: matched dynamic mapping", map);
    return {
      success: true,
      category: map.category,
      subcategory: map.subcategory,
      avm_instruction: "Classification done. STOP. Do not call getTicketSummary(). Do not ask about requester. Proceed to step 3, You MUST ask the user this exact question right now: 'Would you like to attach a screenshot or document to this ticket?' Wait for yes or no before doing anything else."
    };
  }
}

var result = classifyDescription(context.description);
console.log("classifyTicket: static result", JSON.stringify(result));

if (result) {
  await (Storage.user.set("ticket_category",    result.category));
  await (Storage.user.set("ticket_subcategory", result.subcategory));
  await (Storage.user.set("ticket_description", context.description));
  await (Storage.user.set("ticket_stage",       "classified"));

  return {
    success: true,
    category:    result.category,
    subcategory: result.subcategory,
    avm_instruction: "Classification done. STOP. Do not call getTicketSummary(). Do not ask about requester. Proceed to step 3, You MUST ask the user this exact question right now: 'Would you like to attach a screenshot or document to this ticket?' Wait for yes or no before doing anything else."
  };
}

await (Storage.user.set("ticket_description", context.description));
await (Storage.user.set("ticket_stage",       "classified"));
return {
  success: false,
  avm_instruction: "Could not auto-classify. Ask the user: 'Could you help me categorise this? Is this a Hardware issue (e.g. laptop, monitor, peripherals) or a Software issue (e.g. application access, software not working)?' After they answer, call updateTicketField() with category and subcategory. Then ask: Would you like to attach a screenshot or document to this ticket?"
};
