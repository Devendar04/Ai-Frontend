import axios from 'axios';
import {parseXml} from '../../step';


export let resFile = null;
export async function fetchBuilderData(prompt) {

  
  try {
    const response = await axios.post(
      `http://localhost:4000/ai/get-results?prompt=${prompt}`,
      { prompt }
    );
    const Data = parseXml(response.data);
    console.log(Data);
   resFile=Data;
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to generate response');
    }
  } catch (error) {
    console.error('Error fetching builder data:', error);
    throw error;
  }
  // export  resFiles = resFiles;
}
// export const resFile = resFiles;


export const initialSteps = [
  {
    id: 1,
    title: 'Analyzing Prompt',
    description: 'Processing your requirements',
    completed: true,
  },
  {
    id: 2,
    title: 'Creating Project Structure',
    description: 'Setting up files and folders',
    completed: false,
  },
  {
    id: 3,
    title: 'Generating Components',
    description: 'Building UI components',
    completed: false,
  },
  {
    id: 4,
    title: 'Adding Functionality',
    description: 'Implementing features and logic',
    completed: false,
  },
];