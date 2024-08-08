"use client";

import { Box, Button, Stack, TextField, createTheme, ThemeProvider } from "@mui/material";
import { useState, useEffect, useRef } from "react";

const theme = createTheme({
    palette: {
        primary: {
            main: "#1e1e1e", // Dark background for primary elements
        },
        secondary: {
            main: "#2979ff", // Blue text
        },
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    backgroundColor: "#2c2c2c", // Dark background for text fields
                    borderRadius: '8px', // Border radius for the text field
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    color: "white", // White text color
                },
                input: {
                    '&::placeholder': {
                        color: 'white',
                    },
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'white', // White outline color
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'white', // White outline color on hover
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'white', // White outline color when focused
                    },
                },
            },
        },
    },
    typography: {
        allVariants: {
            color: "#2979ff", // Blue text
        },
    },
});

export default function Home() {
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: "Hi! I'm SaqifMe support assistant. How can I help you today?",
        },
    ]);
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const sendMessage = async () => {
        if (!message.trim()) return;

        setIsLoading(true);
        setMessage("");
        setMessages((messages) => [
            ...messages,
            { role: "user", content: message },
            { role: 'assistant', content: '' },
        ]);

        try {
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

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const text = decoder.decode(value || new Uint8Array(), { stream: true });
                setMessages((messages) => {
                    let lastMessage = messages[messages.length - 1];
                    let otherMessages = messages.slice(0, messages.length - 1);
                    return [
                        ...otherMessages,
                        { ...lastMessage, content: lastMessage.content + text },
                    ];
                });
            }
        } catch (error) {
            console.error("Error:", error);
            setMessages((messages) => [
                ...messages,
                {
                    role: "assistant",
                    content: "I'm sorry, but Saqif hasn't setup the backend yet. Please try again later.",
                },
            ]);
        } finally {
            setIsLoading(false);
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
        <ThemeProvider theme={theme}>
            <Box
                width="100vw"
                height="94vh"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                style={{
                    backgroundImage: 'url("/gradient-blue-abstract-background-smooth-dark-blue-with-black-vignette-studio.jpg")',
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <Stack
                    direction={"column"}
                    width="500px"
                    height="700px"
                    border="2px solid black"
                    borderRadius={4}
                    p={2}
                    spacing={3}
                    bgcolor="primary.main" // Use primary.main for dark background
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
                                            ? "primary.dark"
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
                            InputLabelProps={{
                                style: { color: 'white' }, // White label color
                            }}
                        />
                        <Button
                            variant="contained"
                            onClick={sendMessage}
                            disabled={isLoading}
                            color="secondary" // Use secondary color for button
                        >
                            {isLoading ? "Sending..." : "Send"}
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </ThemeProvider>
    );
}
