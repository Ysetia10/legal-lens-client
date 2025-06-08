
import React from 'react';
import { X, FileText, AlertTriangle, MessageSquare, Shield } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface AnalysisResult {
  risk_level: string;
  key_clauses: string[];
  summary: string;
  risks: string[];
  [key: string]: any;
}

interface DocumentFullViewProps {
  isOpen: boolean;
  onClose: () => void;
  document: File | null;
  analysisResult: AnalysisResult | null;
  chatHistory: Array<{type: 'user' | 'assistant', message: string}>;
}

const DocumentFullView: React.FC<DocumentFullViewProps> = ({
  isOpen,
  onClose,
  document,
  analysisResult,
  chatHistory
}) => {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Document Analysis - {document?.name}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Document Summary */}
          {analysisResult?.summary && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span>Document Summary</span>
              </h3>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-900">{analysisResult.summary}</p>
              </div>
            </div>
          )}

          {/* Risk Assessment */}
          {analysisResult && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span>Risk Assessment</span>
              </h3>
              <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Overall Risk Level</span>
                  <Badge className={getRiskLevelColor(analysisResult.risk_level)}>
                    {analysisResult.risk_level || 'Unknown'}
                  </Badge>
                </div>
                
                {analysisResult.risks && analysisResult.risks.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-700">Identified Risks:</h4>
                    <ul className="space-y-2">
                      {analysisResult.risks.map((risk, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Key Clauses */}
          {analysisResult?.key_clauses && analysisResult.key_clauses.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span>Key Clauses</span>
              </h3>
              <div className="space-y-2">
                {analysisResult.key_clauses.map((clause, index) => (
                  <div key={index} className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    <p className="text-blue-900">{clause}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Q&A History */}
          {chatHistory.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                <span>Questions & Answers</span>
              </h3>
              <div className="space-y-3 max-h-60 overflow-y-auto border rounded-lg p-3 bg-slate-50">
                {chatHistory.map((chat, index) => (
                  <div key={index} className={`${chat.type === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className={`inline-block p-2 rounded-lg max-w-xs text-sm ${
                      chat.type === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white border text-slate-900'
                    }`}>
                      <div className="font-medium text-xs mb-1">
                        {chat.type === 'user' ? 'You' : 'Assistant'}
                      </div>
                      {chat.message}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentFullView;
