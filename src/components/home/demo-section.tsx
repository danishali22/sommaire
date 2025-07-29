import { Pizza } from "lucide-react";
import React from "react";
import { MotionDiv, MotionH3 } from "../common/motion-wrapper";
import SummaryViewer from "../summaries/summary-viewer";

const DEMO_SUMMARY = `
# 🚀 Next.js 15: The Future of Web Development

• 💡 Next.js 15 introduces a powerful developer experience with enhanced performance, dynamic routing, and full-stack capabilities
• 🔑 It's a game-changer for building modern, scalable React applications with server-first thinking

# Document Details

• 📄 Type: Framework Release Overview
• 🎯 For: Web Developers, Full‑Stack Engineers, Product Teams

# Key Highlights

• 🌟 Full support for Server Actions using the App Router
• ⭐️ Enhanced performance with Partial Prerendering and improved caching
• ✨ Built-in file-based metadata routing and new '<Loading />' improvements

# Why It Matters

• ❤️ Next.js 15 empowers developers to create faster, more responsive apps with less boilerplate and more control over the server-client boundary—perfect for scalable, user-friendly products.

# Main Points

• 📊 App Router is now fully stable, enabling nested layouts and React Server Components by default
• 🚀 Streaming and Partial Prerendering allow near‑instant page loads with seamless hydration
• 🏆 Enhanced caching, metadata APIs, and dev tools make building production‑grade apps faster and smarter

# Pro Tips

• 📝 Use 'app\' directory and 'server actions' to simplify API logic and reduce client bundle size
• 🔍 Pair 'loading.js' and 'error.js' with route segments to optimize UX and error recovery
• 🎯 Use Partial Prerendering for dynamic yet performant landing pages and dashboards

# Key Terms to Know

• 🔑 App Router: New file-based routing system using layouts, templates, and segments
• 📌 Server Actions: Run backend logic from the frontend using asynchronous server functions

# Bottom Line

• 🎯 Next.js 15 is a major leap forward in web development—combining the power of React Server Components with an intuitive full-stack architecture

`;

const DemoSection = () => {
  return (
    <section>
      <div className="py-12 lg:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 lg:pt-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 bg-linear-to-br from-emerald-500 via-teal-500 to-cyan-500 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1% 80.7% 2%, 72.5% 32.5%, 60.24% 62.24% 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-gray-100/80 backdrop-blur-xs border border-gray-500/20 mb-4">
            <Pizza className="h-6 w-6 text-rose-500" />
          </div>
          <div className="text-center mb-16">
            <MotionH3
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="font-bold text-3xl max-w-2xl mx-auto px-4 sm:px-6"
            >
              Watch how Sommaire transforms{" "}
              <span className="bg-linear-to-r from-rose-500 to-rose-700 bg-clip-text text-transparent">
                this Next.js course PDF{" "}
              </span>{" "}
              into an easy-to-read summary!
            </MotionH3>
          </div>
        </div>
        <MotionDiv
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center items-center px-2 sm:px-4 lg:px-6"
        >
          <SummaryViewer summary={DEMO_SUMMARY} />
        </MotionDiv>
      </div>
    </section>
  );
};

export default DemoSection;
