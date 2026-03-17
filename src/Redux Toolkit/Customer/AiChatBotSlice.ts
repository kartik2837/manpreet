// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { api } from "../../Config/Api";

// // Define the initial state using an interface
// interface AiChatBotState {
//   response: string | null;
//   loading: boolean;
//   error: string | null;
//   messages: any[];
// }

// const initialState: AiChatBotState = {
//   response: null,
//   loading: false,
//   error: null,
//   messages: [],
// };

// // Define the async thunk for sending the message to the chatbot
// export const chatBot = createAsyncThunk<
//   any,
//   { prompt: any; productId: number | null | undefined; userId: number | null }
// >(
//   "aiChatBot/generateResponse",
//   async ({ prompt, productId, userId }, { rejectWithValue }) => {
//     try {
//       const response = await api.post("/chat", prompt, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("jwt")}`,
//         },
//         params: {
//           userId,
//           productId,
//         },
//       });
//       console.log("response ", productId, response.data);
//       return response.data;
//     } catch (error: any) {
//       console.log("error ", error.response);
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to generate chatbot response"
//       );
//     }
//   }
// );

// export const askProductQuestion = createAsyncThunk<
//   any,any
// >(
//   "aiChatBot/askProductQuestion",
//   async ({ productId, question }, { rejectWithValue }) => {
//     try {
//       const response = await api.post<{ answer: string }>(
//         `/chat/product/${productId}`,
//         { question }
//       );
//       console.log("chat answer ----- ",response.data)
//       return response.data.answer;
      
//     } catch (error: any) {
//       console.log("error --- ",error)
//       const message =
//         error.response?.data?.message ||
//         error.message ||
//         "Failed to get answer";
//       return rejectWithValue(message);
//     }
//   }
// );

// // Create the slice
// const aiChatBotSlice = createSlice({
//   name: "aiChatBot",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(chatBot.pending, (state, action) => {
//         state.loading = true;
//         state.error = null;
//         const { prompt } = action.meta.arg;

//         // You can log or use the data here
//         // console.log('Pending request:', { prompt, productId, userId });
//         const userPrompt = { message: prompt.prompt, role: "user" };
//         state.messages = [...state.messages, userPrompt];
//       })
//       .addCase(chatBot.fulfilled, (state, action) => {
//         state.loading = false;
//         state.response = action.payload;
//         state.messages = [...state.messages, action.payload];
//       })
//       .addCase(chatBot.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       .addCase(askProductQuestion.pending, (state,action) => {
//         state.loading = true;
//         // state.productQuestion.error = null;
//         // state.productQuestion.answer = null;
//         state.messages.push({role:"user",message:action.meta.arg.question})
//       })
//       .addCase(
//         askProductQuestion.fulfilled,
//         (state, action) => {
//           state.loading = false;
//           // state.productQuestion.answer = action.payload;
//           console.log("ans - ", action.payload)
//           state.messages.push({role:'res',message:action.payload})
//         }
//       )
//       .addCase(askProductQuestion.rejected, (state) => {
//         state.loading = false;
//         // state.productQuestion.error = action.payload as string;
//       });
//   },
// });

// // Export the reducer
// export default aiChatBotSlice.reducer;






























import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Config/Api";

interface Message {
  role: string;
  message: string;
}

interface AiChatBotState {
  loading: boolean;
  error: string | null;
  messages: Message[];
  language: "hindi" | "english" | null;
}

const initialState: AiChatBotState = {
  loading: false,
  error: null,
  language: null,
  messages: [
    {
      role: "assistant",
      message: `
👋 Welcome to SelfySnap AI Assistant

Type "Hi" to start

🙏 Thank You
      `,
    },
  ],
};

// 🔹 API CALL
export const askProductQuestion = createAsyncThunk<
  string,
  { productId?: string; question: string }
>(
  "aiChatBot/askProductQuestion",
  async ({ productId, question }, { rejectWithValue }) => {
    try {
      const response = await api.post<{ answer: string }>(
        `/chat/product/${productId}`,
        { question }
      );
      return response.data.answer;
    } catch (error) {
      return rejectWithValue("API Failed");
    }
  }
);

