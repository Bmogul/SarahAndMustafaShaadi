import { getGoogleSheets } from "../../lib/google-sheets";
import { NextResponse } from "next/server";

export default async function handler(req, res) {
  try {
    const sheets = await getGoogleSheets();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "EmailWhatsapp",
    });

    res.status(200).json(response.data.values);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch data from Google Sheets" });
  }
}

export async function GET() {
  try {
    const sheets = await getGoogleSheets();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "EmailWhatsapp",
    });
    const rawData = response.data.values;
    const parsed = {};
    const keys = [
      "GUID",
      "HOFID",
      "NJscan_id",
      "HOFID-temp",
      "HOF Flag",
      "LastName",
      "relationnameTitle",
      "Fname",
      "HOFEmail",
      "E-mail1",
      "Whatsapp#",
      "GenderSal",
      "Gender",
      "Name",
      "MCnt",
      "Fcnt",
      "MainInvite",
      "ShitabiInvite",
      "WalimoInvite",
      "Mainviteby Num,ber",
      "MainResponse",
      "ShitabiResponse",
      "WalimoResponse",
    ];

    rawData.forEach((row) => {
      const hofId = row[1];

      if (!parsed[hofId]) {
        // If a family object with this HOFID doesn't exist, create a new one
        parsed[hofId] = [];
      }

      const parsedRow = row.reduce((acc, value, index) => {
        acc[keys[index]] = value || undefined;
        return acc;
      }, {});

      parsed[hofId].push(parsedRow);
    });
    console.log("PARSED DATA", parsed);

    return NextResponse.json(parsed);
  } catch (err) {
    console.error(err);
  }

  return NextResponse.json({ message: "HELLO - GET" });
}
