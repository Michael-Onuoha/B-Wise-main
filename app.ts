import express from "express";
import { GoogleGenAI } from "@google/genai";
import { Wallet } from "ethers";

const app = express();
app.use(express.json());

// API Route for Ask B-AI Assistant
app.post("/api/ask-b-ai", async (req, res) => {
  try {
    const { prompt, transactions } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      return res.json({
        mode: "fallback",
        message: null
      });
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const systemInstruction = `You are B-AI, an intelligent financial AI assistant for the Payline Transactions Dashboard.
Your job is to assist user William Grace with analyzing transaction history, merchant category spending, failed/pending transfers, and financial metrics.
Be clear, accurate, conversational, and format responses with bullet points and bold key numbers where helpful.
Current Transaction List:
${JSON.stringify(transactions, null, 2)}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    return res.json({
      mode: "ai",
      answer: response.text,
    });
  } catch (err: any) {
    console.error("Gemini API Error:", err);
    return res.status(500).json({
      error: "Failed to process query with B-AI",
      details: err.message,
    });
  }
});

// BMoni Embedded API Generic Proxy Endpoint
app.all("/api/bmoni/proxy", async (req, res) => {
  try {
    const {
      endpoint,
      method = "GET",
      payload,
      apiKey: customApiKey,
      baseUrl: customBaseUrl,
    } = req.body || {};

    const bmoniApiKey =
      customApiKey ||
      req.headers["x-api-key"] ||
      process.env.BMONI_API_KEY ||
      "pk_a025cacbf33a_76fb864113f3540909de5b1da39cc146906e35b1c6d4d1e4";
    const bmoniBaseUrl = (
      customBaseUrl ||
      process.env.BMONI_BASE_URL ||
      "https://embedded-dev.bmoni.com"
    ).replace(/\/$/, "");

    const targetPath = endpoint ? (endpoint.startsWith("/") ? endpoint : `/${endpoint}`) : "/v1/health";
    const fullUrl = `${bmoniBaseUrl}${targetPath}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (bmoniApiKey) {
      headers["x-api-key"] = bmoniApiKey as string;
    }

    const options: RequestInit = {
      method: method.toUpperCase(),
      headers,
    };

    if (payload && ["POST", "PUT", "PATCH"].includes(options.method!)) {
      options.body = JSON.stringify(payload);
    }

    const response = await fetch(fullUrl, options);
    const data = await response.json().catch(() => null);

    return res.status(response.status).json({
      status: response.status,
      ok: response.ok,
      data: data || { message: "No JSON body returned" },
      url: fullUrl,
    });
  } catch (err: any) {
    console.error("BMoni Proxy Error:", err);
    return res.status(500).json({
      status: 500,
      ok: false,
      error: "Failed to connect to BMoni API endpoint",
      details: err.message,
    });
  }
});

