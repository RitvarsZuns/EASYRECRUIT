import PyPDF2
import docx
import io

def get_text_from_file(file_content, file_type) -> str:
    """Extract text from a file based on its extension.
    
    Args:
        file_content (bytes): The content of the file.
        file_type (str): The file type (e.g. application/pdf).
    
    Returns:
        str: The extracted text from the file.
    """
    if file_type == 'text/plain':
        return file_content.decode('utf-8')
    elif file_type == 'application/pdf':
        file_stream = io.BytesIO(file_content)
        reader = PyPDF2.PdfReader(file_stream)
        text = ''
        for page in reader.pages:
            text += page.extract_text()
        return text
    elif file_type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        file_stream = io.BytesIO(file_content)
        doc = docx.Document(file_stream)
        text = ''
        for para in doc.paragraphs:
            text += para.text + '\n'
        return text
    else:
        raise ValueError("Unsupported file type (not .txt, .pdf, or .docx)")