"use client";

import { Box, Button, Stack, TextField } from "@mui/material";
import { useState, useEffect, useRef } from "react";

export default function Home() {
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content:
                "Hi! I'm the Headstarter support assistant. How can I help you today?",
        },
    ]);
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const sendMessage = async () => {
        // Waiting for backend Implementation
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    };

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <Box
            width="100vw"
            height="94vh"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
        >
            <Stack
                direction={"column"}
                width="500px"
                height="700px"
                border="2px solid black"
                borderRadius={4}
                p={2}
                spacing={3}
                bgcolor="white"
            >
                <Stack
                    direction={"column"}
                    spacing={2}
                    flexGrow={1}
                    overflow="auto"
                    maxHeight="100%"
                >
                    {messages.map((message, index) => (
                        <Box
                            key={index}
                            display="flex"
                            justifyContent={
                                message.role === "assistant"
                                    ? "flex-start"
                                    : "flex-end"
                            }
                        >
                            <Box
                                bgcolor={
                                    message.role === "assistant"
                                        ? "primary.main"
                                        : "secondary.main"
                                }
                                color="white"
                                borderRadius={16}
                                p={3}
                            >
                                {message.content}
                            </Box>
                        </Box>
                    ))}
                    <div ref={messagesEndRef} />
                </Stack>
                <Stack direction={"row"} spacing={2}>
                    <TextField
                        label="Message"
                        fullWidth
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading}
                    />
                    <Button
                        variant="contained"
                        onClick={sendMessage}
                        disabled={isLoading}
                    >
                        {isLoading ? "Sending..." : "Send"}
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
}
