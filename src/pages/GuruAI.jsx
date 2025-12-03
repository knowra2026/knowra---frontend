import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Navigation } from "@/components/Navigation";
import AuthPrompt from "@/components/AuthPrompt";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, User } from "lucide-react";

const GuruAI = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm Guru.AI, your academic assistant. Ask me anything about your subjects, exams, or concepts you'd like to understand better.",
    },
  ]);
  const [input, setInput] = useState("");
  const [authPromptOpen, setAuthPromptOpen] = useState(false);
  const [authPromptTimer, setAuthPromptTimer] = useState(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    if (!user) {
      setAuthPromptOpen(true);
      return;
    }
    setInput(e.target.value);
  };

  const handleSend = () => {
    if (!user) {
      setAuthPromptOpen(true);
      return;
    }

    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        role: "assistant",
        content:
          "I understand your question. This is a demo response. In the full version, I'll provide detailed explanations and help with your academic queries.",
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const handleAuthPromptChange = (open) => {
    setAuthPromptOpen(open);
    
    if (authPromptTimer) {
      clearTimeout(authPromptTimer);
      setAuthPromptTimer(null);
    }

    if (!open && !user) {
      const timer = setTimeout(() => {
        setAuthPromptOpen(true);
      }, 3000);
      setAuthPromptTimer(timer);
    }
  };

  useEffect(() => {
    // Show popup after 2 seconds on page load if user is not logged in
    if (!user) {
      const initialTimer = setTimeout(() => {
        setAuthPromptOpen(true);
      }, 2000);
      
      return () => clearTimeout(initialTimer);
    }
  }, [user]);

  useEffect(() => {
    return () => {
      if (authPromptTimer) {
        clearTimeout(authPromptTimer);
      }
    };
  }, [authPromptTimer]);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navigation />
      <AuthPrompt open={authPromptOpen} onOpenChange={handleAuthPromptChange} />

      <main className="container mx-auto px-6 pt-10 md:pt-32 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Guru.AI</h1>
            <p className="text-muted-foreground text-lg">Your 24/7 AI-powered academic assistant</p>
          </div>

          {/* Chat Container */}
          <Card className="h-[60vh] md:h-[65vh] flex flex-col">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-5 w-5 text-sky-500" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === "user" ? "bg-sky-500 text-white" : "bg-accent"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                  {message.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="border-t border-border p-4">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask me anything about your subjects..."
                  className="flex-1"
                  disabled={!user}
                />
                <Button 
                  onClick={handleSend} 
                  className="bg-sky-500 hover:bg-sky-600 text-white"
                  disabled={!user}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Suggested Questions */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="justify-start text-left h-auto py-3"
              onClick={() => setInput("Explain the difference between stack and queue")}
            >
              Explain the difference between stack and queue
            </Button>
            <Button
              variant="outline"
              className="justify-start text-left h-auto py-3"
              onClick={() => setInput("What is Big O notation?")}
            >
              What is Big O notation?
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GuruAI;
