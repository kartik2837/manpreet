// import React from "react";

// const Contact: React.FC = () => {
//   return (
//     <div style={pageStyle}>
//       <div style={containerStyle}>
//         <h2 style={titleStyle}>Contact SelfySnap</h2>

//         <p style={subtitleStyle}>
//           Inquiry is welcome at <b>selfysnap.com</b>. Our team will respond soon.
//         </p>

//         <form
//           action="https://formsubmit.co/selfysnap@gmail.com"
//           method="POST"
//           style={formStyle}
//         >
//           {/* FormSubmit settings */}
//           <input type="hidden" name="_captcha" value="false" />
//           <input type="hidden" name="_template" value="table" />
//           <input
//             type="hidden"
//             name="_subject"
//             value="New Contact Form Message - SelfySnap"
//           />

//           {/* Redirect to Home page */}
//           <input
//             type="hidden"
//             name="_next"
//             value="https:selfysnap.com"
//           />

//           <div style={row}>
//             <div style={field}>
//               <label>Name</label>
//               <input type="text" name="name" required style={input} />
//             </div>

//             <div style={field}>
//               <label>Email</label>
//               <input type="email" name="email" required style={input} />
//             </div>
//           </div>

//           <div style={row}>
//             <div style={field}>
//               <label>Phone</label>
//               <input type="tel" name="phone" style={input} />
//             </div>

//             <div style={field}>
//               <label>Inquiry Type</label>
//               <select name="type" style={input}>
//                 <option>Customer Support</option>
//                 <option>Seller Registration</option>
//                 <option>Order Issue</option>
//                 <option>General Inquiry</option>
//               </select>
//             </div>
//           </div>

//           <div style={field}>
//             <label>Order ID (Optional)</label>
//             <input type="text" name="orderId" style={input} />
//           </div>

//           <div style={field}>
//             <label>Message</label>
//             <textarea name="message" rows={4} required style={textarea} />
//           </div>

//           <button type="submit" style={button}>
//             Submit Inquiry
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// const pageStyle: React.CSSProperties = {
//   background: "#f3f3f3",
//   minHeight: "100vh",
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   padding: "20px",
//   fontFamily: "Arial, sans-serif",
// };

// const containerStyle: React.CSSProperties = {
//   background: "#fff",
//   width: "100%",
//   maxWidth: "700px",
//   padding: "35px",
//   borderRadius: "8px",
//   boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
// };

// const titleStyle: React.CSSProperties = {
//   textAlign: "center",
//   fontSize: "26px",
//   marginBottom: "5px",
// };

// const subtitleStyle: React.CSSProperties = {
//   textAlign: "center",
//   marginBottom: "25px",
//   color: "#555",
// };

// const formStyle: React.CSSProperties = {
//   display: "flex",
//   flexDirection: "column",
// };

// const row: React.CSSProperties = {
//   display: "flex",
//   gap: "15px",
//   marginBottom: "15px",
// };

// const field: React.CSSProperties = {
//   flex: 1,
//   display: "flex",
//   flexDirection: "column",
// };

// const input: React.CSSProperties = {
//   padding: "10px",
//   borderRadius: "4px",
//   border: "1px solid #ccc",
//   marginTop: "5px",
//   fontSize: "14px",
// };

// const textarea: React.CSSProperties = {
//   padding: "10px",
//   borderRadius: "4px",
//   border: "1px solid #ccc",
//   marginTop: "5px",
//   fontSize: "14px",
// };

// const button: React.CSSProperties = {
//   marginTop: "20px",
//   padding: "12px",
//   background: "#ff9900",
//   border: "none",
//   borderRadius: "5px",
//   fontWeight: 600,
//   cursor: "pointer",
// };

// export default Contact;

















import React from "react";

