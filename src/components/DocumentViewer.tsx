
import React from 'react';
import { FileText, Download, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DocumentViewerProps {
  document: File | null;
  analysisComplete: boolean;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ document, analysisComplete }) => {
  if (!document) return null;

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileType = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'PDF Document';
      case 'doc':
      case 'docx':
        return 'Word Document';
      case 'txt':
        return 'Text Document';
      default:
        return 'Document';
    }
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span>Document Preview</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Full View
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Document Info */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div>
              <h3 className="font-medium text-slate-900">{document.name}</h3>
              <p className="text-sm text-slate-600">
                {getFileType(document.name)} • {formatFileSize(document.size)}
              </p>
            </div>
            <Badge variant="secondary" className={analysisComplete ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
              {analysisComplete ? "Analyzed" : "Processing"}
            </Badge>
          </div>

          {/* Document Content Preview */}
          <div className="border rounded-lg p-4 bg-white min-h-96">
            {analysisComplete ? (
              <div className="space-y-4">
                <div className="text-center text-slate-500">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                  <h3 className="text-lg font-medium mb-2">Document Analysis Complete</h3>
                  <p className="text-sm">
                    The document has been processed and analyzed. 
                    View the analysis results in the sidebar.
                  </p>
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Ready for backend integration:</strong> This component will display 
                      extracted text, highlighted clauses, and analysis results from your API.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="w-12 h-12 bg-slate-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-slate-400 animate-pulse" />
                  </div>
                  <p className="text-slate-500">Processing document...</p>
                  <p className="text-sm text-slate-400 mt-2">Extracting text and analyzing content</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentViewer;