// Dedicated BMoni Helper Endpoints
app.get("/api/bmoni/users/:userId/smart-wallets/account/balances", async (req, res) => {
  try {
    const { userId } = req.params;
    const bmoniApiKey = (req.headers["x-api-key"] as string) || process.env.BMONI_API_KEY || "pk_a025cacbf33a_76fb864113f3540909de5b1da39cc146906e35b1c6d4d1e4";
    const bmoniBaseUrl = (process.env.BMONI_BASE_URL || "https://embedded-dev.bmoni.com").replace(/\/$/, "");

    const fullUrl = `${bmoniBaseUrl}/v1/users/${userId}/smart-wallets/account/balances`;
    const response = await fetch(fullUrl, {
      headers: {
        "Content-Type": "application/json",
        ...(bmoniApiKey ? { "x-api-key": bmoniApiKey } : {}),
      },
    });

    const data = await response.json().catch(() => null);
    return res.status(response.status).json(data || {});
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.get("/api/bmoni/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const bmoniApiKey = (req.headers["x-api-key"] as string) || process.env.BMONI_API_KEY || "pk_a025cacbf33a_76fb864113f3540909de5b1da39cc146906e35b1c6d4d1e4";
    const bmoniBaseUrl = (process.env.BMONI_BASE_URL || "https://embedded-dev.bmoni.com").replace(/\/$/, "");

    const fullUrl = `${bmoniBaseUrl}/v1/users/${userId}`;
    const response = await fetch(fullUrl, {
      headers: {
        "Content-Type": "application/json",
        ...(bmoniApiKey ? { "x-api-key": bmoniApiKey } : {}),
      },
    });

    const data = await response.json().catch(() => null);
    return res.status(response.status).json(data || {});
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// End-to-End Live Provisioning: Create User + EVM Key + Owner Challenge + Managed Smart Wallet (USDB)
app.post("/api/bmoni/users/provision-wallet", async (req, res) => {
  try {
    const { firstName = "Alex", lastName = "Payline", email, phoneNumber, apiKey: customApiKey, baseUrl: customBaseUrl } = req.body || {};
    const bmoniApiKey = customApiKey || process.env.BMONI_API_KEY || "pk_a025cacbf33a_76fb864113f3540909de5b1da39cc146906e35b1c6d4d1e4";
    const bmoniBaseUrl = (customBaseUrl || process.env.BMONI_BASE_URL || "https://embedded-dev.bmoni.com").replace(/\/$/, "");

    const randomSuffix = Date.now().toString().slice(-6);
    const userEmail = email ? `${email.split('@')[0]}.${randomSuffix}@${email.split('@')[1] || 'payline.app'}` : `user.${randomSuffix}@payline.app`;
    const userPhone = phoneNumber || `+2348${Math.floor(100000000 + Math.random() * 900000000)}`;

    const signer = Wallet.createRandom();

    // 1. Create user
    let userRes = await fetch(`${bmoniBaseUrl}/v1/users`, {
      method: "POST",
      headers: {
        "x-api-key": bmoniApiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email: userEmail,
        phoneNumber: userPhone,
      }),
    });
    let userData = await userRes.json();

    // Fallback if email/phone conflict
    if (userData?.statusCode === 409 || userRes.status === 409) {
      const retryEmail = `user.${Date.now()}@payline.app`;
      const retryPhone = `+234${Math.floor(1000000000 + Math.random() * 8000000000)}`;
      userRes = await fetch(`${bmoniBaseUrl}/v1/users`, {
        method: "POST",
        headers: {
          "x-api-key": bmoniApiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email: retryEmail,
          phoneNumber: retryPhone,
        }),
      });
      userData = await userRes.json();
    }

    const createdUser = userData?.user || userData;
    const userId = createdUser?.bmoniUserId || createdUser?.id;

    if (!userId) {
      return res.status(400).json({ error: "Failed to create user", details: userData });
    }

    // 2. Request owner challenge for USDB (USDB group wallet)
    const chalRes = await fetch(`${bmoniBaseUrl}/v1/users/${userId}/smart-wallets/owner-proof-challenges`, {
      method: "POST",
      headers: {
        "x-api-key": bmoniApiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currency: "USDB",
        userOwnerAddress: signer.address,
      }),
    });
    const chalData = await chalRes.json();

    if (!chalData?.challengeId || !chalData?.message) {
      return res.status(400).json({ error: "Failed to generate owner challenge", details: chalData });
    }

    // 3. Sign challenge
    const signature = await signer.signMessage(chalData.message);

    // 4. Create managed USDB smart wallet
    const walletRes = await fetch(`${bmoniBaseUrl}/v1/users/${userId}/smart-wallets/create-managed`, {
      method: "POST",
      headers: {
        "x-api-key": bmoniApiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currency: "USDB",
        userOwnerAddress: signer.address,
        ownerProofChallengeId: chalData.challengeId,
        ownerProofSignature: signature,
      }),
    });
    const walletData = await walletRes.json();

    // 5. Fetch initial balances
    const balRes = await fetch(`${bmoniBaseUrl}/v1/users/${userId}/smart-wallets/account/balances`, {
      headers: {
        "x-api-key": bmoniApiKey,
        "Content-Type": "application/json",
      },
    });
    const balData = await balRes.json();

    return res.json({
      ok: true,
      user: createdUser,
      bmoniUserId: userId,
      ownerAddress: signer.address,
      ownerPrivateKey: signer.privateKey,
      wallet: walletData,
      balances: balData?.balances || [],
      smartAccountAddress: balData?.smartAccountAddress || walletData?.walletAddress,
    });
  } catch (err: any) {
    console.error("Provision Wallet Error:", err);
    return res.status(500).json({ error: err.message });
  }
});

export default app;
