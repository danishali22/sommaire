import { isDev } from "@/lib/helpers";

export const pricingPlans = [
  {
    id: "basic",
    name: "Basic",
    price: 9,
    description: "Perfect For occasional use",
    items: [
      "3 PDF summaries per month",
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

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    }
  }
}

export const itemsVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    transition: {
      type: 'spring',
      damping: 15,
      stifness: 50,
      duration: 0.8,
    }
  }
}