import { NextResponse } from 'next/server';
import puppeteer, { Protocol } from 'puppeteer';

let browser: any | null = null;
const sessions: Record<string, Protocol.Network.Cookie[]> = {};

async function getBrowserInstance() {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }
  return browser;
}

export async function POST(req: Request) {
  const { email, password, accountId } = await req.json();

  try {
    const browserInstance = await getBrowserInstance();
    const page = await browserInstance.newPage();
    await page.goto('https://www.facebook.com/', { waitUntil: 'networkidle2' });

    // Perform login
    await page.type('#email', email);
    await page.type('#pass', password);
    await Promise.all([page.click('button[name="login"]'), page.waitForNavigation()]);

    // Save cookies for the session
    const cookies = await page.cookies();
    sessions[accountId] = cookies;
    await page.close();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error logging in:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
