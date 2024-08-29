// require('dotenv').config();
// const express = require('express');
// const bodyParser = require('body-parser');
// const path = require('path');
// const { GoogleGenerativeAI } = require('@google/generative-ai');
// const markdownIt = require('markdown-it');
// const DOMPurify = require('dompurify');
// const { JSDOM } = require('jsdom');

// const app = express();
// const port = process.env.PORT || 3000;

// // Initialize Google Generative AI
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// // Middleware
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static('public'));

// // Set EJS as the view engine
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// // Set up DOMPurify with JSDOM
// const { window } = new JSDOM('');
// const domPurify = DOMPurify(window);

// // Initialize markdown-it with options
// const md = markdownIt({
//   html: true,
//   linkify: true,
//   typographer: true
// });

// app.get('/', (req, res) => {
//   res.render('index');
// });

// app.post('/generate-plan', async (req, res) => {
//     const { name, age, addiction, severity, duration, previousAttempts, supportSystem, mentalHealth, physicalHealth, goals } = req.body;

//     const prompt = `Generate a detailed, personalized rehabilitation plan for a ${age}-year-old individual named ${name} dealing with ${addiction} addiction. The severity of the addiction is rated ${severity}/10 and it has lasted for ${duration}. They have had ${previousAttempts} previous rehabilitation attempts. Their support system is described as ${supportSystem}. They have the following mental health concerns: ${mentalHealth}, and physical health concerns: ${physicalHealth}. Their personal goals are: ${goals}.

//     Please provide a comprehensive plan that includes the following sections:
//     1. **Overview of the Situation**: Provide a brief overview of the individual’s current situation, including the context of their addiction and relevant personal details.
//     2. **Recommended Therapy**: Detail the type and frequency of therapy that is recommended, including any specific therapeutic techniques or approaches.
//     3. **Support Groups and Programs**: Suggest relevant support groups, community programs, or networks that could aid in the individual’s recovery.
//     4. **Potential Medications**: List any medications that might be prescribed to manage the addiction or related conditions, if applicable.
//     5. **Lifestyle Changes and Daily Routines**: Recommend specific lifestyle changes, habits, and daily routines that can support the recovery process.
//     6. **Coping Strategies**: Provide strategies to help the individual cope with triggers and cravings associated with their addiction.
//     7. **Rehabilitation Timeline**: Outline a timeline for the rehabilitation process, including key milestones and phases.
//     8. **Milestones and Progress Indicators**: Define milestones and indicators that will help track the individual’s progress throughout their rehabilitation journey.
//     9. **Involving the Support System**: Advise on how to involve the individual’s support system in their recovery, including family, friends, or counselors.
//     10. **Resources for Ongoing Education**: Recommend resources for further education about addiction and recovery, such as books, websites, or organizations.

//     Format the response in markdown, ensuring each section is clearly labeled with its corresponding number and title. Use bullet points or numbered lists where appropriate for clarity.`;

//     try {
//         console.log('Sending prompt to model...');
//         const result = await model.generateContent([prompt]);
//         console.log('API response:', result);

//         const planMarkdown = result.response.text();
//         console.log('Generated plan markdown:', planMarkdown);

//         // Convert entire markdown to HTML and sanitize
//         const planHTML = md.render(planMarkdown);
//         const sanitizedPlanHTML = domPurify.sanitize(planHTML);

//         // Send the sanitized HTML to the view
//         res.render('plan', { plan: sanitizedPlanHTML, userInput: req.body });
//     } catch (error) {
//         console.error('Error generating content with Google Generative AI:', error);
//         res.render('error', { message: 'An error occurred while generating your plan. Please try again.' });
//     }
// });

// app.listen(port, () => {
//     console.log(`Server running at http://localhost:${port}`);
// });

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const markdownIt = require('markdown-it');
const DOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const util = require('util');

const app = express();
const port = process.env.PORT || 3000;

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Set up DOMPurify with JSDOM
const { window } = new JSDOM('');
const domPurify = DOMPurify(window);

// Initialize markdown-it with options
const md = markdownIt({
  html: true,
  linkify: true,
  typographer: true
});

const plans = {}; // Temporary storage for plans
const inquiries = {}; // Temporary storage for inquiries

// Route to render the form
app.get('/', (req, res) => {
  res.render('index');
});

