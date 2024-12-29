import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

// Define the sessions object to store session data
const sessions: { [key: string]: any } = {};

export async function POST(req: Request) {
  const { accountId } = await req.json();

  // Retrieve the session for the given accountId
  const session = sessions[accountId];
  if (!session) {
    return NextResponse.json({ success: false, message: 'Session not found' }, { status: 404 });
  }

  try {
    // Launch a headless browser instance
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    // Open a new page in the browser
    const page = await browser.newPage();

    // Set cookies from the session (assuming session contains cookies)
    await page.setCookie(...session);

    // Navigate to a website (e.g., Facebook)
    await page.goto('https://www.facebook.com/');

    // Close the browser after completing the task
    await browser.close();

    // Return a success response
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
      } else {
        return NextResponse.json({ success: false, message: 'An unknown error occurred' }, { status: 500 });
      }
    }      
}
