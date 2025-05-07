import fs from 'fs';
import path from 'path';

// Add this utility function
const ensureDirectoryExists = (filePath) => {
    const dirname = path.dirname(filePath);
    if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, { recursive: true });
    }
};

// Update your analyzePose function
export const analyzePose = async (filePath, exerciseType = 'squat') => {
    // Ensure the upload directory exists
    const uploadDir = path.join(process.cwd(), 'uploads', 'videos');
    ensureDirectoryExists(path.join(uploadDir, 'temp.txt')); // Just to create dir
    
    const formData = new FormData();
    
    try {
        // Verify file exists before processing
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }
        
        formData.append('video', fs.createReadStream(filePath));
        formData.append('exercise_type', exerciseType);

        const response = await axios.post(`${FLASK_API_URL}/api/motion/analyze`, formData, {
            headers: {
                ...formData.getHeaders(),
                'Content-Length': formData.getLengthSync()
            },
            timeout: 60000
        });
        return response.data;
    } catch (error) {
        console.error('Video analysis error:', error.message);
        throw new Error(`AI service failed: ${error.message}`);
    }
};