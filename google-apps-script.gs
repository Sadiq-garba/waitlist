/** Who Be This? waitlist endpoint for Google Sheets.
 * Setup: create a Sheet, open Extensions > Apps Script, paste this code,
 * set SPREADSHEET_ID, then Deploy > New deployment > Web app.
 * Execute as: Me. Access: Anyone. Copy the /exec URL into index.html.
 */
const SPREADSHEET_ID = "PASTE_YOUR_GOOGLE_SHEET_ID_HERE";
const SHEET_NAME = "Waitlist";

function doPost(e) {
  try {
    const raw = e && e.postData && e.postData.contents;
    if (!raw) return respond({ ok: false, error: "Missing request body" });
    const data = JSON.parse(raw);
    const name = String(data.name || "").trim().slice(0, 100);
    const email = String(data.email || "").trim().toLowerCase().slice(0, 200);
    const whatsapp = String(data.whatsapp || "").trim().slice(0, 30);
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return respond({ ok: false, error: "Valid name and email required" });

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Joined At", "Name", "Email", "WhatsApp"]);
      sheet.setFrozenRows(1);
    }

    // Lock writes to reduce duplicate/race-condition issues during simultaneous signups.
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const last = sheet.getLastRow();
      if (last >= 2) {
        const existing = sheet.getRange(2, 3, last - 1, 1).getDisplayValues().flat();
        if (existing.some(v => v.trim().toLowerCase() === email)) return respond({ ok: true, duplicate: true });
      }
      sheet.appendRow([new Date(), safeCell(name), safeCell(email), safeCell(whatsapp)]);
    } finally { lock.releaseLock(); }
    return respond({ ok: true });
  } catch (err) { return respond({ ok: false, error: String(err) }); }
}
function doGet() { return respond({ ok: true, service: "Who Be This? waitlist endpoint" }); }
function safeCell(value) { const s = String(value || ""); return /^[=+\-@]/.test(s) ? "'" + s : s; }
function respond(payload) { return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON); }
