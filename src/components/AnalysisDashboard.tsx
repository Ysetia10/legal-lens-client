import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Clock, MessageSquare, FileText, Shield, Info, Loader2, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';

interface AnalysisResult {
  risk_level: string;
  key_clauses: string[];
  summary: string;
  risks: string[];
  [key: string]: any;
}

interface AnalysisDashboardProps {
  document: File | null;
  analysisComplete: boolean;
  analysisResult: AnalysisResult | null;
  isAnalyzing: boolean;
  error: string | null;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ 
  document, 
  analysisComplete, 
  analysisResult, 
  isAnalyzing, 
  error 
}) => {
  const [progress, setProgress] = useState(0);
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{type: 'user' | 'assistant', message: string}>>([]);
  const [isAskingQuestion, setIsAskingQuestion] = useState(false);

  useEffect(() => {
    if (isAnalyzing) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(prev => prev < 90 ? prev + 10 : prev);
      }, 200);
      
      return () => clearInterval(interval);
    } else if (analysisComplete) {
      setProgress(100);
    }
  }, [isAnalyzing, analysisComplete]);

  const handleAskQuestion = async () => {
    if (!question.trim() || !document || !analysisComplete) return;
    
    setIsAskingQuestion(true);
    
    // Add user question to chat
    setChatHistory(prev => [...prev, { type: 'user', message: question }]);
    
    try {
      const formData = new FormData();
      formData.append('file', document);
      formData.append('question', question);

      const response = await fetch('http://localhost:8081/api/analyse/answer', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const answer = await response.text();
      console.log('Q&A answer:', answer);
      
      // Add assistant response to chat
      setChatHistory(prev => [...prev, {
        type: 'assistant',
        message: answer
      }]);
    } catch (err) {
      console.error('Q&A failed:', err);
      setChatHistory(prev => [...prev, {
        type: 'assistant',
        message: 'Sorry, I encountered an error while processing your question. Please try again.'
      }]);
    } finally {
      setIsAskingQuestion(false);
    }
    
    setQuestion('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAskQuestion();
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (error) {
    return (
      <Card className="sticky top-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            <span>Analysis Error</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-600">{error}</p>
          <p className="text-xs text-gray-500 mt-2">Please try uploading the document again</p>
        </CardContent>
      </Card>
    );
  }

  if (isAnalyzing) {
    return (
      <Card className="sticky top-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
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

  if (!analysisComplete || !analysisResult) {
    return (
      <Card className="sticky top-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-gray-600" />
            <span>Waiting for Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">Upload a document to begin analysis</p>
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
              <Badge className={getRiskLevelColor(analysisResult.risk_level)}>
                {analysisResult.risk_level || 'Unknown'}
              </Badge>
            </div>
            
            {analysisResult.risks && analysisResult.risks.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Identified Risks:</h4>
                <ul className="space-y-1">
                  {analysisResult.risks.map((risk, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
          {analysisResult.key_clauses && analysisResult.key_clauses.length > 0 ? (
            <div className="space-y-2">
              {analysisResult.key_clauses.map((clause, index) => (
                <div key={index} className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <p className="text-sm text-blue-900">{clause}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No key clauses identified</p>
            </div>
          )}
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
                {isAskingQuestion && (
                  <div className="text-left">
                    <div className="inline-block p-2 rounded-lg bg-white border text-slate-900">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Question Input */}
            <div className="flex space-x-2">
              <Textarea
                placeholder="Ask a question about this document..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyPress={handleKeyPress}
                className="resize-none flex-1"
                rows={3}
                disabled={isAskingQuestion}
              />
              <Button 
                onClick={handleAskQuestion}
                disabled={!question.trim() || isAskingQuestion}
                size="sm"
                className="self-end"
              >
                {isAskingQuestion ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
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
