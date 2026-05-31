import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, type, date, time, location, description, host_name } = body;

    if (!title || !type || !date || !time || !location || !host_name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const id = nanoid(10); // short unique ID for the URL

    const { data, error } = await supabase
      .from("events")
      .insert([{ id, title, type, date, time, location, description, host_name }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
