
import React from 'react';
import { FileText, Download, Eye, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AnalysisResult {
  risk_level: string;
  key_clauses: string[];
  summary: string;
  risks: string[];
  [key: string]: any;
}

interface DocumentViewerProps {
  document: File | null;
  analysisComplete: boolean;
  analysisResult: AnalysisResult | null;
  isAnalyzing: boolean;
  error: string | null;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ 
  document, 
  analysisComplete, 
  analysisResult, 
  isAnalyzing, 
  error 
}) => {
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

  const getStatusBadge = () => {
    if (error) {
      return <Badge variant="destructive" className="bg-red-100 text-red-800">Error</Badge>;
    }
    if (isAnalyzing) {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Processing</Badge>;
    }
    if (analysisComplete) {
      return <Badge variant="secondary" className="bg-green-100 text-green-800">Analyzed</Badge>;
    }
    return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Uploaded</Badge>;
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
            {getStatusBadge()}
          </div>

          {/* Document Content Preview */}
          <div className="border rounded-lg p-4 bg-white min-h-96">
            {error ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
                  <h3 className="text-lg font-medium mb-2 text-red-700">Analysis Failed</h3>
                  <p className="text-sm text-red-600">{error}</p>
                  <p className="text-xs text-gray-500 mt-2">Please try uploading the document again</p>
                </div>
              </div>
            ) : isAnalyzing ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 mx-auto mb-4 text-blue-500 animate-spin" />
                  <h3 className="text-lg font-medium mb-2">Analyzing Document...</h3>
                  <p className="text-sm text-slate-600">Processing your document with AI</p>
                </div>
              </div>
            ) : analysisComplete && analysisResult ? (
              <div className="space-y-6">
                <div className="text-center">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                  <h3 className="text-lg font-medium mb-2">Analysis Complete</h3>
                </div>
                
                {/* Summary */}
                {analysisResult.summary && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Document Summary</h4>
                    <p className="text-sm text-blue-800">{analysisResult.summary}</p>
                  </div>
                )}

                {/* Key Clauses */}
                {analysisResult.key_clauses && analysisResult.key_clauses.length > 0 && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Key Clauses Identified</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {analysisResult.key_clauses.map((clause, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-blue-600">•</span>
                          <span>{clause}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <h3 className="text-lg font-medium mb-2">Document Uploaded</h3>
                  <p className="text-sm text-slate-600">Ready for analysis</p>
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
