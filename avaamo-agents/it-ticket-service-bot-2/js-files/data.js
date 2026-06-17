// ─────────────────────────────────────────────────────────────────────────────
// data.js  —  HR IT Ticket Bot · Global JS (Common JS)
// Load order: this file MUST be first.
// ─────────────────────────────────────────────────────────────────────────────

// ═══════════════════════════════════════════════════════════════════════════
// DB 1 — CATEGORY & SUBCATEGORY
// ═══════════════════════════════════════════════════════════════════════════

function getCategoryDB() {
  return [
    {
      category: "Hardware",
      subcategories: [
        {
          name: "Laptop",
          keywords: [
            "laptop","computer","pc","display","screen","keyboard","battery",
            "charger","adapter","touchpad","trackpad","boot","startup","freeze",
            "slow","hang","blue screen","bsod","overheating","hot","fan","noise",
            "cracked","broken","not turning on","won't turn on","black screen",
            "blank screen","blank display","no display","blank"
          ]
        },
        {
          name: "Monitor",
          keywords: [
            "monitor","external display","second screen","dual monitor","flickering",
            "blurry","resolution","hdmi","vga","display port","docking station",
            "brightness","no signal"
          ]
        },
        {
          name: "Peripherals - Audio",
          keywords: [
            "headphone","earphone","headset","microphone","mic","speaker",
            "audio","sound","wired earphone","wireless earphone","noise cancelling",
            "bluetooth headset","usb headset"
          ]
        },
        {
          name: "Peripherals - Input",
          keywords: [
            "mouse","keyboard","external keyboard","wireless mouse","trackball",
            "numeric pad","webcam","camera","scanner"
          ]
        },
        {
          name: "Network & Connectivity",
          keywords: [
            "wifi","wi-fi","internet","network","ethernet","lan","vpn",
            "connectivity","slow internet","no internet","disconnecting","usb hub",
            "dongle","hotspot","mobile data"
          ]
        },
        {
          name: "Storage & Memory",
          keywords: [
            "hard drive","ssd","hdd","storage","disk","ram","memory",
            "external hard drive","pen drive","usb drive","data loss","backup"
          ]
        },
        {
          name: "Printer & Accessories",
          keywords: [
            "printer","printing","photocopy","ink","toner",
            "paper jam","print quality","print not working",
            "printer not working", "printer issue", "printer problem",
            "printer offline", "printer error"
          ]
        },
        {
          name: "Power & Cables",
          keywords: [
            "power","cable","wire","extension cord","ups","surge protector",
            "power supply","dock","docking","port","usb port","hdmi port","charger"
          ]
        },
        {
          name: "Hardware - Other",
          keywords: [
            "hardware","device","equipment","accessories","new laptop",
            "replacement","damaged","broken device"
          ]
        }
      ]
    },
    {
      category: "Software",
      subcategories: [
        {
          name: "Microsoft Office / M365",
          keywords: [
            "office","microsoft","word","excel","powerpoint","outlook","teams",
            "onenote","onedrive","sharepoint","microsoft 365","m365","office 365",
            "license","activation","subscription"
          ]
        },
        {
          name: "Slack",
          keywords: [
            "slack","slack message","slack channel","slack notification",
            "slack workspace","slack not working","slack access"
          ]
        },
        {
          name: "Zoom",
          keywords: [
            "zoom","zom","zoom meeting","zoom call","zoom video","zoom audio",
            "zoom access","zoom license","zoom not working","zoom link"
          ]
        },
        {
          name: "Google Workspace",
          keywords: [
            "google","gmail","google drive","google docs","google sheets",
            "google meet","google calendar","workspace","gsuite"
          ]
        },
        {
          name: "SAP",
          keywords: [
            "sap","sap fiori","sap erp","sap access","sap login",
            "sap not working","sap module","sap transaction"
          ]
        },
        {
          name: "Jira / Confluence",
          keywords: [
            "jira","confluence","atlassian","jira ticket","jira access",
            "jira board","confluence page","project management tool"
          ]
        },
        {
          name: "Salesforce",
          keywords: [
            "salesforce","crm","salesforce access","salesforce login",
            "salesforce not working","sfdc"
          ]
        },
        {
          name: "VPN & Remote Access",
          keywords: [
            "vpn","remote access","remote desktop","anyconnect","citrix",
            "remote login","two factor","2fa","mfa","authenticator",
            "multi factor authentication"
          ]
        },
        {
          name: "Operating System",
          keywords: [
            "windows","mac","macos","os","operating system","update",
            "upgrade","windows update","os update","reinstall","os crash"
          ]
        },
        {
          name: "Security & Antivirus",
          keywords: [
            "antivirus","virus","malware","security","firewall","endpoint",
            "crowdstrike","symantec","mcafee","defender","threat","phishing",
            "suspicious email","spam"
          ]
        },
        {
          name: "Software Access Request",
          keywords: [
            "access","permission","install","installation","new software",
            "request software","software request","license request",
            "tool access","application access","need access","get access",
            "approve access"
          ]
        },
        {
          name: "Software - Other",
          keywords: [
            "software","application","app","program","tool","not working",
            "crashing","error","bug","issue with software","software issue",
            "not launching","not opening","slow application"
          ]
        },
        {
          name: "Rippling Account",
          keywords: [
            "rippling", "rippling account", "rippling login", "onboarding",
            "identity management", "rip", "rippling app", "suspension",
            "mfa reset", "provisions"
          ]
        },
        {
          name: "Zoho Payroll",
          keywords: [
            "zoho payroll", "zoho", "payroll access", "salary slip",
            "tax document", "payslip", "zoho login", "reimbursement"
          ]
        },
        {
          name: "GitHub",
          keywords: [
            "github", "git", "repository", "ssh key", "organization access",
            "2fa recovery", "branch protection", "permission denied",
            "clone", "commit"
          ]
        },
        {
          name: "Cursor",
          keywords: [
            "cursor", "cursor editor", "cursor access", "cursor pro",
            "ai editor", "cursor settings", "indexing", "codebase indexing"
          ]
        },
        {
          name: "Google Antigravity",
          keywords: [
            "antigravity", "google antigravity", "antigravity ide",
            "antigravity 2.0", "agent manager", "artifacts",
            "mcp server", "subagents", "scheduled tasks"
          ]
        },
        {
          name: "JupyterLabs",
          keywords: [
            "jupyterlabs", "jupyterlab", "jupyter", "kernel", "notebook",
            "dead kernel", "server connection", "python local environment",
            "anaconda"
          ]
        },
        {
          name: "Copilot",
          keywords: [
            "copilot", "github copilot", "microsoft copilot", "autocomplete",
            "copilot token", "extension setup", "copilot chat"
          ]
        },
        {
          name: "ChatGPT",
          keywords: [
            "chatgpt", "openai", "enterprise chatgpt", "api limit",
            "gpt-4o", "sso login", "openai authentication"
          ]
        },
        {
          name: "Lovable",
          keywords: [
            "lovable", "lovable access", "lovable app", "deployment failure",
            "full-stack app builder", "project limit", "token", "auth link"
          ]
        }
      ]
    }
  ];
}

