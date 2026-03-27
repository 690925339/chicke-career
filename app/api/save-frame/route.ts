import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  const { dataUrl, filename } = await req.json();
  const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
  const filePath = path.join(process.cwd(), 'public/images/characters', filename);
  
  fs.writeFileSync(filePath, base64Data, 'base64');
  console.log(`Saved ${filename} to ${filePath}`);
  
  return NextResponse.json({ success: true });
}
