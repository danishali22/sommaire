import { isDev } from "@/lib/helpers";

export const pricingPlans = [
  {
    id: "basic",
    name: "Basic",
    price: 9,
    description: "Perfect For occasional use",
    items: [
      "5 PDF summaries per month",
      "Standard processing speed",
      "Email support",
    ],
    paymentLink: isDev
      ? "https://buy.stripe.com/test_8x25kD1tu4It5zA1El9ws00"
      : "",
    priceId: isDev ? "price_1RU5DUFbtW8TLJbVxQq2UkWG" : "",
  },
  {
    id: "pro",
    name: "Pro",
    price: 19,
    description: "For professional and teams",
    items: [
      "Unlimited PDF summaries",
      "Priority processing",
      "24/7 priority support",
      "Markdown Export",
    ],
    paymentLink: isDev
      ? "https://buy.stripe.com/test_bJe9ATeggcaV3rsciZ9ws01"
      : "",
    priceId: isDev ? "price_1RU5GDFbtW8TLJbVICCKcZVl" : "",
  },
];