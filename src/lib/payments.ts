import Stripe from "stripe";
import { getDBConnection } from "./db";

export const handleCheckoutSessionCompleted = async ({ session, stripe }: { session: Stripe.Checkout.Session, stripe: Stripe }) => {
    const customerId = session.customer as string;
    const customer = await stripe.customers.retrieve(customerId);
    const priceId = session.line_items?.data[0]?.price?.id;

    if ('email' in customer && priceId) {
        const { email, name } = customer;

        const sql = await getDBConnection();

        await createOrUpdateUser({
            sql,
            email: email as string,
            fullName: name!,
            customerId,
            priceId,
            status: 'active'
        })

        await createPayment({
            sql,
            session,
            priceId: priceId as string,
            userEmail: email as string,
        })
    }
}

const createOrUpdateUser = async ({ sql, email, fullName, customerId, priceId, status }: { sql: any, email: string, fullName: string, customerId: string, priceId: string, status: string }) => {
    try {
        const user = await sql`SELECT * FROM users WHERE email = ${email}`;
        if (user.length === 0) {
            await sql`INSERT INTO users (email, full_name, customer_id, price_id, status) VALUES (${email}, ${fullName}, ${customerId}, ${priceId}, ${status} )`
            console.log('Customer added successfully');
        }
    } catch (error) {
        console.log('Error creating or updating user', error);
    }
}

const createPayment = async ({ sql, session, priceId, userEmail }: { sql: any, session: Stripe.Checkout.Session, priceId: string, userEmail: string }) => {
    try {
        const { amount_total, id, status } = session;

        await sql`INSERT INTO payments (amount, status, stripe_payment_id, price_id, user_email) VALUES (${amount_total}, ${status}, ${id}, ${priceId}, ${userEmail} )`

        console.log('Payment added successfully');
    } catch (error) {
        console.log('Error creating payment', error);
    }
}

export const handleSubscriptionDeleted = async ({ subscriptionId, stripe }: { subscriptionId: string, stripe: Stripe }) => {
    console.log("Subscripiotn deleted", subscriptionId);
    try {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);

        const sql = await getDBConnection();
        await sql`UPDATE users SET status = 'cancelled' WHERE customer_id = ${subscription.customer}`
        console.log('Subscription cancelled successfully');
    } catch (error) {
        console.log('Error handling subscription deleted', error);
        throw error;
    }
}