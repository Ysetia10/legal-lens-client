
import React, { useState, useRef } from 'react';
import { Upload, FileText, AlertTriangle, CheckCircle, MessageSquare } from 'lucide-react';
import DocumentUpload from '../components/DocumentUpload';
import AnalysisDashboard from '../components/AnalysisDashboard';
import DocumentViewer from '../components/DocumentViewer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  const [uploadedDocument, setUploadedDocument] = useState<File | null>(null);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDocumentUpload = (file: File) => {
    setUploadedDocument(file);
    // Simulate analysis completion after a delay
    setTimeout(() => {
      setAnalysisComplete(true);
    }, 2000);
  };

  const handleHeaderUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleDocumentUpload(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">LegalLens</h1>
                <p className="text-sm text-slate-600">Intelligent Legal Document Analysis</p>
              </div>
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileInputChange}
                accept=".pdf,.doc,.docx,.txt"
              />
              <Button variant="outline" className="flex items-center space-x-2" onClick={handleHeaderUploadClick}>
                <Upload className="w-4 h-4" />
                <span>Upload Document</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!uploadedDocument ? (
          /* Welcome Section */
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Simplify Legal Document Analysis
            </h2>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Upload contracts, agreements, or any legal document and get instant analysis with 
              key clause extraction, risk assessment, and plain English explanations.
            </p>
            
            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="border-slate-200 hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">Key Clause Extraction</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">
                    Automatically identify and highlight the most important clauses and terms in your legal documents.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-slate-200 hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-amber-600" />
                  </div>
                  <CardTitle className="text-lg">Risk Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">
                    Identify potential risks and flag unusual or concerning terms that require attention.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-slate-200 hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">Plain English</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">
                    Get complex legal jargon translated into clear, understandable language.
                  </p>
                </CardContent>
              </Card>
            </div>

            <DocumentUpload onUpload={handleDocumentUpload} />
          </div>
        ) : (
          /* Analysis Interface */
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <DocumentViewer 
                document={uploadedDocument} 
                analysisComplete={analysisComplete}
              />
            </div>
            <div className="lg:col-span-1">
              <AnalysisDashboard 
                document={uploadedDocument}
                analysisComplete={analysisComplete}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
