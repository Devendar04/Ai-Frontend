import axios from "axios";
import { resData ,resFile} from "./builderData";
import { parseXml } from "../../step"; // Use the imported parser


export let updateFiles = null;
export async function fetchUpdateData(prompt) {
  try {
    const response = await axios.post(
      `http://localhost:4000/ai/get-results?prompt=${encodeURIComponent(
        resData + prompt
      )}`,
      { prompt }
    );
    if (response.status === 200) {
      const data = parseXml(response.data); // Assuming response is XML or similar
      console.log("Parsed AI Response:", data);
      updateFiles=data;
      return data;
    } else {
      throw new Error("Failed to generate response");
    }
  } catch (error) {
    console.error("Error fetching builder data:", error);
    throw error;
  }
}
