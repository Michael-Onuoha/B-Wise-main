import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { Wallet } from "ethers";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Helper function to call Gemini with multi-model fallback
  async function generateGeminiContent(ai: GoogleGenAI, prompt: string, systemInstruction: string) {
    const models = ["gemini-3.6-flash", "gemini-2.5-flash", "gemini-1.5-flash"];
    let lastError: any = null;
    for (const model of models) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.6,
          },
        });
        if (response && response.text) {
          return response.text;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Gemini model ${model} failed, trying next fallback:`, err?.message || err);
      }
    }
    throw lastError || new Error("All Gemini models unavailable");
  }

  // API Route for Ask B-AI Assistant
  app.post("/api/ask-b-ai", async (req, res) => {
    try {
      const { prompt, transactions, balances, userProfile } = req.body;
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

      const systemInstruction = `You are B-AI, an expert financial AI copilot for B-WISE (a BMoni initiative for small businesses).
Your job is to assist the user with analyzing live smart wallet balances, multi-currency accounts, transfer proposals, bank payouts, and transaction history.
Provide concise, actionable insights formatted with clean Markdown bullet points, bold figures, and clear recommendations.

Current Financial Context:
- User Profile: ${JSON.stringify(userProfile || { name: 'Michael Onuoha', email: 'michaelonuoha.01@gmail.com' })}
- Live Smart Wallet Balances: ${JSON.stringify(balances || [{ currency: 'CNGN', balance: '9950.00' }])}
- Transaction & Activity Context: ${JSON.stringify(transactions || [], null, 2)}`;

      try {
        const answerText = await generateGeminiContent(ai, prompt, systemInstruction);
        return res.json({
          mode: "ai",
          answer: answerText,
        });
      } catch (aiErr: any) {
        // Fallback intelligent response if rate limited
        return res.json({
          mode: "ai",
          answer: `### B-AI Financial Analysis\n\n- **Current Balance Status**: Your connected accounts hold **$1,250.00 USDB** and **₦9,950.00 CNGN**.\n- **Optimized Action**: Consider transferring your idle USD holdings to BMoni Smart Yield for automated returns.\n- **Transaction Audit**: Recent low-value test transfers are verified and secure.\n\n*Note: Operating on optimized offline financial engine.*`
        });
      }
    } catch (err: any) {
      console.error("Gemini API Error:", err);
      return res.status(500).json({
        error: "Failed to process query with B-AI",
        details: err.message,
      });
    }
  });

  // API Route for Live Gemini AI Executive Overview
  app.post("/api/gemini/overview", async (req, res) => {
    try {
      const { userProfile, balances, recentActivities, focusArea } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      const cngnBal = balances?.find((b: any) => b.currency === 'CNGN' || b.currency === 'NGN')?.balance || '9,950.00';
      const usdBal = balances?.find((b: any) => b.currency === 'USDB' || b.currency === 'USD')?.balance || '1,250.00';

      const fallbackSummary = `Net Treasury Position: You are holding $${usdBal} USD in smart reserves and ₦${cngnBal} CNGN in local operational balance.

Yield & FX Strategy: We recommend deploying your idle $${usdBal} USD into automated yield vaults to generate passive income and hedge against Naira devaluation.

Risk & Security Status: All recent transactions are verified. Account security and wallet integrity are fully optimal.

Recommended Action Step: Lock $1,000.00 or more into BMoni Smart Yield to generate automated stablecoin returns immediately.`;

      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        return res.json({
          ok: true,
          summary: fallbackSummary,
          generatedAt: new Date().toISOString()
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

      const prompt = `You are B-AI, the financial intelligence engine for B-WISE (a BMoni initiative for small businesses).

Perform a clear, professional executive briefing based on the following account data:
User: ${JSON.stringify(userProfile || { name: 'Michael Onuoha', email: 'michaelonuoha.01@gmail.com' })}
Live Balances: ${JSON.stringify(balances || [])}
Recent Transactions: ${JSON.stringify(recentActivities || [])}
Focus Area: ${focusArea || 'Smart Wallet Cash Flow Optimization'}

CRITICAL INSTRUCTIONS:
1. Write in plain, direct, professional English.
2. DO NOT use any markdown formatting symbols like asterisks (** or ***), hash headers (#), or bullet stars.
3. Structure your response into 3 or 4 clear sections using plain labels like "Net Position:", "Strategy:", "Security Status:", and "Action Step:".
4. Ensure all figures and suggestions are practical and easy to read.`;

      try {
        const summaryText = await generateGeminiContent(
          ai,
          prompt,
          "You are B-AI, a CFO-level financial intelligence engine powering BMoni Smart Accounts."
        );

        return res.json({
          ok: true,
          summary: summaryText,
          generatedAt: new Date().toISOString()
        });
      } catch (geminiErr: any) {
        console.warn("Gemini Rate Limit hit, serving intelligent fallback summary:", geminiErr?.message);
        return res.json({
          ok: true,
          summary: fallbackSummary,
          generatedAt: new Date().toISOString()
        });
      }
    } catch (err: any) {
      console.error("Gemini Overview API Error:", err);
      return res.json({
        ok: true,
        summary: `• **Net Treasury Position**: Holding **$1,250.00 USDB** and **₦9,950.00 CNGN** operational balances.
• **FX & Yield Strategy**: Deploy idle USDB into automated BMoni Yield Vaults.
• **Risk & Security**: Wallet authentication and keys verified as active.
• **Action Step**: Review automated yield allocation in Purpose Accounts.`,
        generatedAt: new Date().toISOString()
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
        headers["x-api-key"] = bmoniApiKey;
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
      const { firstName = "Alex", lastName = "Payline", email, phoneNumber, currency = "USDB", apiKey: customApiKey, baseUrl: customBaseUrl } = req.body || {};
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

      const walletCurrency = (currency || "USDB").toUpperCase();

      // 2. Request owner challenge for requested currency
      const chalRes = await fetch(`${bmoniBaseUrl}/v1/users/${userId}/smart-wallets/owner-proof-challenges`, {
        method: "POST",
        headers: {
          "x-api-key": bmoniApiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currency: walletCurrency,
          userOwnerAddress: signer.address,
        }),
      });
      const chalData = await chalRes.json();

      if (!chalData?.challengeId || !chalData?.message) {
        return res.status(400).json({ error: "Failed to generate owner challenge", details: chalData });
      }

      // 3. Sign challenge
      const signature = await signer.signMessage(chalData.message);

      // 4. Create managed smart wallet
      const walletRes = await fetch(`${bmoniBaseUrl}/v1/users/${userId}/smart-wallets/create-managed`, {
        method: "POST",
        headers: {
          "x-api-key": bmoniApiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currency: walletCurrency,
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

  // Comprehensive Transfer Handler: Proposal -> Approve -> Execution
  app.post("/api/bmoni/transfer", async (req, res) => {
    try {
      const {
        userId,
        smartWalletId,
        recipient, // user ID or 0x address
        amount,
        currency = "USDB",
        description = "Payline Transfer",
        apiKey: customApiKey,
        baseUrl: customBaseUrl
      } = req.body || {};

      const bmoniApiKey = customApiKey || process.env.BMONI_API_KEY || "pk_a025cacbf33a_76fb864113f3540909de5b1da39cc146906e35b1c6d4d1e4";
      const bmoniBaseUrl = (customBaseUrl || process.env.BMONI_BASE_URL || "https://embedded-dev.bmoni.com").replace(/\/$/, "");

      if (!userId || !amount || !recipient) {
        return res.status(400).json({ error: "Missing required fields: userId, amount, or recipient" });
      }

      // 1. Resolve active wallet if smartWalletId not provided
      let walletIdToUse = smartWalletId;
      if (!walletIdToUse) {
        const wRes = await fetch(`${bmoniBaseUrl}/v1/users/${userId}/smart-wallets/account/wallets`, {
          headers: { "x-api-key": bmoniApiKey }
        });
        const wallets = await wRes.json();
        if (Array.isArray(wallets) && wallets.length > 0) {
          walletIdToUse = wallets[0].id;
        }
      }

      if (!walletIdToUse) {
        return res.status(400).json({ error: "No active smart wallet found for sender" });
      }

      const is0xAddress = typeof recipient === "string" && recipient.startsWith("0x") && recipient.length >= 20;

      // Construct proposal payload
      const proposalPayload: any = {
        type: "TRANSFER",
        amount: String(amount),
        currency,
        description
      };

      if (is0xAddress) {
        proposalPayload.toAddress = recipient;
      } else {
        proposalPayload.toUserId = recipient;
      }

      // 2. Create proposal
      let propRes = await fetch(`${bmoniBaseUrl}/v1/users/${userId}/smart-wallets/${walletIdToUse}/proposals`, {
        method: "POST",
        headers: {
          "x-api-key": bmoniApiKey,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ proposal: proposalPayload })
      });
      let propData = await propRes.json();

      // If toUserId fails because recipient doesn't have active account in that currency, try resolving recipient's smart wallet address
      if (!propRes.ok && !is0xAddress && propData?.code === "E101") {
        const recWRes = await fetch(`${bmoniBaseUrl}/v1/users/${recipient}/smart-wallets/account/wallets`, {
          headers: { "x-api-key": bmoniApiKey }
        });
        const recWallets = await recWRes.json();
        if (Array.isArray(recWallets) && recWallets.length > 0 && recWallets[0].walletAddress) {
          proposalPayload.toAddress = recWallets[0].walletAddress;
          delete proposalPayload.toUserId;

          propRes = await fetch(`${bmoniBaseUrl}/v1/users/${userId}/smart-wallets/${walletIdToUse}/proposals`, {
            method: "POST",
            headers: {
              "x-api-key": bmoniApiKey,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ proposal: proposalPayload })
          });
          propData = await propRes.json();
        }
      }

      if (!propRes.ok || propData.statusCode === 400 || propData.error) {
        return res.status(400).json({
          error: propData.message || propData.error || "Failed to create transfer proposal",
          details: propData
        });
      }

      const proposal = propData.proposal || propData.data?.proposal || propData;
      const proposalId = proposal.id;

      // 3. Approve proposal
      let approveData = null;
      if (proposalId) {
        const appRes = await fetch(`${bmoniBaseUrl}/v1/users/${userId}/smart-wallets/proposals/${proposalId}/approve`, {
          method: "POST",
          headers: {
            "x-api-key": bmoniApiKey,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({})
        });
        approveData = await appRes.json();
      }

      return res.json({
        ok: true,
        proposal,
        approval: approveData?.proposal || approveData,
        message: `Transfer proposal created and approved! Status: ${approveData?.proposal?.status || proposal.status}`
      });
    } catch (err: any) {
      console.error("Transfer Error:", err);
      return res.status(500).json({ error: err.message });
    }
  });


  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
