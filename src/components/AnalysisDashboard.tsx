
import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Clock, MessageSquare, FileText, Shield, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';

interface AnalysisDashboardProps {
  document: File | null;
  analysisComplete: boolean;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ document, analysisComplete }) => {
  const [progress, setProgress] = useState(0);
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{type: 'user' | 'assistant', message: string}>>([]);

  useEffect(() => {
    if (document && !analysisComplete) {
      const interval = setInterval(() => {
        setProgress(prev => prev < 90 ? prev + 10 : prev);
      }, 200);
      
      return () => clearInterval(interval);
    } else if (analysisComplete) {
      setProgress(100);
    }
  }, [document, analysisComplete]);

  const handleAskQuestion = () => {
    if (!question.trim()) return;
    
    // This will be replaced with actual API call to backend
    setChatHistory(prev => [...prev, 
      { type: 'user', message: question },
      { type: 'assistant', message: 'This response will come from your backend API. Connect your document analysis service to provide real answers.' }
    ]);
    setQuestion('');
  };

  if (!analysisComplete) {
    return (
      <Card className="sticky top-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span>Analyzing Document...</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={progress} className="w-full" />
            <div className="text-sm text-slate-600 space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                <span>Extracting text content...</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                <span>Identifying key clauses...</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                <span>Analyzing risks and terms...</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Backend Integration Notice */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">Ready for Backend Integration</h3>
              <p className="text-sm text-blue-800">
                Connect your document analysis API to populate real data in the sections below.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Overview - Ready for dynamic data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-green-600" />
            <span>Risk Assessment</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Risk Level</span>
              <Badge variant="secondary" className="bg-slate-100 text-slate-600">Pending Analysis</Badge>
            </div>
            
            <div className="text-center py-8 text-slate-500">
              <Shield className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="font-medium mb-2">Risk analysis will appear here</p>
              <p className="text-sm">Connect your backend to display risk assessment results</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Clauses - Ready for dynamic data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span>Key Clauses</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-slate-500">
            <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="font-medium mb-2">Key clauses will be extracted here</p>
            <p className="text-sm">Your backend will identify and highlight important document sections</p>
          </div>
        </CardContent>
      </Card>

      {/* Q&A Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-purple-600" />
            <span>Ask Questions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Chat History */}
            {chatHistory.length > 0 && (
              <div className="max-h-48 overflow-y-auto space-y-3 border rounded-lg p-3 bg-slate-50">
                {chatHistory.map((chat, index) => (
                  <div key={index} className={`${chat.type === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className={`inline-block p-2 rounded-lg max-w-xs text-sm ${
                      chat.type === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white border text-slate-900'
                    }`}>
                      {chat.message}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Question Input */}
            <div className="space-y-3">
              <Textarea
                placeholder="Ask a question about this document..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="resize-none"
                rows={3}
              />
              <Button 
                onClick={handleAskQuestion}
                disabled={!question.trim()}
                className="w-full"
              >
                Ask Question
              </Button>
            </div>
            
            {/* Suggested Questions */}
            <div className="text-xs text-slate-500">
              <p className="mb-2">Example questions to try:</p>
              <ul className="space-y-1">
                <li>• "What are the main risks in this contract?"</li>
                <li>• "Can I terminate this agreement early?"</li>
                <li>• "What are my payment obligations?"</li>
                <li>• "Are there any unusual clauses I should be aware of?"</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalysisDashboard;
