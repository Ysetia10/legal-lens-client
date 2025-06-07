
import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Clock, MessageSquare, FileText, Shield } from 'lucide-react';
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
    
    setChatHistory(prev => [...prev, 
      { type: 'user', message: question },
      { type: 'assistant', message: 'Based on the document analysis, this appears to be a standard clause with low risk. The termination conditions are clearly defined and favor both parties equally.' }
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
                <span>Extracting key clauses...</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                <span>Analyzing risk factors...</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                <span>Simplifying legal language...</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Risk Overview */}
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
              <Badge variant="secondary" className="bg-green-100 text-green-800">Low Risk</Badge>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">Standard termination clauses</span>
              </div>
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span className="text-sm">High penalty fees (Review needed)</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">Clear payment terms</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Clauses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span>Key Clauses</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">Termination Clause</span>
                <Badge variant="outline">Section 8.2</Badge>
              </div>
              <p className="text-sm text-slate-600">
                Either party may terminate with 30 days written notice without cause.
              </p>
            </div>
            
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">Penalty Clause</span>
                <Badge variant="outline" className="bg-amber-100">Section 12.1</Badge>
              </div>
              <p className="text-sm text-slate-600">
                Early termination penalty of 50% of remaining contract value - consider negotiating this down.
              </p>
            </div>
            
            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">Payment Terms</span>
                <Badge variant="outline">Section 4.1</Badge>
              </div>
              <p className="text-sm text-slate-600">
                Net 30 payment terms with 2% early payment discount if paid within 10 days.
              </p>
            </div>
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
              <p className="mb-2">Try asking:</p>
              <ul className="space-y-1">
                <li>• "What are the main risks in this contract?"</li>
                <li>• "Can I terminate this agreement early?"</li>
                <li>• "What are my payment obligations?"</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalysisDashboard;
