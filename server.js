const YahooFinance = require('yahoo-finance2').default;

const yahooFinance = new YahooFinance({
  suppressNotices: ['yahooSurvey']
});
const axios = require("axios");
const User = require("./models/User");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
console.log("FMP KEY:", process.env.FMP_API_KEY);

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

app.get("/", (req, res) => {
  res.send("Stockbot API Running");
});

const PORT = process.env.PORT || 3000;

app.post("/api/users", async (req, res) => {
  try {
    const { userId, name } = req.body;

    const user = new User({
      userId,
      name
    });

    await user.save();

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

app.post("/api/watchlist/add", async (req, res) => {

  try {
    
    const { mobile, symbol, companyName } = req.body;

    console.log("Mobile provided (watchlist add):", mobile);

    const user = await User.findOne({ mobile });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const alreadyExists = user.watchlist.some(
      stock => stock.symbol === symbol
    );

    if (!alreadyExists) {

      user.watchlist.push({
        symbol,
        companyName
      });

      await user.save();
    }

    res.json(user);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});
      

app.get("/api/watchlist/:mobile", async (req, res) => {

  try {

    console.log("Mobile requested (watchlist):", req.params.mobile);

    const user = await User.findOne({
      mobile: req.params.mobile
    });

    if (!user) {

      return res.status(404).json({
        message: "User not found"
      });

    }

    res.json({
      mobile: user.mobile,
      watchlist: user.watchlist
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});

app.post("/api/watchlist/remove", async (req, res) => {

  try {
    
    const { mobile, symbol } = req.body;

    console.log("Mobile provided (watchlist remove):", mobile);

    const user = await User.findOne({ mobile });

    if (!user) {

      return res.status(404).json({
        message: "User not found"
      });

    }

    user.watchlist = user.watchlist.filter(
      stock => stock.symbol !== symbol
    );

    await user.save();

    res.json(user);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});
      

app.post("/api/register", async (req, res) => {
  try {
    
    const { mobile, name } = req.body;

    console.log("Mobile provided (register):", mobile);

    const mobileRegex = /^[6-9]\d{9}$/;

    if (!mobileRegex.test(mobile)) {
      return res.status(400).json({
        message: "Invalid Indian mobile number"
      });
    }

    const existingUser = await User.findOne({ mobile });

    if (existingUser) {
      return res.status(400).json({
        message: "Mobile number already registered"
      });
    }

    const user = await User.create({
      mobile,
      name
    });

    res.status(201).json(user);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
});

app.get("/api/user/:mobile", async (req, res) => {

  try {
    
    console.log("Mobile requested (user):", req.params.mobile);

    const user = await User.findOne({
      mobile: req.params.mobile
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json(user);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});

app.get("/api/search-stock", async (req, res) => {

  try {

    const query = req.query.query;
    
    const aliases = {

  SBI: {
    symbol: "SBIN.NS",
    companyName: "State Bank of India",
    exchange: "NSE"
  },

  HDFC: {
    symbol: "HDFCBANK.NS",
    companyName: "HDFC Bank Ltd.",
    exchange: "NSE"
  },

  RELIANCE: {
    symbol: "RELIANCE.NS",
    companyName: "Reliance Industries Ltd.",
    exchange: "NSE"
  },

  TCS: {
    symbol: "TCS.NS",
    companyName: "Tata Consultancy Services Ltd.",
    exchange: "NSE"
  },

  INFY: {
    symbol: "INFY.NS",
    companyName: "Infosys Ltd.",
    exchange: "NSE"
  }

};

if (aliases[query.toUpperCase()]) {

  return res.json([
    aliases[query.toUpperCase()]
  ]);

}

    const result = await yahooFinance.search(query);

    const stocks = result.quotes
      .filter(q =>
        q.quoteType === "EQUITY" &&
        q.symbol &&
        (q.longname || q.shortname)
      )
      .slice(0, 5)
      .map(q => ({

        symbol: q.symbol,

        companyName:
          q.longname ||
          q.shortname,

        exchange:
          q.exchDisp ||
          q.exchange

      }));

    res.json(stocks);

  } catch(error){

    res.status(500).json({
      error: error.message
    });

  }

});
 

app.get("/api/stock/:symbol", async (req, res) => {

  try {

    const quote = await yahooFinance.quote(
      req.params.symbol
    );

    res.json({

      symbol: quote.symbol,

      shortName: quote.shortName,
      longName: quote.longName,

      currentPrice: quote.regularMarketPrice,

      regularMarketPrice: quote.regularMarketPrice,

      regularMarketOpen: quote.regularMarketOpen,

      regularMarketDayHigh: quote.regularMarketDayHigh,

      regularMarketDayLow: quote.regularMarketDayLow,

      regularMarketVolume: quote.regularMarketVolume,

      regularMarketChangePercent:
        quote.regularMarketChangePercent,

      fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh,

      fiftyTwoWeekLow: quote.fiftyTwoWeekLow,

      marketCap: quote.marketCap,

      exchange: quote.fullExchangeName

    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});


app.get("/api/compare", async (req, res) => {

  try {

    const stock1 = req.query.stock1;
    const stock2 = req.query.stock2;

    const quote1 = await yahooFinance.quote(stock1);
    const quote2 = await yahooFinance.quote(stock2);

    res.json({

      stock1: {
        symbol: quote1.symbol,
        shortName: quote1.shortName,
        longName: quote1.longName,

        currentPrice: quote1.regularMarketPrice,

        regularMarketChangePercent:
          quote1.regularMarketChangePercent,

        fiftyTwoWeekHigh:
          quote1.fiftyTwoWeekHigh,

        fiftyTwoWeekLow:
          quote1.fiftyTwoWeekLow,

        marketCap:
          quote1.marketCap
      },

      stock2: {
        symbol: quote2.symbol,
        shortName: quote2.shortName,
        longName: quote2.longName,

        currentPrice: quote2.regularMarketPrice,

        regularMarketChangePercent:
          quote2.regularMarketChangePercent,

        fiftyTwoWeekHigh:
          quote2.fiftyTwoWeekHigh,

        fiftyTwoWeekLow:
          quote2.fiftyTwoWeekLow,

        marketCap:
          quote2.marketCap
      }

    });

  } catch(error) {

    res.status(500).json({
      error: error.message
    });

  }

});
   
        

app.get("/api/watchlist-with-prices/:mobile", async (req, res) => {

  try {

    const user = await User.findOne({
      mobile: req.params.mobile
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const watchlistData = [];

    for (const stock of user.watchlist) {

      const quote = await yahooFinance.quote(
        stock.symbol
      );

      watchlistData.push({
        symbol: stock.symbol,
        companyName: stock.companyName,
        price: quote.regularMarketPrice
      });

    }

    res.json({
      mobile: user.mobile,
      watchlist: watchlistData
    });

  } catch(error) {

    res.status(500).json({
      error: error.message
    });

  }

});

app.get("/api/explore-stocks", async (req, res) => {

  try {

    const pool = [
  "AAPL",
  "MSFT",
  "NVDA",
  "GOOGL",
  "AMZN",
  "META",
  "TSLA",
  "SBIN.NS",
  "HDFCBANK.NS",
  "RELIANCE.NS",
  "TCS.NS",
  "INFY.NS"
];

const stocks = pool
  .sort(() => Math.random() - 0.5)
  .slice(0, 8);

    const results = [];

    for (const symbol of stocks) {

      const quote = await yahooFinance.quote(symbol);

      results.push({
        symbol: quote.symbol,
        companyName: quote.longName || quote.shortName,
        price: quote.regularMarketPrice
      });

    }

    res.json(results);

  } catch(error) {

    res.status(500).json({
      error: error.message
    });

  }

});

app.get("/api/compare-watchlist/:mobile", async (req, res) => {

  try {

    const user = await User.findOne({
      mobile: req.params.mobile
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const results = [];

    for (const stock of user.watchlist) {

      const quote = await yahooFinance.quote(
        stock.symbol
      );

      results.push({

        symbol: quote.symbol,

        companyName:
          quote.longName ||
          quote.shortName,

        price:
          quote.regularMarketPrice,

        change:
          quote.regularMarketChangePercent,

        marketCap:
          quote.marketCap

      });

    }

    res.json(results);

  } catch(error) {

    res.status(500).json({
      error: error.message
    });

  }

});

[
  {
    "symbol":"HDFCBANK.NS",
    "companyName":"HDFC Bank Limited"
  },
  {
    "symbol":"HSBC",
    "companyName":"HSBC Holdings plc"
  },
  {
    "symbol":"IBN",
    "companyName":"ICICI Bank Limited"
  },
  {
    "symbol":"SBIN.NS",
    "companyName":"State Bank of India"
  }
]

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
