
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
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Analyzed
            </Badge>
          </div>

          {/* Document Content Preview */}
          <div className="border rounded-lg p-4 bg-white min-h-96">
            {analysisComplete ? (
              <div className="space-y-4">
                <div className="text-sm font-medium text-slate-900 border-b pb-2">
                  SERVICE AGREEMENT
                </div>
                
                <div className="prose prose-sm max-w-none text-slate-700 space-y-4">
                  <p>
                    This Service Agreement ("Agreement") is entered into on [DATE] between [COMPANY NAME], 
                    a corporation organized under the laws of [STATE] ("Company"), and [CLIENT NAME] ("Client").
                  </p>
                  
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-3 my-4">
                    <p className="text-sm font-medium text-blue-900 mb-1">Key Clause Identified</p>
                    <p className="text-sm text-blue-800">
                      <strong>Section 4.1 - Payment Terms:</strong> Client agrees to pay Company within thirty (30) days 
                      of invoice date. A 2% early payment discount applies if payment is received within ten (10) days.
                    </p>
                  </div>
                  
                  <p>
                    The Company agrees to provide consulting services as outlined in Exhibit A attached hereto 
                    and incorporated by reference. Services shall commence on [START DATE] and continue through 
                    [END DATE] unless terminated earlier in accordance with this Agreement.
                  </p>
                  
                  <div className="bg-amber-50 border-l-4 border-amber-400 p-3 my-4">
                    <p className="text-sm font-medium text-amber-900 mb-1">Risk Alert</p>
                    <p className="text-sm text-amber-800">
                      <strong>Section 12.1 - Termination Penalty:</strong> Early termination by Client requires 
                      payment of 50% of remaining contract value. Consider negotiating this percentage down.
                    </p>
                  </div>
                  
                  <p>
                    Either party may terminate this Agreement with thirty (30) days written notice. Upon termination, 
                    Company shall deliver all work product and materials to Client, and Client shall pay all 
                    outstanding fees for services rendered.
                  </p>
                  
                  <div className="bg-green-50 border-l-4 border-green-400 p-3 my-4">
                    <p className="text-sm font-medium text-green-900 mb-1">Standard Clause</p>
                    <p className="text-sm text-green-800">
                      <strong>Section 8.2 - Termination Rights:</strong> Standard 30-day notice period for termination 
                      without cause. This is fair and typical for this type of agreement.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="w-12 h-12 bg-slate-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-slate-500">Processing document...</p>
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