const aiChatBotSlice = createSlice({
  name: "aiChatBot",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // 🟢 USER MESSAGE
      .addCase(askProductQuestion.pending, (state, action) => {
        state.loading = true;

        const userMsg = action.meta.arg.question.toLowerCase();

        state.messages.push({
          role: "user",
          message: action.meta.arg.question,
        });

        // 👉 HI / HELLO → LANGUAGE SELECT
        if (userMsg === "hi" || userMsg === "hii" || userMsg === "hello") {
          state.messages.push({
            role: "assistant",
            message: `
🌐 Please select language:

1️⃣ Hindi  
2️⃣ English  

👉 Reply with 1 or 2
            `,
          });

          state.loading = false;
        }

        // 👉 LANGUAGE SELECT
        else if (userMsg === "1") {
          state.language = "hindi";

          state.messages.push({
            role: "assistant",
            message: `
🙏 आपने हिंदी चुनी है

मैं आपकी मदद कर सकता हूँ:

🛒 Product खरीदना  
🛍️ Seller बनना  
📦 Order track करना  
💳 Payment करना  

👉 पूछें:
Seller kaise bane?

🙏 धन्यवाद
            `,
          });

          state.loading = false;
        } else if (userMsg === "2") {
          state.language = "english";

          state.messages.push({
            role: "assistant",
            message: `
🙏 You selected English

I can help you with:

🛒 Buying products  
🛍️ Becoming seller  
📦 Tracking orders  
💳 Payment  

👉 Try:
How to buy product?

🙏 Thank You
            `,
          });

          state.loading = false;
        }
      })

      // 🟢 API SUCCESS
      .addCase(askProductQuestion.fulfilled, (state, action) => {
        state.loading = false;

        let reply = action.payload;

        if (state.language === "hindi") {
          if (!reply.includes("धन्यवाद")) {
            reply += "\n\n🙏 धन्यवाद";
          }
        } else {
          if (!reply.toLowerCase().includes("thank")) {
            reply += "\n\n🙏 Thank You";
          }
        }

        state.messages.push({
          role: "assistant",
          message: reply,
        });
      })

      // 🔥 FALLBACK
      .addCase(askProductQuestion.rejected, (state, action) => {
        state.loading = false;

        const question = action.meta.arg.question.toLowerCase();
        const hindi = state.language === "hindi";

        let reply = "";

        // 🟢 SELLER
        if (question.includes("seller")) {
          reply = hindi
            ? `
🛍️ Seller बनने के लिए:

1. Become Seller पर क्लिक करें  
2. Register करें  
3. Dashboard में जाएं  
4. Product add करें  
5. Order manage करें  

💰 आप earning शुरू कर सकते हैं  

🙏 धन्यवाद
            `
            : `
🛍️ To become a Seller:

1. Click Become Seller  
2. Register  
3. Open dashboard  
4. Add products  
5. Manage orders  

💰 Start earning  

🙏 Thank You
            `;
        }

        // 🟢 BUY
        else if (question.includes("buy") || question.includes("खरीद")) {
          reply = hindi
            ? `
🛒 Product खरीदने के लिए:

1. Product search करें  
2. Add to Cart करें  
3. Checkout करें  
4. Payment करें  

📦 Order place हो जाएगा  

🙏 धन्यवाद
            `
            : `
🛒 To buy product:

1. Search product  
2. Add to Cart  
3. Checkout  
4. Make payment  

📦 Order placed  

🙏 Thank You
            `;
        }

        // 🟢 DEFAULT
        else {
          reply = hindi
            ? `
👋 नमस्ते!

मैं आपकी मदद कर सकता हूँ:

🛒 Product खरीदना  
🛍️ Seller बनना  
📦 Order track करना  

🙏 धन्यवाद
            `
            : `
👋 Hello!

I can help you with:

🛒 Buying products  
🛍️ Becoming seller  
📦 Tracking orders  

🙏 Thank You
            `;
        }

        state.messages.push({
          role: "assistant",
          message: reply,
        });
      });
  },
});

export default aiChatBotSlice.reducer;