// ═══════════════════════════════════════════════════════════════════════════
// DB 2 — EMPLOYEE DATABASE
// ═══════════════════════════════════════════════════════════════════════════

function getEmployeeDB() {
  return [
    { fullName: "Arjun Mehta",   employeeId: "EMP001", email: "arjun.mehta@avaamo.com",   department: "Engineering"      },
    { fullName: "Priya Sharma",  employeeId: "EMP002", email: "priya.sharma@avaamo.com",  department: "Marketing"        },
    { fullName: "Ravi Kumar",    employeeId: "EMP003", email: "ravi.kumar@avaamo.com",    department: "Finance"          },
    { fullName: "Sneha Iyer",    employeeId: "EMP004", email: "sneha.iyer@avaamo.com",    department: "HR"               },
    { fullName: "Vikram Nair",   employeeId: "EMP005", email: "vikram.nair@avaamo.com",   department: "Sales"            },
    { fullName: "Ananya Reddy",  employeeId: "EMP006", email: "ananya.reddy@avaamo.com",  department: "Engineering"      },
    { fullName: "Rohit Bansal",  employeeId: "EMP007", email: "rohit.bansal@avaamo.com",  department: "Operations"       },
    { fullName: "Deepa Thomas",  employeeId: "EMP008", email: "deepa.thomas@avaamo.com",  department: "Legal"            },
    { fullName: "Karan Singh",   employeeId: "EMP009", email: "karan.singh@avaamo.com",   department: "IT"               },
    { fullName: "Meera Pillai",  employeeId: "EMP010", email: "meera.pillai@avaamo.com",  department: "Customer Success" },
    { fullName: "Aditya Joshi",  employeeId: "EMP011", email: "aditya.joshi@avaamo.com",  department: "Engineering"      },
    { fullName: "Pooja Desai",   employeeId: "EMP012", email: "pooja.desai@avaamo.com",   department: "Design"           },
    { fullName: "Siddharth Rao", employeeId: "EMP013", email: "siddharth.rao@avaamo.com", department: "Product"          },
    { fullName: "Nisha Kapoor",  employeeId: "EMP014", email: "nisha.kapoor@avaamo.com",  department: "Finance"          },
    { fullName: "Tarun Verma",   employeeId: "EMP015", email: "tarun.verma@avaamo.com",   department: "Engineering"      }
  ];
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER — classifyDescription (SYNC — no await inside, safe for global JS)
// ═══════════════════════════════════════════════════════════════════════════

// ⚠️ CRITICAL: This is a plain sync function. Never put await inside it.
// The classifyTicket() skill function handles dynamic mappings (async work).

function classifyDescription(description) {
  if (!description) return null;

  var text = description.toLowerCase();
  var db = getCategoryDB();
  var bestMatch = null;
  var bestScore = 0;

  for (var c = 0; c < db.length; c++) {
    var cat = db[c];
    for (var s = 0; s < cat.subcategories.length; s++) {
      var sub = cat.subcategories[s];
      var score = 0;
      for (var k = 0; k < sub.keywords.length; k++) {
        if (text.indexOf(sub.keywords[k]) !== -1) {
          // longer keyword phrases score higher
          score += sub.keywords[k].split(" ").length;
        }
      }
      if (score > bestScore) {
        bestScore = score;
        bestMatch = { category: cat.category, subcategory: sub.name };
      }
    }
  }

  return bestScore > 0 ? bestMatch : null;
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER — verifyLoginEmployee (used by authenticateEmployee)
// ═══════════════════════════════════════════════════════════════════════════

function verifyLoginEmployee(employeeId, email) {
  var db = getEmployeeDB();
  for (var i = 0; i < db.length; i++) {
    var emp = db[i];
    var idMatch    = employeeId && emp.employeeId.toLowerCase() === employeeId.trim().toLowerCase();
    var emailMatch = email      && emp.email.toLowerCase()      === email.trim().toLowerCase();
    if (idMatch && emailMatch) return emp;
  }
  return null;
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER — lookupEmployee (used by validateEmployee)
// ═══════════════════════════════════════════════════════════════════════════

function lookupEmployee(name, employeeId, email) {
  var db = getEmployeeDB();
  for (var i = 0; i < db.length; i++) {
    var emp = db[i];
    var nameMatch  = name       && emp.fullName.toLowerCase().indexOf(name.toLowerCase()) !== -1;
    var idMatch    = employeeId && emp.employeeId.toLowerCase() === employeeId.trim().toLowerCase();
    var emailMatch = email      && emp.email.toLowerCase()      === email.trim().toLowerCase();
    if (nameMatch || idMatch || emailMatch) return emp;
  }
  return null;
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER — searchEmployees (used by searchEmployees skill function)
// Returns Avaamo list_view format. Fully sync — no await.
// ═══════════════════════════════════════════════════════════════════════════

function searchEmployeesHelper(query) {
  var q = (query || "").toLowerCase().trim();
  var employees = getEmployeeDB();

  var matches = employees.filter(function(emp) {
    return (
      emp.fullName.toLowerCase().indexOf(q) !== -1 ||
      emp.email.toLowerCase().indexOf(q)    !== -1 ||
      emp.employeeId.toLowerCase().indexOf(q) !== -1
    );
  });

  if (matches.length === 0) {
    return {
      success: false,
      avm_instruction: "No employee found matching that query. Ask the user to manually provide Full Name, Employee ID, and Email."
    };
  }

  return {
    success: true,
    messages: [
      { text: "I found the following employees. Please tap Select to choose one." },
      {
        list_view: {
          top_element_style: "compact",
          items: matches.map(function(emp) {
            return {
              title: emp.fullName,
              subtitle: emp.employeeId + " • " + emp.department,
              links: [
                {
                  type: "post_message",
                  title: "Select " + emp.fullName,
                  value: "You have selected " + emp.fullName,
                  hidden_content: "emp_selected::" + emp.fullName + "::" + emp.employeeId + "::" + emp.email + "::" + emp.department
                }
              ]
            };
          })
        }
      }
    ]
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER — generateTicketId
// ═══════════════════════════════════════════════════════════════════════════

function generateTicketId() {
  var digits = "";
  for (var i = 0; i < 8; i++) {
    digits += Math.floor(Math.random() * 10).toString();
  }
  return "HRC" + digits;
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER — handleKnowledge for links
// ═══════════════════════════════════════════════════════════════════════════

function getExternalReferenceURL(query) {
  var text = (query || "").toLowerCase();
  var refs = [
    { keywords: ["outlook","word","excel","powerpoint","teams","onedrive","sharepoint","m365","office"], url: "https://support.microsoft.com/office", title: "Microsoft 365 Help Center" },
    { keywords: ["slack"], url: "https://slack.com/help", title: "Slack Help Center" },
    { keywords: ["zoom"], url: "https://support.zoom.us", title: "Zoom Support" },
    { keywords: ["google","gmail","gdrive","google docs","google sheets","google meet"], url: "https://support.google.com", title: "Google Support" },
    { keywords: ["sap","fiori"], url: "https://community.sap.com", title: "SAP Community" },
    { keywords: ["jira","confluence","atlassian"], url: "https://support.atlassian.com", title: "Atlassian Support" },
    { keywords: ["salesforce","sfdc"], url: "https://help.salesforce.com", title: "Salesforce Help" },
    { keywords: ["vpn","anyconnect","citrix","mfa","2fa","authenticator"], url: "https://support.microsoft.com/windows", title: "Microsoft Authenticator Guide" },
    { keywords: ["windows","mac","os","operating system","reinstall"], url: "https://support.microsoft.com/windows", title: "Microsoft Support" },
    { keywords: ["antivirus","crowdstrike","defender","phishing","malware"], url: "https://support.microsoft.com/windows", title: "Microsoft Defender Support" },
    { keywords: ["github","git","repository","ssh"], url: "https://docs.github.com/en", title: "GitHub Docs" },
    { keywords: ["cursor","cursor editor"], url: "https://cursor.com/docs", title: "Cursor Documentation" },
    { keywords: ["jupyter","jupyterlab","notebook","kernel"], url: "https://jupyterlab.readthedocs.io", title: "JupyterLab Docs" },
    { keywords: ["copilot","github copilot"], url: "https://docs.github.com/en", title: "GitHub Copilot Docs" },
    { keywords: ["chatgpt","openai","gpt"], url: "https://help.openai.com", title: "OpenAI Help" },
    { keywords: ["rippling"], url: "https://help.rippling.com", title: "Rippling Help" },
    { keywords: ["zoho","payroll","payslip"], url: "https://www.zoho.com/payroll/help/", title: "Zoho Payroll Help" },
    { keywords: ["lovable"], url: "https://docs.lovable.dev", title: "Lovable Docs" },
    { keywords: ["laptop","screen","battery","charger","keyboard","trackpad","bios","blue screen"], url: "https://www.ifixit.com/Guide", title: "iFixit Hardware Guide" },
    { keywords: ["monitor","display","hdmi","vga"], url: "https://support.microsoft.com/windows", title: "Microsoft Display Support" },
    { keywords: ["headphone","earphone","headset","microphone","audio","sound"], url: "https://wiki.archlinux.org/title/Category:Hardware", title: "Audio Hardware Guide" },
    { keywords: ["mouse","keyboard","webcam","scanner"], url: "https://support.apple.com", title: "Apple Support" },
    { keywords: ["wifi","internet","ethernet","network","connectivity"], url: "https://support.microsoft.com/windows", title: "Microsoft Network Help" },
    { keywords: ["printer","printing","ink","toner","paper jam"], url: "https://support.microsoft.com/windows", title: "Microsoft Printer Help" },
    { keywords: ["hard drive","ssd","storage","ram","memory","backup"], url: "https://docs.python.org/3/", title: "Storage Utilities" },
    { keywords: ["power","cable","dock","docking","ups"], url: "https://support.apple.com", title: "Apple Hardware Guide" }
  ];

  for (var i = 0; i < refs.length; i++) {
    for (var j = 0; j < refs[i].keywords.length; j++) {
      if (text.indexOf(refs[i].keywords[j]) !== -1) {
        return { url: refs[i].url, title: refs[i].title };
      }
    }
  }
  return null;
}
// // ─────────────────────────────────────────────────────────────
// // global_js.js — HR IT Ticket Bot · Global JS (Common JS)
// // Paste this entire file in Agent Settings → Common JS.
// // This is JS File #1 and must be first in load order.
// // ─────────────────────────────────────────────────────────────

// // ─── DB 1: CATEGORY & SUBCATEGORY ───────────────────────────

// function getCategoryDB() {
//   return [
//     {
//       category: "Hardware",
//       subcategories: [
//         {
//           name: "Laptop",
//           keywords: ["laptop", "computer", "pc", "screen", "display", "keyboard", "battery",
//                      "charger", "adapter", "touchpad", "trackpad", "boot", "startup", "freeze",
//                      "slow", "hang", "blue screen", "bsod", "overheating", "hot", "fan", "noise",
//                      "cracked", "broken", "not turning on", "won't turn on", "black screen"]
//         },
//         {
//           name: "Monitor",
//           keywords: ["monitor", "external display", "second screen", "dual monitor", "flickering",
//                      "blurry", "resolution", "hdmi", "vga", "display port", "docking station",
//                      "brightness", "no signal"]
//         },
//         {
//           name: "Peripherals - Audio",
//           keywords: ["headphone", "earphone", "headset", "microphone", "mic", "speaker",
//                      "audio", "sound", "wired earphone", "wireless earphone", "noise cancelling",
//                      "bluetooth headset", "usb headset"]
//         },
//         {
//           name: "Peripherals - Input",
//           keywords: ["mouse", "keyboard", "external keyboard", "wireless mouse", "trackball",
//                      "numeric pad", "webcam", "camera", "scanner"]
//         },
//         {
//           name: "Network & Connectivity",
//           keywords: ["wifi", "wi-fi", "internet", "network", "ethernet", "lan", "vpn",
//                      "connectivity", "slow internet", "no internet", "disconnecting", "usb hub",
//                      "dongle", "hotspot", "mobile data"]
//         },
//         {
//           name: "Storage & Memory",
//           keywords: ["hard drive", "ssd", "hdd", "storage", "disk", "ram", "memory",
//                      "external hard drive", "pen drive", "usb drive", "data loss", "backup"]
//         },
//         {
//           name: "Printer & Accessories",
//           keywords: ["printer", "printing", "scanner", "photocopy", "ink", "toner",
//                      "paper jam", "print quality", "print not working"]
//         },
//         {
//           name: "Power & Cables",
//           keywords: ["power", "cable", "wire", "extension cord", "ups", "surge protector",
//                      "power supply", "dock", "docking", "port", "usb port", "hdmi port"]
//         },
//         {
//           name: "Hardware - Other",
//           keywords: ["hardware", "device", "equipment", "accessories", "new laptop",
//                      "replacement", "damaged", "broken device"]
//         }
//       ]
//     },
//     {
//       category: "Software",
//       subcategories: [
//         {
//           name: "Microsoft Office / M365",
//           keywords: ["office", "microsoft", "word", "excel", "powerpoint", "outlook", "teams",
//                      "onenote", "onedrive", "sharepoint", "microsoft 365", "m365", "office 365",
//                      "license", "activation", "subscription"]
//         },
//         {
//           name: "Slack",
//           keywords: ["slack", "slack message", "slack channel", "slack notification",
//                      "slack workspace", "slack not working", "slack access"]
//         },
//         {
//           name: "Zoom",
//           keywords: ["zoom", "zoom meeting", "zoom call", "zoom video", "zoom audio",
//                      "zoom access", "zoom license", "zoom not working", "zoom link"]
//         },
//         {
//           name: "Google Workspace",
//           keywords: ["google", "gmail", "google drive", "google docs", "google sheets",
//                      "google meet", "google calendar", "workspace", "gsuite"]
//         },
//         {
//           name: "SAP",
//           keywords: ["sap", "sap fiori", "sap erp", "sap access", "sap login",
//                      "sap not working", "sap module", "sap transaction"]
//         },
//         {
//           name: "Jira / Confluence",
//           keywords: ["jira", "confluence", "atlassian", "jira ticket", "jira access",
//                      "jira board", "confluence page", "project management tool"]
//         },
//         {
//           name: "Salesforce",
//           keywords: ["salesforce", "crm", "salesforce access", "salesforce login",
//                      "salesforce not working", "sfdc"]
//         },
//         {
//           name: "VPN & Remote Access",
//           keywords: ["vpn", "remote access", "remote desktop", "anyconnect", "citrix",
//                      "remote login", "two factor", "2fa", "mfa", "authenticator",
//                      "multi factor authentication"]
//         },
//         {
//           name: "Operating System",
//           keywords: ["windows", "mac", "macos", "os", "operating system", "update",
//                      "upgrade", "windows update", "os update", "reinstall", "os crash"]
//         },
//         {
//           name: "Security & Antivirus",
//           keywords: ["antivirus", "virus", "malware", "security", "firewall", "endpoint",
//                      "crowdstrike", "symantec", "mcafee", "defender", "threat", "phishing",
//                      "suspicious email", "spam"]
//         },
//         {
//           name: "Software Access Request",
//           keywords: ["access", "permission", "install", "installation", "new software",
//                      "request software", "software request", "license request",
//                      "tool access", "application access", "need access", "get access",
//                      "approve access"]
//         },
//         {
//           name: "Software - Other",
//           keywords: ["software", "application", "app", "program", "tool", "not working",
//                      "crashing", "error", "bug", "issue with software", "software issue",
//                      "not launching", "not opening", "slow application"]
//         }
//       ]
//     }
//   ];
// }

// // ─── DB 2: EMPLOYEE DATABASE ─────────────────────────────────

// function getEmployeeDB() {
//   return [
//     { fullName: "Arjun Mehta",     employeeId: "EMP001", email: "arjun.mehta@avaamo.com",     department: "Engineering" },
//     { fullName: "Priya Sharma",    employeeId: "EMP002", email: "priya.sharma@avaamo.com",     department: "Marketing" },
//     { fullName: "Ravi Kumar",      employeeId: "EMP003", email: "ravi.kumar@avaamo.com",       department: "Finance" },
//     { fullName: "Sneha Iyer",      employeeId: "EMP004", email: "sneha.iyer@avaamo.com",       department: "HR" },
//     { fullName: "Vikram Nair",     employeeId: "EMP005", email: "vikram.nair@avaamo.com",      department: "Sales" },
//     { fullName: "Ananya Reddy",    employeeId: "EMP006", email: "ananya.reddy@avaamo.com",     department: "Engineering" },
//     { fullName: "Rohit Bansal",    employeeId: "EMP007", email: "rohit.bansal@avaamo.com",     department: "Operations" },
//     { fullName: "Deepa Thomas",    employeeId: "EMP008", email: "deepa.thomas@avaamo.com",     department: "Legal" },
//     { fullName: "Karan Singh",     employeeId: "EMP009", email: "karan.singh@avaamo.com",      department: "IT" },
//     { fullName: "Meera Pillai",    employeeId: "EMP010", email: "meera.pillai@avaamo.com",     department: "Customer Success" },
//     { fullName: "Aditya Joshi",    employeeId: "EMP011", email: "aditya.joshi@avaamo.com",     department: "Engineering" },
//     { fullName: "Pooja Desai",     employeeId: "EMP012", email: "pooja.desai@avaamo.com",      department: "Design" },
//     { fullName: "Siddharth Rao",   employeeId: "EMP013", email: "siddharth.rao@avaamo.com",    department: "Product" },
//     { fullName: "Nisha Kapoor",    employeeId: "EMP014", email: "nisha.kapoor@avaamo.com",     department: "Finance" },
//     { fullName: "Tarun Verma",     employeeId: "EMP015", email: "tarun.verma@avaamo.com",      department: "Engineering" }
//   ];
// }

// // ─── HELPER: Auto-classify a description ─────────────────────

// function classifyDescription(description) {
//   if (!description) return null;

//   var text = description.toLowerCase();
//   var db = getCategoryDB();
  
//   // =======================================
// // CHECK DYNAMICALLY LEARNED MAPPINGS
// // =======================================

// var learnedMappings =
//   await (Storage.global.get("dynamic_category_mappings")) || [];

// for (var i = 0; i < learnedMappings.length; i++) {

//   var map = learnedMappings[i];

//   if (
//     text.toLowerCase().indexOf(map.sample_text) !== -1
//   ) {

//     return {
//       category: map.category,
//       subcategory: map.subcategory
//     };
//   }
// }

// // =======================================
// // END DYNAMIC CHECK
// // =======================================
  
//   var bestMatch = null;
//   var bestScore = 0;

//   for (var c = 0; c < db.length; c++) {
//     var cat = db[c];
//     for (var s = 0; s < cat.subcategories.length; s++) {
//       var sub = cat.subcategories[s];
//       var score = 0;
//       for (var k = 0; k < sub.keywords.length; k++) {
//         if (text.indexOf(sub.keywords[k]) !== -1) {
//           score += sub.keywords[k].split(' ').length;
//         }
//       }
//       if (score > bestScore) {
//         bestScore = score;
//         bestMatch = { category: cat.category, subcategory: sub.name };
//       }
//     }
//   }

//   return bestScore > 0 ? bestMatch : null;
// }

// // ─── HELPER: Lookup employee by name / ID / email ─────────────

// function lookupEmployee(name, employeeId, email) {
//   var db = getEmployeeDB();
//   for (var i = 0; i < db.length; i++) {
//     var emp = db[i];
//     var nameMatch  = name       && emp.fullName.toLowerCase().indexOf(name.toLowerCase()) !== -1;
//     var idMatch    = employeeId && emp.employeeId.toLowerCase() === employeeId.toLowerCase();
//     var emailMatch = email      && emp.email.toLowerCase() === email.toLowerCase();
//     if (nameMatch || idMatch || emailMatch) return emp;
//   }
//   return null;
// }

// // ─── HELPER: Validate logged-in user against employee DB ──────
// // Used during authentication at conversation start.
// // Matches on employeeId + email together for stronger verification.

// function verifyLoginEmployee(employeeId, email) {
//   var db = getEmployeeDB();
//   for (var i = 0; i < db.length; i++) {
//     var emp = db[i];
//     var idMatch    = employeeId && emp.employeeId.toLowerCase() === employeeId.toLowerCase();
//     var emailMatch = email      && emp.email.toLowerCase() === email.toLowerCase();
//     if (idMatch && emailMatch) return emp;
//   }
//   return null;
// }

// // ─── HELPER: Generate a unique ticket ID ─────────────────────

// function generateTicketId() {
//   var digits = '';
//   for (var i = 0; i < 8; i++) {
//     digits += Math.floor(Math.random() * 10).toString();
//   }
//   return 'HRC' + digits;
// }

// function searchEmployees(context) {

//   var query = (
//     context.query || ""
//   ).toLowerCase();

//   var employees = getEmployeeDB();

//   var matches = employees.filter(function(emp) {

//     return (
//       emp.fullName.toLowerCase().indexOf(query) !== -1 ||
//       emp.email.toLowerCase().indexOf(query) !== -1
//     );
//   });

//   if (matches.length === 0) {

//     return {
//       success: false,
//       avm_instruction:
//         "No employee found. Ask user to manually provide Name, Employee ID, and Email."
//     };
//   }

//   return {
//     success: true,

//     messages: [
//       {
//         text:
//           "I found matching employees. Please select one."
//       },

//       {
//         list_view: {
//           top_element_style: "compact",

//           items: matches.map(function(emp) {

//             return {
//               title: emp.fullName,

//               subtitle:
//                 emp.employeeId +
//                 " • " +
//                 emp.email,

//               links: [
//                 {
//                   type: "post_message",

//                   title: "Select",

//                   value:
//                     "selected_employee::" +
//                     emp.fullName +
//                     "::" +
//                     emp.employeeId +
//                     "::" +
//                     emp.email +
//                     "::" +
//                     emp.department
//                 }
//               ]
//             };
//           })
//         }
//       }
//     ]
//   };
// }