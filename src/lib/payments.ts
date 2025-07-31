"use server"

import Stripe from 'stripe';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';
import { Payment } from '@/models/Payment';

export const handleCheckoutSessionCompleted = async ({
    session,
    stripe,
}: {
    session: Stripe.Checkout.Session;
    stripe: Stripe;
}) => {
    await connectToDatabase();

    const customerId = session.customer as string;
    const customer = await stripe.customers.retrieve(customerId);
    const priceId = session.metadata?.price_id ?? session?.line_items?.data?.[0]?.price?.id;

    if ('email' in customer && priceId) {
        const email = customer.email as string;
        const fullName = (customer.name || '') as string;

        await createOrUpdateUser({
            email,
            fullName,
            customerId,
            priceId,
            status: 'active',
        });

        await createPayment({
            session,
            priceId,
            userEmail: email,
        });
    }
};

const createOrUpdateUser = async ({
    email,
    fullName,
    customerId,
    priceId,
    status,
}: {
    email: string;
    fullName: string;
    customerId: string;
    priceId: string;
    status: string;
}) => {
    try {
        await connectToDatabase();
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            await User.create({
                email,
                fullName,
                customerId,
                priceId,
                status,
            });

            console.log('✅ Customer created');
        } else {
            await User.updateOne(
                { email },
                {
                    $set: {
                        fullName,
                        customerId,
                        priceId,
                        status,
                        updatedAt: new Date(),
                    },
                }
            );

            console.log('✅ Existing user updated');
        }
    } catch (error) {
        console.error('❌ Error creating or updating user', error);
    }
};

const createPayment = async ({
    session,
    priceId,
    userEmail,
}: {
    session: Stripe.Checkout.Session;
    priceId: string;
    userEmail: string;
}) => {
    try {
        await connectToDatabase();
        const { amount_total, id, status } = session;

        await Payment.create({
            amount: amount_total,
            status,
            stripePaymentId: id,
            priceId,
            userEmail,
        });

        console.log('✅ Payment added successfully');
    } catch (error) {
        console.error('❌ Error creating payment', error);
    }
};

export const handleSubscriptionDeleted = async ({
    subscriptionId,
    stripe,
}: {
    subscriptionId: string;
    stripe: Stripe;
}) => {
    await connectToDatabase();
    try {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);

        await User.updateOne(
            { customerId: subscription.customer },
            { $set: { status: 'cancelled' } }
        );

        console.log('✅ Subscription cancelled successfully');
    } catch (error) {
        console.error('❌ Error handling subscription deletion', error);
        throw error;
    }
};
