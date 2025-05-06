import { Link } from "react-router-dom";
import Button from "../components/button";
import { Logo } from "../components/logo";
import { PiggyBank, Goal, School } from "lucide-react";

const features = [
  {
    icon: <PiggyBank className="h-6 w-6" />,
    title: "Allowance Management",
    description: "Set up recurring allowances and track spending habits",
  },
  {
    icon: <Goal className="h-6 w-6" />,
    title: "Savings Goals",
    description: "Help children set and track progress towards financial goals",
  },
  {
    icon: <School className="h-6 w-6" />,
    title: "Financial Education",
    description: "Age-appropriate lessons on money management",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-black">
      {/* Navbar */}
      <header className="h-16 border-b px-4 flex items-center justify-between animate-fade-in">
        <Logo />
        <nav className="flex items-center gap-4">
          <Link to="/login/parent">
            <Button variant="ghost">Parent Login</Button>
          </Link>
          <Link to="/login/child">
            <Button variant="ghost">Child Login</Button>
          </Link>
          <Link to="/register/parent">
            <Button>Get Started</Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex justify-center items-center animate-fade-in">
        <section className="py-20 md:py-32 text-center space-y-6 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Financial Education for the Next Generation
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl text-lg">
            Piggy AI helps parents teach children financial responsibility through interactive tools and real-world practice.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register/parent">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link to="/login/parent">
              <Button size="lg" variant="outline">
                Sign In
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Features Section */}
      <section className="bg-gray-50 dark:bg-gray-900 py-20 animate-fade-in">
        <div className="container mx-auto px-4 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold">Features</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
              Everything you need to teach financial literacy to your children
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400 gap-4">
          <p>&copy; {new Date().getFullYear()} Piggy AI. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="#" className="hover:underline">Terms</Link>
            <Link to="#" className="hover:underline">Privacy</Link>
            <Link to="#" className="hover:underline">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="rounded-xl border p-6 shadow-sm text-center bg-white dark:bg-black hover:scale-105 transition-transform duration-300 ease-in-out animate-fade-in">
      <div className="flex justify-center items-center h-12 w-12 mx-auto mb-4 rounded-full bg-primary text-white">
        {icon}
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
    </div>
  );
}
