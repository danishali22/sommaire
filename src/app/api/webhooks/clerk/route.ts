import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET || '';

export async function POST(req: NextRequest) {
    const payload = await req.text();
    const headerPayload = req.headers;

    const svixId = headerPayload.get('svix-id') as string;
    const svixTimestamp = headerPayload.get('svix-timestamp') as string;
    const svixSignature = headerPayload.get('svix-signature') as string;

    const svix = new Webhook(WEBHOOK_SECRET);
    let evt: any;

    try {
        evt = svix.verify(payload, {
            'svix-id': svixId,
            'svix-timestamp': svixTimestamp,
            'svix-signature': svixSignature,
        });
    } catch (err) {
        console.error('❌ Webhook verification failed:', err);
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, email_addresses, full_name, image_url } = evt.data;
    const email = email_addresses?.[0]?.email_address;

    if (!email) {
        return NextResponse.json({ error: 'Missing email' }, { status: 400 });
    }

    await connectToDatabase();

    const existingUser = await User.findOne({
        $or: [{ clerkUserId: id }, { email }],
    });

    if (existingUser) {
        existingUser.clerkUserId = id;
        existingUser.fullName = full_name || existingUser.fullName;
        existingUser.imageUrl = image_url || existingUser.imageUrl;
        existingUser.app = 'clerk';
        await existingUser.save();
    } else {
        await User.create({
            clerkUserId: id,
            email,
            fullName: full_name || '',
            imageUrl: image_url || '',
            customerId: '',
            priceId: '',
            app: 'clerk',
            status: 'active',
        });
    }

    return NextResponse.json({ success: true });
}
