import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Story from "@/components/Story";
import Beliefs from "@/components/Beliefs";
import Projects from "@/components/Projects";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";

export default function Home() {
  return (
    <main className="relative">
      <Nav />
      <Hero />
      <Story />
      <Beliefs />
      <Projects />
      <Footer />
      <ChatBot />
    </main>
  );
}
