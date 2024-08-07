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
        if (!message.trim()) return; // Don't send empty messages

        setMessage(""); // Clear the input field
        setMessages((messages) => [
            ...messages,
            { role: "user", content: message }, // Add the user's message to the chat
            { role: "assistant", content: "" }, // Add a placeholder for the assistant's response
        ]);

        try {
            // Send the message to the server
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify([
                    ...messages,
                    { role: "user", content: message },
                ]),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const reader = response.body.getReader(); // Get a reader to read the response body
            const decoder = new TextDecoder(); // Create a decoder to decode the response text

            let result = "";
            // Function to process the text from the response
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const text = decoder.decode(value || new Uint8Array(), {
                    stream: true,
                }); // Decode the text
                setMessages((messages) => {
                    let lastMessage = messages[messages.length - 1]; // Get the last message (assistant's placeholder)
                    let otherMessages = messages.slice(0, messages.length - 1); // Get all other messages
                    return [
                        ...otherMessages,
                        { ...lastMessage, content: lastMessage.content + text }, // Append the decoded text to the assistant's message
                    ];
                });
            }
        } catch (error) {
            console.error("Error:", error);
            setMessages((messages) => [
                ...messages,
                {
                    role: "assistant",
                    content:
                        "I'm sorry, but I encountered an error. Please try again later.",
                },
            ]);
        }
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
