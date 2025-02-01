import mammoth from 'mammoth';
import { PDFExtract } from 'pdf.js-extract';

export const extractFormattedText = async (file) => {
    let html = '';
    console.log('extract');
    
    switch(file.mimetype) {
        case 'application/pdf':
            const pdfExtract = new PDFExtract();
            const options = {}; 
            
            try {
                const data = await pdfExtract.extractBuffer(file.buffer, options);
                const text = data.pages
                    .map(page => page.content
                        .map(item => item.str)
                        .join(' '))
                    .join('\n\n');
                        
                html = convertToStructuredHTML(text);
                console.log('extracthtml', html);
            } catch (error) {
                console.error('PDF extraction failed:', error);
                throw new Error('Failed to extract PDF content');
            }
            break;
            
        case 'application/msword':
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            const docResult = await mammoth.convertToHtml({ buffer: file.buffer });
            html = docResult.value;
            break;
            
        default:
            throw new Error('Unsupported file type');
    }

    return html;
};

const convertToStructuredHTML = (text) => {
    console.log('here', text);
    
    const paragraphs = text.split('\n\n');

    // Process paragraphs
    const structuredParagraphs = paragraphs.map(para => {
        if (para.trim().length < 50 && para.toUpperCase() === para.trim()) {
            return `<h3>${para.trim()}</h3>`;
        }

        if (para.trim().startsWith('•') || para.trim().startsWith('-')) {
            const items = para.split(/\n*[•-]\s*/);
            return `<ul>${items.filter(item => item.trim()).map(item => `<li>${item.trim()}</li>`).join('')}</ul>`;
        }

        // Regular paragraph
        return `<p>${para.trim()}</p>`;
    });

    return structuredParagraphs.join('\n');
};
