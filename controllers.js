const axios = require("axios");

const apiClient = axios.create({
  baseURL: `https://api.symbl.ai`,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  },
});

// apiClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("x-auth-token");
//     // if (token) {
//     //   config.headers["authorization"] = `Bearer ${token}`;
//     // }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

async function authenticate(req) {
  try {
    const response = await apiClient.post("/oauth2/token:generate", {
      type: "application",
      appId: process.env.APP_ID,
      appSecret: process.env.APP_SECRET,
    });
    console.log(req.headers.token);
    return {
      code: 200,
      message: "Successfully registered",
      token: response.data.accessToken,
    };
  } catch (err) {
    console.log(err);
    return { code: 400, message: "Cannot register" };
  }
}

async function allVideos(req) {
  console.log(req.headers.token);
  try {
    apiClient.defaults.headers.common[
      "authorization"
    ] = `Bearer ${req.headers.token}`;
    const response = await apiClient.get("/v1/conversations");
    return {
      code: 200,
      videos: response.data.conversations,
    };
  } catch (err) {
    console.log(err);
    return { code: 400, message: "Cannot register" };
  }
}
async function video(req) {
  const { conversationId } = req.params;
  try {
    apiClient.defaults.headers.common[
      "authorization"
    ] = `Bearer ${req.headers.token}`;

    const resSummary = await apiClient.get(
      `v1/conversations/${conversationId}/summary`
    );

    const resTranscript = await apiClient.post(
      `v1/conversations/${conversationId}/transcript`,
      { contentType: "text/srt", showSpeakerSeparation: true }
    );
    const resQuestions = await apiClient.get(
      `v1/conversations/${conversationId}/questions`
    );
    const resVideo = await apiClient.get(`/v1/conversations/${conversationId}`);
    const resAnalytics = await apiClient.get(
      `/v1/conversations/${conversationId}/analytics`
    );
    const resActionItems = await apiClient.get(
      `/v1/conversations/${conversationId}/action-items`
    );
    const followUps = await apiClient.get(
      `/v1/conversations/${conversationId}/follow-ups`
    );
    const topics = await apiClient.get(
      `/v1/conversations/${conversationId}/topics`
    );
    const trackers = await apiClient.get(
      `/v1/conversations/${conversationId}/trackers`
    );

    return {
      code: 200,
      summary: resSummary.data.summary,
      transcript: resTranscript.data.transcript.payload,
      questions: resQuestions.data.questions,
      video: resVideo.data,
      analytics: resAnalytics.data,
      actionitems: resActionItems.data,
      followups: followUps.data,
      topics: topics.data,
      trackers: trackers.data,
    };
  } catch (err) {
    console.log(err);
    return { code: 400, message: "Cannot register" };
  }
}

const symblaiMarketingParams = {
  confidenceThreshold: 0.7,
  customVocabulary: ["marketing director", "meeting", "customer"],
  detectEntities: true,
  entities: [
    {
      customType: "executives",
      text: "marketing director",
    },
  ],
  detectPhrases: true,
  enableAllTrackers: true,
  trackers: [
    {
      name: "gratitude",
      vocabulary: [
        "thanks",
        "thank you",
        "thank you for your time",
        "i appreciate it",
        "we apppreciate it",
      ],
    },
  ],
  enableSpeakerDiarization: true,
  diarizationSpeakerCount: 3,
  enableSummary: true,
  languageCode: "en-US",
  mode: "default",
};

const symblaiSalesParams = {
  confidenceThreshold: 0.7,
  customVocabulary: [
    "sales representative",
    "purchase",
    "order",
    "invoice",
    "discount",
    "deal",
    "customer",
    "product",
  ],
  detectEntities: true,
  entities: [
    {
      customType: "roles",
      text: "sales representative",
    },
    {
      customType: "actions",
      text: "purchase",
    },
  ],
  detectPhrases: true,
  enableAllTrackers: true,
  trackers: [
    {
      name: "sales objections",
      vocabulary: [
        "too expensive",
        "not interested",
        "already have one",
        "need to think about it",
      ],
    },
    {
      name: "confirmation",
      vocabulary: [
        "I'll take it",
        "let's finalize the deal",
        "send the invoice",
      ],
    },
    {
      name: "customer interests",
      vocabulary: ["can you tell me more", "interested in", "how does it work"],
    },
  ],
  enableSpeakerDiarization: true,
  diarizationSpeakerCount: 2, // Assuming a sales call typically involves a sales rep and a potential buyer.
  enableSummary: true,
  languageCode: "en-US",
  mode: "default",
};

async function upload(req) {
  const { url, name } = req.body;
  try {
    apiClient.defaults.headers.common[
      "authorization"
    ] = `Bearer ${req.headers.token}`;

    const res = await apiClient.post(`/v1/process/video/url`, {
      url,
      name,
      ...symblaiSalesParams,
     // mode: url,
    });

    return {
      code: 200,
      data: res.data,
    };
  } catch (err) {
    console.log(err);
    return {
      code: 400,
      message: err.response.data.message || "Cannot upload video",
    };
  }
}

module.exports = { authenticate, allVideos, video, upload };
