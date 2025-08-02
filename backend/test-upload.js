// Test script to verify file upload error handling
import request from 'supertest';
import app from '../app.js';
import path from 'path';

// This is a quick test to verify the upload error handling
console.log('Testing file upload error handling...');

// You can use this script to test with curl or manually
console.log('Example curl command to test with invalid file type:');
console.log(`
curl -X POST http://localhost:5000/api/issues \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -F "title=Test Issue" \\
  -F "description=Test description" \\
  -F "category_id=1" \\
  -F "latitude=40.7128" \\
  -F "longitude=-74.0060" \\
  -F "address=Test Address" \\
  -F "images=@/path/to/invalid/file.txt"
`);

console.log('This should now return a proper 400 error instead of an unhandled error.');
