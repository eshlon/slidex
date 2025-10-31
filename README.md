# Slidex - AI-Powered Presentation Generator

<!-- No banner image available -->

Welcome to **Slidex**, an open-source, AI-powered presentation generator! Slidex is a Next.js application that leverages the power of AI to create stunning presentations in minutes. It features a secure authentication system, a credit-based usage model, and detailed presentation history tracking.

<video width="320" height="240" controls>
  <source src="slidex_demo.mp4" type="video/mp4">
</video>

## 🌟 Key Features

- **🤖 AI-Powered Content Generation**: Create compelling presentation content from a simple prompt.
- **🎨 Template Variety**: Choose from a wide range of professionally designed templates.
- **🔒 Secure Authentication**: JWT-based authentication with secure HTTP-only cookies.
- **💳 Credit System**: A flexible credit system for managing presentation generation.
- **📈 History Tracking**: Keep track of all your generated presentations with detailed metadata.
- **💻 Modern Tech Stack**: Built with Next.js, TypeScript, Python, and PostgreSQL.

## 🚀 Getting Started

Follow these steps to get a local copy of Slidex up and running.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Python](https://www.python.org/) (v3.8 or later)

### Installation

1. **Clone the repository:**
   ```bash
   # The repository URL will be available after the project is published.
   git clone https://github.com/placeholder-username/slidex.git
   cd slidex
   ```

2. **Install dependencies:**
   ```bash
   npm install
   pip install -r requirements.txt
   ```

3. **Set up the database:**
   - Create a PostgreSQL database named `slidex`.
   - Run the SQL script to create the necessary tables:
     ```bash
     psql -d slidex -f scripts/001-create-tables.sql
     ```

4. **Configure environment variables:**
   - Copy the example environment file:
     ```bash
     cp .env.example .env.local
     ```
   - Edit `.env.local` with your database credentials, API keys, and other settings.

5. **Run the application:**
   ```bash
   npm run dev
   ```

The application should now be running at [http://localhost:3000](http://localhost:3000).

## 🛠️ Technologies Used

- **Frontend**: [Next.js](https://nextjs.org/), [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/)
- **Backend**: [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction), [Python (FastAPI)](https://fastapi.tiangolo.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Authentication**: [JWT](https://jwt.io/), [bcrypt](https://www.npmjs.com/package/bcrypt)
- **Payments**: [Stripe](https://stripe.com/)
- **AI**: [OpenAI GPT-4](https://openai.com/gpt-4)

## 🤝 Contributing

We welcome contributions from the community! If you'd like to contribute, please read our [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines on how to get started.

## 📜 Code of Conduct

Please review our [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) to understand our community standards and expectations.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- All the amazing open-source libraries we use!

