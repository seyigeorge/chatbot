// FAQs stored in a simple object
const faqs = {
    "What are your shipping options?": "We offer standard and expedited shipping options. Check our shipping page for more details.",
    "How can I track my order?": "You can track your order by logging into your account and visiting the 'Order History' section.",
    "Do you offer international shipping?": "Yes, we ship to most countries worldwide. Check our shipping page for more details.",
    "How can I return an item?": "You can return items within 30 days of receipt. Please visit our Returns & Exchanges page for more information.",
    "What payment methods do you accept?": "We accept Visa, MasterCard, PayPal, and other major payment methods.",
    "What is the delivery time for orders?": "Delivery time depends on your location. Typically, orders are delivered within 3-7 business days.",
    "Do you offer gift wrapping services?": "Yes, we offer gift wrapping services for most items. You can select this option during checkout.",
    "How can I cancel my order?": "Orders can be canceled within 24 hours of purchase. Please visit our 'Order Cancellation' page for more details.",
    "Can I change my shipping address after placing an order?": "If your order hasn’t been shipped yet, you can update the shipping address. Contact customer support immediately.",
    "What is your return policy?": "Our return policy allows returns within 30 days of purchase. Items must be unused and in original packaging.",
    "Can i speak with an agent?": "Yes, i will patch you in now with one of our agents",
};

async function sendMessage() {
    const userInput = document.getElementById("user-input").value;
    const chatBox = document.getElementById("chat-box");

    if (userInput.trim() !== "") {
        // Display user message
        const userMessage = document.createElement("div");
        userMessage.classList.add("message", "bg-indigo-100", "text-indigo-900", "p-3", "rounded-lg");
        userMessage.textContent = userInput;
        chatBox.appendChild(userMessage);

        // Add typing indicator
        const typingIndicator = document.createElement("div");
        typingIndicator.classList.add("message", "bg-gray-200", "text-gray-600", "p-3", "rounded-lg", "italic");
        typingIndicator.innerHTML = "Typing...";
        chatBox.appendChild(typingIndicator);

        // Check if the input matches an FAQ
        const faqAnswer = getFAQResponse(userInput);

        if (faqAnswer !== "Sorry, I didn't understand that. Can you please rephrase your question?") {
            // If FAQ is found, remove typing indicator and display the answer
            setTimeout(() => {
                typingIndicator.remove();
                const botMessage = document.createElement("div");
                botMessage.classList.add("message", "bg-blue-100", "text-blue-900", "p-3", "rounded-lg");
                botMessage.textContent = faqAnswer;
                chatBox.appendChild(botMessage);
            }, 1000);  // Delay to simulate typing
        } else {
            // If not an FAQ, query OpenAI API for dynamic response
            try {
                const response = await fetch('http://localhost:5000/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ message: userInput })
                });

                const data = await response.json();
                setTimeout(() => {
                    typingIndicator.remove();
                    const botMessage = document.createElement("div");
                    botMessage.classList.add("message", "bg-blue-100", "text-blue-900", "p-3", "rounded-lg");
                    botMessage.textContent = data.reply;
                    chatBox.appendChild(botMessage);
                }, 1000);  // Delay to simulate typing
            } catch (error) {
                setTimeout(() => {
                    typingIndicator.remove();
                    const botMessage = document.createElement("div");
                    botMessage.classList.add("message", "bg-red-100", "text-red-900", "p-3", "rounded-lg");
                    botMessage.textContent = "Sorry, I couldn't process your request.";
                    chatBox.appendChild(botMessage);
                }, 1000);  // Delay to simulate typing
            }
        }

        // Clear the input field
        document.getElementById("user-input").value = "";

        // Scroll chatbox to the bottom
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

// Function to check if the user input matches any FAQ
function getFAQResponse(question) {
    return faqs[question] || "Sorry, I didn't understand that. Can you please rephrase your question?";
}