const Contact: React.FC = () => {
  return (
    <div style={pageStyle}>
      <style>
        {`
          .contact-input:hover, .contact-select:hover, .contact-textarea:hover {
            border-color: #ff7e5f;
          }
          .contact-input:focus, .contact-select:focus, .contact-textarea:focus {
            border-color: #ff7e5f;
            box-shadow: 0 0 0 4px rgba(255,126,95,0.1);
            outline: none;
          }
          .contact-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 28px rgba(255,126,95,0.4);
          }
        `}
      </style>
      <div style={containerStyle}>
        <h2 style={titleStyle}>Contact SelfySnap</h2>
        <p style={subtitleStyle}>
          We'd love to hear from you! Send us your inquiry and our team will respond promptly.
        </p>

        <form
          action="https://formsubmit.co/selfysnap@gmail.com"
          method="POST"
          style={formStyle}
        >
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_template" value="table" />
          <input
            type="hidden"
            name="_subject"
            value="New Contact Form Message - SelfySnap"
          />
          <input type="hidden" name="_next" value="http://localhost:5173" />

          <div style={row}>
            <div style={field}>
              <label style={labelStyle}>Name</label>
              <input
                type="text"
                name="name"
                required
                className="contact-input"
                style={input}
              />
            </div>
            <div style={field}>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                name="email"
                required
                className="contact-input"
                style={input}
              />
            </div>
          </div>

          <div style={row}>
            <div style={field}>
              <label style={labelStyle}>Phone</label>
              <input
                type="tel"
                name="phone"
                className="contact-input"
                style={input}
              />
            </div>
            <div style={field}>
              <label style={labelStyle}>Inquiry Type</label>
              <select
                name="type"
                className="contact-select"
                style={input}
              >
                <option>Customer Support</option>
                <option>Seller Registration</option>
                <option>Order Issue</option>
                <option>General Inquiry</option>
              </select>
            </div>
          </div>

          <div style={field}>
            <label style={labelStyle}>Order ID (Optional)</label>
            <input
              type="text"
              name="orderId"
              className="contact-input"
              style={input}
            />
          </div>

          <div style={field}>
            <label style={labelStyle}>Message</label>
            <textarea
              name="message"
              rows={6}
              required
              className="contact-textarea"
              style={textarea}
            />
          </div>

          <button type="submit" className="contact-button" style={button}>
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

// ----- LAPTOP-OPTIMIZED STYLES -----
const pageStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, #e0f7fa, #fff5f0)",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "40px 20px",
  fontFamily: "'Poppins', sans-serif",
};

const containerStyle: React.CSSProperties = {
  background: "#ffffff",
  width: "100%",
  maxWidth: "1200px",
  padding: "60px 70px",
  borderRadius: "28px",
  boxShadow: "0 20px 45px rgba(0,0,0,0.1)",
};

const titleStyle: React.CSSProperties = {
  textAlign: "center",
  fontSize: "38px",
  fontWeight: 700,
  marginBottom: "15px",
  color: "#222",
};

const subtitleStyle: React.CSSProperties = {
  textAlign: "center",
  marginBottom: "45px",
  color: "#555",
  fontSize: "18px",
  lineHeight: 1.6,
  maxWidth: "800px",
  marginLeft: "auto",
  marginRight: "auto",
};

const formStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const row: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "30px",
  marginBottom: "30px",
};

const field: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
};

const labelStyle: React.CSSProperties = {
  marginBottom: "10px",
  fontWeight: 600,
  color: "#333",
  fontSize: "16px",
  letterSpacing: "0.3px",
};

const input: React.CSSProperties = {
  padding: "16px 20px",
  borderRadius: "12px",
  border: "1px solid #ddd",
  fontSize: "16px",
  outline: "none",
  transition: "border 0.2s, box-shadow 0.2s",
  backgroundColor: "#fafafa",
};

const textarea: React.CSSProperties = {
  ...input,
  minHeight: "180px",
  resize: "vertical",
};

const button: React.CSSProperties = {
  marginTop: "40px",
  padding: "18px 24px",
  background: "linear-gradient(90deg, #ff7e5f, #feb47b)",
  border: "none",
  borderRadius: "14px",
  fontWeight: 700,
  fontSize: "20px",
  color: "#fff",
  cursor: "pointer",
  transition: "transform 0.2s, box-shadow 0.2s",
  boxShadow: "0 8px 20px rgba(255,126,95,0.3)",
};

export default Contact;