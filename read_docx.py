import zipfile
import xml.etree.ElementTree as ET
import sys

def read_docx(path):
    text = []
    with zipfile.ZipFile(path) as docx:
        tree = ET.fromstring(docx.read('word/document.xml'))
        namespaces = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        for paragraph in tree.findall('.//w:p', namespaces):
            para_text = ''.join([node.text for node in paragraph.findall('.//w:t', namespaces) if node.text])
            if para_text:
                text.append(para_text)
    return '\n'.join(text)

try:
    print(read_docx(sys.argv[1]))
except Exception as e:
    print("Error:", e)
