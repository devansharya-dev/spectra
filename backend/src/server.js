import app from "./app.js";

const PORT = process.env.PORT;

if (!PORT) {
  throw new Error("PORT is not defined by Azure");
}

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
