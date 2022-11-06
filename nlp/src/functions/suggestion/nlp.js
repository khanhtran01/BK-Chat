// Init Google Cloud Natural Language Api 
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
        // if (category.confidence >= 0.5) {
        // }
        categories.push({name: category.name, rate: category.confidence})
    });
    console.log(categories)
    return categories;
}
