import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import Device from '../../../models/device';

export async function GET() {
  await dbConnect();

  try {
    const devices = await Device.find({})
    return NextResponse.json({success: true, data: devices }, {status: 200})
  } catch (error) {
    return NextResponse.json({success: false, data: error }, {status: 500})
  }   
}

export async function POST(req: NextRequest) {
  await dbConnect()
  try {
    
    const body = await req.json()
    
    const device = await Device.create(
      body
    )

    return NextResponse.json({success: true, data: device })
  } catch (error) {
    return NextResponse.json({success: false, data: error }, {status: 500})
  }  
}