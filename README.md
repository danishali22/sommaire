# 📄 Sommaire: AI-Powered PDF Summarizer

**Sommaire** is a modern, full-stack AI-powered application that allows users to upload PDF documents and receive concise, structured summaries in seconds. Built with Next.js 15 (App Router), TypeScript, Tailwind CSS, OpenAI/Gemini, and PostgreSQL, it offers a polished user interface with Clerk authentication and Stripe integration for monetization.

---

## 📁 Project Structure

```
danisali22-sommaire/
├── src/                # Application source code
│   ├── app/            # Next.js app directory (routing, pages, API routes)
│   ├── components/     # Reusable UI and feature components
│   ├── context/        # React contexts (e.g. auth)
│   ├── lib/            # Utilities and integrations (db, auth, AI)
│   ├── models/         # Database models (Prisma-like schema)
│   ├── actions/        # Server-side functions
│   ├── utils/          # Helper functions and prompts
├── schema.sql          # SQL schema used in production
├── scripts/            # Utility scripts (e.g. Neon DB test)
├── public/             # Static assets
├── styles/             # Global styles (Tailwind)
├── tailwind.config.ts  # Tailwind CSS configuration
├── next.config.ts      # Next.js config
├── package.json        # Project dependencies and scripts
```

---

## 🚀 Features

### 🧠 AI Summarization

* Upload PDFs and get summarized text instantly
* Uses OpenAI or Gemini LLMs
* Smart chunking and formatting

### 🧾 PDF Upload and Management

* Upload PDFs using UploadThing
* View, delete, and download summaries

### 🔐 Authentication & User Management

* Login / signup using Clerk
* Secure API routes with JWT/session handling

### 💳 Payments

* Stripe integration for paid tiers
* Upgrade prompt for locked features

### 🎨 UI/UX

* Fully responsive design
* Tailwind CSS + ShadCN UI components
* Skeletons and loading states
* Interactive dashboard and upload experience

---

## 💠 Tech Stack

### **Frontend**

* Next.js 14 (App Router, Server Actions)
* TypeScript
* Tailwind CSS
* ShadCN/UI
* Clerk Auth

### **Backend**

* Node.js (via Next.js API routes)
* PostgreSQL (NeonDB or other)
* Stripe for payments
* OpenAI / Gemini for AI completions

---

## 🧪 Running Locally

### 1. Clone the repo

```bash
git clone https://github.com/danishali22/sommaire.git
cd sommaire
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file with:

```
OPENAI_API_KEY=your_openai_key
CLERK_SECRET_KEY=your_clerk_secret
CLERK_PUBLISHABLE_KEY=your_clerk_key
STRIPE_SECRET_KEY=your_stripe_secret
DATABASE_URL=your_neon_db_url
UPLOADTHING_SECRET=your_uploadthing_secret
```

### 4. Run the development server

```bash
npm run dev
```

---

## 🧠 Prompt Engineering

Sommaire uses carefully designed prompt templates stored in `src/utils/prompt.ts` to extract and format the most important information from long academic, professional, or legal documents.

---

## 🧾 Tags

```
pdf-summarizer, nextjs, typescript, tailwindcss, openai, gemini, ai, llm, clerk-auth, stripe-payments, uploadthing, saas, pdf-upload, summary, dashboard, neon, vercel
```

---

## 👤 Author

Built with ❤️ by [Danish Ali](https://github.com/danishali22)

---

## 🙌 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you’d like to change.

---
