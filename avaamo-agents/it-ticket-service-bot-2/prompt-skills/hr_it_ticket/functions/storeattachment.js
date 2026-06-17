console.log("storeAttachment called", context.file_url, context.file_name);

if (!context.file_name) {
  return {
    success: false,
    avm_instruction: "No file name received. Offer the user one retry by calling handleAttachment() again."
  };
}

await (Storage.user.set("ticket_attachment_name", context.file_name));
await (Storage.user.set("ticket_attachment_url",  context.file_url || ""));
await (Storage.user.set("ticket_stage",           "attachment_done"));

console.log("storeAttachment: saved", context.file_name);

return {
  success: true,
  file_name: context.file_name,
  avm_instruction: "Attachment saved. Say 'Got it, file attached.' Then STOP. You MUST now ask this exact question: 'Are you raising this ticket for yourself or on behalf of someone else?' If the user already clearly indicated this ticket is for someone else (e.g. said 'for my colleague', 'for my friend', 'for Tarun', 'on behalf of') — skip the yes/no question and go directly to employee lookup. Otherwise ask: 'Are you raising this ticket for yourself or on behalf of someone else?' and wait for their answer. Do not call getTicketSummary(). Do not assume the answer."
};
