import { useEffect, useRef, useState } from "react";
import {
  useSyncChatSocketQuery,
  chatSocket,
  chatService,
} from "../services/chatService";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { Send } from "lucide-react";
import { toast } from "react-toastify";

export function ChatRoom() {
  useSyncChatSocketQuery();

  return <ChatBox />;
}

function ChatBox() {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: messages } = useSyncChatSocketQuery();
  const isConnected = chatSocket?.readyState === WebSocket.OPEN;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!chatSocket) {
      toast.error("Chat socket not found");
      return;
    }

    if (!input.trim()) return;

    chatSocket.send(input);
    chatService.util.updateQueryData("syncChatSocket", undefined, (draft) => {
      draft.push(input);
    });
    setInput("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-2xl h-[80vh] flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle>Chat Room</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={isConnected ? "success" : "destructive"}>
                {isConnected ? "Connected" : "Disconnected"}
              </Badge>
              <Avatar className="h-8 w-8">
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages?.map((message, i) => (
            <div
              key={message + i}
              className={`flex ${
                message === "John Doe" ? "justify-end" : "justify-start"
              }`}
            >
              <div className="flex flex-col max-w-[70%]">
                <div className="flex items-center gap-2 mb-1">
                  {message !== "John Doe" && (
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                  )}
                </div>
                <div
                  className={`p-3 rounded-lg ${"bg-gray-200 text-gray-800 rounded-tl-none"}`}
                >
                  {message}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </CardContent>
        <CardFooter className="border-t p-4">
          <form onSubmit={onSendMessage} className="flex w-full gap-2">
            <Input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