// Route to generate the plan
app.post('/generate-plan', async (req, res) => {
    const { name, age, addiction, severity, duration, previousAttempts, supportSystem, mentalHealth, physicalHealth, goals } = req.body;

    const prompt = `Generate a detailed, personalized rehabilitation plan for a ${age}-year-old individual named ${name} dealing with ${addiction} addiction. The severity of the addiction is rated ${severity}/10 and it has lasted for ${duration}. They have had ${previousAttempts} previous rehabilitation attempts. Their support system is described as ${supportSystem}. They have the following mental health concerns: ${mentalHealth}, and physical health concerns: ${physicalHealth}. Their personal goals are: ${goals}.

    Please provide a comprehensive plan that includes the following sections:
    1. **Overview of the Situation**: Provide a brief overview of the individual’s current situation, including the context of their addiction and relevant personal details.
    2. **Recommended Therapy**: Detail the type and frequency of therapy that is recommended, including any specific therapeutic techniques or approaches.
    3. **Support Groups and Programs**: Suggest relevant support groups, community programs, or networks that could aid in the individual’s recovery.
    4. **Potential Medications**: List any medications that might be prescribed to manage the addiction or related conditions, if applicable.
    5. **Lifestyle Changes and Daily Routines**: Recommend specific lifestyle changes, habits, and daily routines that can support the recovery process.
    6. **Coping Strategies**: Provide strategies to help the individual cope with triggers and cravings associated with their addiction.
    7. **Rehabilitation Timeline**: Outline a timeline for the rehabilitation process, including key milestones and phases.
    8. **Milestones and Progress Indicators**: Define milestones and indicators that will help track the individual’s progress throughout their rehabilitation journey.
    9. **Involving the Support System**: Advise on how to involve the individual’s support system in their recovery, including family, friends, or counselors.
    10. **Resources for Ongoing Education**: Recommend resources for further education about addiction and recovery, such as books, websites, or organizations.

    Format the response in markdown, ensuring each section is clearly labeled with its corresponding number and title. Use bullet points or numbered lists where appropriate for clarity.`;

    try {
        console.log('Sending prompt to model...');
        const result = await model.generateContent([prompt]);
        console.log('API response:', result);

        const planMarkdown = result.response.text();
        console.log('Generated plan markdown:', planMarkdown);

        // Convert entire markdown to HTML and sanitize
        const planHTML = md.render(planMarkdown);
        const sanitizedPlanHTML = domPurify.sanitize(planHTML);

        // Store the plan for future reference
        plans[req.sessionID] = sanitizedPlanHTML;

        // Send the sanitized HTML to the view
        res.render('plan', { plan: sanitizedPlanHTML, userInput: req.body });
    } catch (error) {
        console.error('Error generating content with Google Generative AI:', error);
        res.render('error', { message: 'An error occurred while generating your plan. Please try again.' });
    }
});
app.get("/inquire-plan",async(req,res)=>{
    res.render("inquiry");
})
// Route to handle inquiries about specific sections
app.post('/inquire-plan', async (req, res) => {
    const { question } = req.body;
    const plan = plans[req.sessionID];

    if (!plan) {
        return res.status(404).send('Plan not found. Please generate the plan first.');
    }

    const prompt = `Based on the following rehabilitation plan, answer the question: ${question}\n\nPlan:\n${plan}`;

    try {
        console.log('Sending inquiry prompt to model...');
        const result = await model.generateContent([prompt]);
        console.log('API response:', result);

        const responseText = result.response.text();
        console.log('Inquiry response:', responseText);

        // Save the response to a text file
        const fileName = 'inquiry-response.txt';
        const filePath = path.join(__dirname, 'public', fileName);
        fs.writeFile(filePath, responseText, 'utf8', (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return res.status(500).send('An error occurred while preparing the file for download.');
            }

            // Send the file for download
            res.download(filePath, fileName, (err) => {
                if (err) {
                    console.error('Error sending file:', err);
                    res.status(500).send('An error occurred while sending the file.');
                } else {
                    // Clean up the file after download
                    fs.unlink(filePath, (err) => {
                        if (err) console.error('Error deleting file:', err);
                    });
                }
            });
        });
    } catch (error) {
        console.error('Error generating content with Google Generative AI:', error);
        res.render('error', { message: 'An error occurred while handling your inquiry. Please try again.' });
    }
});

// Route to update the plan with new details
app.post('/update-plan', async (req, res) => {
    const { newDetails } = req.body;

    // Regenerate plan with new details
    try {
        const prompt = `Update the existing plan with the following details: ${newDetails}`;
        const result = await model.generateContent([prompt]);
        const updatedPlanMarkdown = result.response.text();
        const updatedPlanHTML = md.render(updatedPlanMarkdown);
        const sanitizedUpdatedPlanHTML = domPurify.sanitize(updatedPlanHTML);

        plans[req.sessionID] = sanitizedUpdatedPlanHTML;
        res.render('plan', { plan: sanitizedUpdatedPlanHTML, userInput: req.body });
    } catch (error) {
        console.error('Error updating content with Google Generative AI:', error);
        res.render('error', { message: 'An error occurred while updating your plan. Please try again.' });
    }
});

// Route to download the plan
app.get('/download-plan', (req, res) => {
    const plan = plans[req.sessionID];

    if (!plan) {
        return res.status(404).send('Plan not found. Please generate the plan first.');
    }

    // Convert HTML to a file and send it as a download
    const fileName = 'rehabilitation-plan.html';
    const filePath = path.join(__dirname, 'public', fileName);

    fs.writeFile(filePath, plan, 'utf8', (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return res.status(500).send('An error occurred while preparing the file for download.');
        }

        res.download(filePath, fileName, (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).send('An error occurred while sending the file.');
            } else {
                // Clean up the file after download
                fs.unlink(filePath, (err) => {
                    if (err) console.error('Error deleting file:', err);
                });
            }
        });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
