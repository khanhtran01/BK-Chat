// Init Google Cloud Natural Language Api 
require("dotenv").config();
const language = require('@google-cloud/language');
const client = new language.LanguageServiceClient();
const classificationModelOptions = {
    v2Model: {
        contentCategoriesVersion: 'V2',
    },
};

async function getClassifies(text) {

    const document = {
        content: text,
        type: 'PLAIN_TEXT',
    };
    // Classifies text in the document
    const [classification] = await client.classifyText({
        document,
        classificationModelOptions,
    });
    const categories = []
    classification.categories.forEach(category => {
        if (category.confidence >= 0.5) {
            categories.push(category.name)
        }
    });
    return categories;
}

module.exports = getClassifies;
