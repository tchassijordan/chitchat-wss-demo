import type { Route } from "./+types/home";
import { ChatRoom } from "../chat-room/chat-room";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <ChatRoom />;
}
