// ── AUTH GUARD ── must be first line
var authVerified = await (Storage.user.get("auth_verified")) || "";
if (authVerified !== "true") {
  return {
    success: false,
    avm_instruction: "User is not authenticated. Do not call handleKnowledge(). Ask for Employee ID and email first, then call authenticateEmployee()."
  };
}

console.log("handleKnowledge called, query:", context.query);

if (!context.query) {
  await (Storage.user.set("llamb_called", "true"));
  return {
    success: false,
    avm_instruction: "No query provided. Proceed directly to classifyTicket() with the user's description."
  };
}

try {
  var llambResponse = await (LLaMB.generate(context.query));
  console.log("handleKnowledge LLaMB response:", JSON.stringify(llambResponse));

  if (!llambResponse || !llambResponse.llamb_response || !llambResponse.llamb_response.stream_url) {
    throw new Error("No stream URL in LLaMB response");
  }

  var streamUrl = llambResponse.llamb_response.stream_url;
  console.log("handleKnowledge stream URL:", streamUrl);

  var streamResponse = await (fetch(streamUrl));
  if (!streamResponse.ok) {
    throw new Error("Stream URL returned status " + streamResponse.status);
  }

  var answer = await (streamResponse.text());
  console.log("handleKnowledge RAW answer:", answer);

  // ── CLEANUP: Remove all citation/source artifacts ──
  // Remove **,  at very start
  answer = answer.replace(/^\*\*,\s*/m, "");
  answer = answer.replace(/^,\s+/m, "");
  
  answer = answer.replace(/\.pdf/gi, "");

  // Remove Source: [] [] or Source: [1][2] (any combination)
  answer = answer.replace(/Source:\s*(\[\d*\]\s*)+/gi, "");
  answer = answer.replace(/Source:\s*\[[^\]]*\]/gi, "");

  // Remove inline [1] [2] citation numbers and [1]:
  answer = answer.replace(/\[\d+\]/g, "");
  answer = answer.replace(/\[\d+\]:/g, "");

  // Remove lines starting with : followed by a URL
  answer = answer.replace(/^:\s*https?:\/\/[^\n]*/gm, "");

  // Remove any Avaamo internal URLs anywhere in text
  answer = answer.replace(/https?:\/\/x1\.avaamo\.com\/llamb\/messages\/[^\s"')]+/gi, "");

  // Remove PDF filename references in quotes
  answer = answer.replace(/"[^"]*\.pdf"\s*/gi, "");

  // Remove lines that are just ] or [] or :
  answer = answer.replace(/^\]\s*$/gm, "");
  answer = answer.replace(/^\[\]\s*$/gm, "");
  answer = answer.replace(/^:\s*$/gm, "");

  // Clean up blank lines
  answer = answer.replace(/\n{3,}/g, "\n\n");
  
  // Remove trailing ] [] patterns
  answer = answer.replace(/\]\s*\[\]/g, "");
  answer = answer.replace(/\[\]\s*\[\]/g, "");
  
  // Remove orphaned ] at end of lines
  answer = answer.replace(/\]\s*$/gm, "");
  answer = answer.trim();

  console.log("handleKnowledge CLEANED answer:", answer);

  var isInvalid = (
    !answer ||
    answer.trim() === "" ||
    answer.includes("<avm-stream-aborted>") ||
    answer.toLowerCase().indexOf("failure") !== -1 ||
    answer.toLowerCase().indexOf("technical error") !== -1 ||
    answer.trim().length < 10
  );

  if (isInvalid) {
    throw new Error("Invalid or empty answer from LLaMB");
  }

  await (Storage.user.set("llamb_called", "true"));
  await (Storage.user.set("llamb_answer_shown", "true"));

  var ref = getExternalReferenceURL(context.query);
  // Fallback: if raw query didn't match, try stored subcategory
  if (!ref) {
    var storedSubcat = await (Storage.user.get("ticket_subcategory")) || "";
    ref = getExternalReferenceURL(storedSubcat);
  }

 var links = [];
  if (ref) {
    links.push({
      type: "web_page",
      title: "📖 Read Full Support Article",
      url: ref.url
    });
  }
  links.push({
    type: "post_message",
    title: "🎫 Raise a Support Ticket",
    value: "I still want to raise a ticket"
  });
  links.push({
    type: "post_message",
    title: "✅ Issue Resolved",
    value: "My issue is resolved, thank you"
  });

  return {
    success: true,
    "notification_message": "Was this solution helpful? If not, I can create a support ticket for you.",
    message: {
      card: {
        title: "Suggested Solutions",
        description: answer + "\n\nWas this solution helpful? If not, I can create a support ticket for you.",
        links: links
      }
    },
    avm_instruction: "The troubleshooting steps have been shown. Ask the user: 'Was this solution helpful? If not, I can create a support ticket for you.' If user says   	yes/resolved/helpful/thanks → end the flow gracefully. If user says no/not helpful/still not working/raise ticket/create ticket → call classifyTicket() with the original issue description and continue ticket creation from Step 2."
  };

} catch (error) {
  console.error("handleKnowledge error:", error.message || error);
  await (Storage.user.set("llamb_called", "true"));
  return {
    success: false,
    no_answer: true,
    avm_instruction: "No relevant answer found in the knowledge base. Do not mention this to the user. Silently call classifyTicket() with the original description and continue the ticket creation flow from Step 2."
  };
}