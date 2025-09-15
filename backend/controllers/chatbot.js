import Chat from '../Schema/Chatbot/ChatbotSchema.js';

import { handleFlightBookPostData} from '../controllers/flightBooking.js';
import { handleTrainBookPostData }from '../controllers/trainbooking.js';
import { handleHotelBookPostData} from '../controllers/hotelBooking.js';
import { handleCabBookPostData }from '../controllers/cabbooking.js';

import { extractFields , detectBookingType , getMissingFields} from '../utils/bookingHelper.js';

const fieldFormats = {
  flight:  "I want to book a flight on <date> from <from City> to <destination> , category <typeofcategory>." ,
  hotel: "I want to book a hotel in <city> checkin <date> checkout <date> , rooms <number of rooms> , price Rs<amount> , category <typeofcategory>." ,
  train: "I want to book a train from <city> to <destination> on <date> , train <train Name> , class <seating class>, category <typeofcategory>.",
  cab: "I want to book a cab on <date> from <from City> to <destination> , category <typeofcategory>."
};


function getBotResponse(prompt, type, missingFields, success = false) {
  const lower = prompt.toLowerCase();
  if (success) {
    return `✅ Great! Your ${type} booking was successfully completed and stored in our system.`;
  }
  if (type && missingFields.length > 0) {
    let response = `To complete your ${type} booking, I still need: ${missingFields.join(', ')}.\n\n`;
    response += "👉 Please provide them in this format:\n" + fieldFormats[type];
    return response;
  }
  if (type && missingFields.length === 0) {
    return `Great! Your ${type} booking is being processed... please wait.`;
  }
  if (["hi", "hello", "hey"].some(word => lower.includes(word)) && !type) {
    return "Hi there! How can I help you with your travel bookings today?";
  }

  if (["thank you", "thanks", "bye", "goodbye"].some(word => lower.includes(word)) && !type) {
    return "Bye... Have a nice day!!!";
  }
  return "How can I help you? You can book a hotel, cab, flight, or train. Just mention 'book flight' or 'book cab' etc.";
}

export async function chatbot(req, res) {
  const { prompt, email } = req.body;
  const type = detectBookingType(prompt);
  const fields = extractFields(prompt, email);
  let reply = getBotResponse(prompt, type, []);

  if (!email) {
    const reply = `⚠️ You need to login first before booking a ${type}.`;
    return res.status(401).json({ reply });
  }

  if (type) {
    const missing = getMissingFields(type, fields);
    if (missing.length > 0) {
      reply = getBotResponse(prompt, type, missing);
      await Chat.create({ email, prompt, reply });
      return res.status(400).json({ reply, missingFields: missing });
    }

    const bookingReq = { body: fields };
    const dummyRes = {
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.data = data;
        return this;
      },
    };

    try {
      if (type === "flight") {
        await handleFlightBookPostData(bookingReq, dummyRes);
      } else if (type === "cab") {
        await handleCabBookPostData(bookingReq, dummyRes);
      } else if (type === "train") {
        await handleTrainBookPostData(bookingReq, dummyRes);
      } else if (type === "hotel") {
        await handleHotelBookPostData(bookingReq, dummyRes);
      }

      if (dummyRes.statusCode === 201 || dummyRes.statusCode === 200) {
        reply = getBotResponse(prompt, type, [],true); 
      } else {
        reply = "Booking failed. Please try again.";
      }
    } catch (err) {
      reply = `Booking failed: ${err.message}`;
    }
  }

  await Chat.create({ email, prompt, reply });
  res.json({ reply });
}