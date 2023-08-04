import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import Device from '../../../../models/device';

export async function GET(req: NextRequest) {
  await dbConnect()

  try {
    const id = req.url.split("/").pop();
    const device = await Device.findOne({key: id})
    if (!device) {
      return NextResponse.json({ success: false }, { status: 400 })
    }
    return NextResponse.json({ success: true, data: device }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 })
  }
}

export async function PUT(req: NextRequest) {
  await dbConnect()

  try {
    const body = await req.json()
    const device = await Device.findByIdAndUpdate(body._id, body, {
      new: true,
      runValidators: true,
    })
    if (!device) {
      return NextResponse.json({ success: false }, { status: 400 })
    }
    return NextResponse.json({ success: true, data: device }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ success: false, data: error }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest) {
  await dbConnect()

  try {
    const id = req.url.split("/").pop();
    const deletedDevice = await Device.findByIdAndDelete(id)
    if (!deletedDevice) {
      return NextResponse.json({ success: false, data: deletedDevice }, { status: 400 })
    }
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 })
  }
}