import Stripe from 'stripe';
import { supabaseAdmin } from './supabase/admin';
import { addUserCredits } from './auth-actions';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export async function createStripeCheckoutSession(userId: string, credits: number, price: number) {
  try {
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${credits} Slide Credits`,
            },
            unit_amount: price * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?canceled=true`,
      metadata: {
        userId: userId.toString(),
        credits: credits.toString(),
      },
    });

    // Save purchase record in database
    await supabaseAdmin
      .from('purchases')
      .insert({
        user_id: userId,
        credits: credits,
        amount: price,
        status: 'pending',
        stripe_session_id: session.id
      });

    return { success: true, sessionUrl: session.url };
  } catch (error) {
    console.error('Create checkout session error:', error);
    return { success: false, error: 'Failed to create checkout session' };
  }
}

export async function handleStripeWebhookEvent(event: Stripe.Event) {
  try {
    // Handle successful payment
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const credits = parseInt(session.metadata?.credits || '0');

      if (!userId || !credits) {
        throw new Error('Missing metadata in webhook event');
      }

      // Update purchase status
      await supabaseAdmin
        .from('purchases')
        .update({ 
          status: 'completed', 
          completed_at: new Date().toISOString() 
        })
        .eq('stripe_session_id', session.id);

      // Add credits to user account
      await addUserCredits(userId, credits);
    }

    return { success: true };
  } catch (error) {
    console.error('Webhook processing error:', error);
    return { success: false, error: 'Webhook processing failed' };
  }
}
