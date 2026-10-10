# Who Be This? Waitlist website

## What's included
- `index.html` — responsive landing page and signup form.
- `google-apps-script.gs` — Google Apps Script endpoint that saves signups into Google Sheets and avoids duplicate email addresses.

## Connect it to Google Sheets
1. Create a Google Sheet (e.g. `Who Be This Waitlist`).
2. Copy the Sheet ID from the URL. In `https://docs.google.com/spreadsheets/d/THIS_PART_IS_THE_ID/edit`, copy `THIS_PART_IS_THE_ID`.
3. In the Sheet, click **Extensions → Apps Script**.
4. Paste the contents of `google-apps-script.gs` into the editor.
5. Replace `PASTE_YOUR_GOOGLE_SHEET_ID_HERE` with your Sheet ID and save.
6. Click **Deploy → New deployment → Web app**.
7. Set **Execute as: Me** and **Who has access: Anyone**, then deploy and approve the requested permissions.
8. Copy the Web app URL ending in `/exec`.
9. In `index.html`, replace `PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE` with the Web app URL.
10. Deploy `index.html` as a static site on Vercel, Netlify, or another static host.

## Test before promotion
Submit a test signup and check that a row appears in your Sheet. Test a repeated email address as well. Keep the Sheet private.

## Technical note
The page uses a `no-cors` request because Apps Script web-app responses can hit browser CORS/redirect limitations from a static frontend. The browser cannot read the response, so a successful fetch does **not** prove the row was saved. Verify the row in Sheets before announcing the list publicly. For confirmed success/error feedback in production, use a server-side proxy (such as a Vercel serverless function) or a form integration with proper CORS support.

## Privacy
Only collect details you need, state that you will use them for launch updates, and do not publish the spreadsheet or share its responses publicly.
