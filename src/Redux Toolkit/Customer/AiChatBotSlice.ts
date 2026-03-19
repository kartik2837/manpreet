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

📧 Email: selfysnap@gmail.com  
📞 Contact: 99920 88843  

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
  },
  {
    condition: ({ question }) => {
      const msg = question.toLowerCase().trim();

      // ❌ Skip API for basic commands
      if (["hi", "hii", "hello", "1", "2"].includes(msg)) {
        return false;
      }

      return true;
    },
  }
);

const aiChatBotSlice = createSlice({
  name: "aiChatBot",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // 🟢 USER INPUT
      .addCase(askProductQuestion.pending, (state, action) => {
        state.loading = true;

        const userMsg = action.meta.arg.question.toLowerCase().trim();

        state.messages.push({
          role: "user",
          message: action.meta.arg.question,
        });

        // 👉 HI
        if (["hi", "hii", "hello"].includes(userMsg)) {
          state.messages.push({
            role: "assistant",
            message: `
🌐 Please select language:

1️⃣ Hindi  
2️⃣ English  

👉 Reply with 1 or 2

📧 selfysnap@gmail.com  
📞 99920 88843
            `,
          });

          state.loading = false;
        }

        // 👉 HINDI
        else if (userMsg === "1") {
          state.language = "hindi";

          state.messages.push({
            role: "assistant",
            message: `
🙏 आपने हिंदी चुनी है

🛒 Product खरीदना  
🛍️ Seller बनना  
📦 Order track करना  
💳 Payment करना  

📧 Email: selfysnap@gmail.com  
📞 Contact: 99920 88843  

👉 पूछें: Seller kaise bane?

🙏 धन्यवाद
            `,
          });

          state.loading = false;
        }

        // 👉 ENGLISH
        else if (userMsg === "2") {
          state.language = "english";

          state.messages.push({
            role: "assistant",
            message: `
🙏 You selected English

🛒 Buying products  
🛍️ Becoming seller  
📦 Tracking orders  
💳 Payment  

📧 Email: selfysnap@gmail.com  
📞 Contact: 99920 88843  

👉 Try: How to buy product?

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
            reply += "\n\n📧 selfysnap@gmail.com\n📞 99920 88843\n🙏 धन्यवाद";
          }
        } else {
          if (!reply.toLowerCase().includes("thank")) {
            reply += "\n\n📧 selfysnap@gmail.com\n📞 99920 88843\n🙏 Thank You";
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

        if (question.includes("seller")) {
          reply = hindi
            ? `
🛍️ Seller बनने के लिए:

1. Register करें  
2. Dashboard खोलें  
3. Product add करें  
4. Orders manage करें  

📧 selfysnap@gmail.com  
📞 99920 88843  

💰 Start earning  

🙏 धन्यवाद
            `
            : `
🛍️ To become a Seller:

1. Register  
2. Open dashboard  
3. Add products  
4. Manage orders  

📧 selfysnap@gmail.com  
📞 99920 88843  

💰 Start earning  

🙏 Thank You
            `;
        } 
        
        else if (question.includes("buy") || question.includes("खरीद")) {
          reply = hindi
            ? `
🛒 Product खरीदने के लिए:

1. Search करें  
2. Add to cart  
3. Checkout करें  
4. Payment करें  

📧 selfysnap@gmail.com  
📞 99920 88843  

📦 Order placed  

🙏 धन्यवाद
            `
            : `
🛒 To buy product:

1. Search  
2. Add to cart  
3. Checkout  
4. Payment  

📧 selfysnap@gmail.com  
📞 99920 88843  

📦 Order placed  

🙏 Thank You
            `;
        } 
        
        else {
          reply = hindi
            ? `
👋 नमस्ते!

🛒 Product खरीदना  
🛍️ Seller बनना  
📦 Order track करना  

📧 selfysnap@gmail.com  
📞 99920 88843  

🙏 धन्यवाद
            `
            : `
👋 Hello!

🛒 Buying products  
🛍️ Becoming seller  
📦 Tracking orders  

📧 selfysnap@gmail.com  
📞 99920 88843  

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
