const express = require("express");
const router = express.Router();

const { authenticate, allVideos, video, upload } = require("./controllers");
// register
router.get("/auth", async (req, res) => {
  const response = await authenticate(req);
  res.status(response.code).send(response);
});

router.get("/conversations", async (req, res) => {
  const response = await allVideos(req);
  res.status(response.code).send(response);
});

router.get("/conversation/:conversationId", async (req, res) => {
  const response = await video(req);
  res.status(response.code).send(response);
});

router.post("/upload", async (req, res) => {
    const response = await upload(req);
    res.status(response.code).send(response);
  });

module.exports = router;
