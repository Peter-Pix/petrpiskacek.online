import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Story from "@/components/Story";
import Beliefs from "@/components/Beliefs";
import Timeline from "@/components/Timeline";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
import JsonLd from "@/components/JsonLd";
import { EchoProvider } from "@/lib/echo-context";

export default function Home() {
  return (
    <EchoProvider>
      <JsonLd />
      <main className="relative">
        <Nav />
        <Hero />
        <Story />
        <Beliefs />
        <Timeline />
        <Projects />
        <Contact />
        <Footer />
        <ChatBot />
      </main>
    </EchoProvider>
  );
}
