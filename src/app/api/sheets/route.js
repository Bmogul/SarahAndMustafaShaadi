import { NextResponse } from "next/server";
import { getGoogleSheets, getAuthClient } from "../../lib/google-sheets";

/*export default async function handler(req, res) {
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
}*/
const getCentralTimeDate = () => {
  const centralTimeZone = 'America/Chicago'; // Central Time Zone
  const now = new Date();
  const offsetMs = now.getTimezoneOffset() * 60 * 1000;
  const centralTimeMs = now.getTime() - offsetMs;
  const centralTime = new Date(centralTimeMs);

  // Get the year, month, and date components
  const year = centralTime.getFullYear();
  const month = String(centralTime.getMonth() + 1).padStart(2, '0');
  const day = String(centralTime.getDate()).padStart(2, '0');

  return `${month}/${day}/${year}`;
};
export async function POST(req) {
  try {
    console.log("posting");
    const { family } = await req.json();

    if (!family || family.length === 0)
      return NextResponse.json(
        { message: "Invalid data format" },
        { status: 400 }
      );

    const sheets = await getGoogleSheets();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "InviteeList",
      valueRenderOption: "UNFORMATTED_VALUE",
    });

    const allValues = response.data.values || [];
    const headerRow = allValues.shift();
    const guidColumnIndex = headerRow.indexOf("GUID");
    const njScanIdColumnIndex = headerRow.indexOf("UID");

    console.log(guidColumnIndex)
    console.log(njScanIdColumnIndex)

    const valuesToUpdate = {};

    for (const member of family) {
      const { GUID, UID } = member;

      if (!GUID || !UID) {
        continue; // Skip members without GUID or UID
      }

      const matchingRows = allValues.filter((row) => {
        if (
          row[guidColumnIndex].toString() === GUID &&
          row[njScanIdColumnIndex].toString() === UID
        ) {
          const rowNumber = allValues.indexOf(row) + 2;
          const cellRange = `InviteeList!R${rowNumber}:U${rowNumber}`;
          const values = [
            parseInt(member.MainResponse),
            parseInt(member.ShitabiResponse),
            parseInt(member.WalimoResponse),
            getCentralTimeDate()
          ];

          console.log(values)

          valuesToUpdate[cellRange] = {
            values: [values],
          };

          return true;
        }
        console.log("NOPE")

        return false;
      });
    }

    if (Object.keys(valuesToUpdate).length > 0) {
      const batchUpdateRequest = {
        data: [],
        valueInputOption: "RAW",
      };

      for (const [range, valueData] of Object.entries(valuesToUpdate)) {
        batchUpdateRequest.data.push({
          range,
          ...valueData,
        });
      }

      const res = await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        resource: batchUpdateRequest,
      });
      console.log(batchUpdateRequest)
    }

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ message: "Fail" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const guid = searchParams.get("guid");

    if (!guid)
      return NextResponse.json({ message: "Missing guid" }, { status: 400 });

    console.log(process.env.GOOGLE_SHEET_ID, '/n/n/n');

    const sheets = await getGoogleSheets();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "InviteeList",
    });

    const rawData = response.data.values;
    const parsed = {};
    const keys = rawData.shift();

    console.log("KEYS", keys, "KEYS");

    rawData.forEach((row) => {
      const hofId = row[0];
      if (!parsed[hofId]) {
        // If a family object with this HOFID doesn't exist, create a new one
        parsed[hofId] = [];
      }

      const parsedRow = row.reduce((acc, value, index) => {
        let key = keys[index];
        if (key === 'MMInvite') {
          key = 'WalimoInvite';
        } else if (key === 'MMResponse') {
          key = 'WalimoResponse';
        }
        acc[key] = value || null;
        return acc;
      }, {});

      parsed[hofId].push(parsedRow);
    });

    //console.log("PARSED DATA", parsed);

    const familyData = parsed[guid] || [];

    familyData.sort((a,b)=>a["HOF Flag"] - b["HOF Flag"])

    console.log("\n\nFamily Data\n\n",familyData);

    return NextResponse.json(familyData);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
