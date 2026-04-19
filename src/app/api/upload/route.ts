import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert the File object to a Node.js Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create a unique filename to prevent collisions
    const fileExt = file.name.split('.').pop() || 'tmp';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${fileExt}`;

    // Upload to Supabase Storage Bucket named "saral-school"
    const { data, error } = await supabase.storage
      .from('saral-school')
      .upload(fileName, buffer, {
        contentType: file.type || 'application/octet-stream',
        upsert: true,
      });

    if (error) {
      throw error;
    }

    // Retrieve the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('saral-school')
      .getPublicUrl(fileName);

    return NextResponse.json({ url: publicUrl });

  } catch (error: any) {
    console.error('Supabase upload error:', error.message || error);
    return NextResponse.json({ error: 'Failed to upload file to Supabase' }, { status: 500 });
  }
}
