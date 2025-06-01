'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, ThumbsUp, ThumbsDown, Sparkles } from 'lucide-react';
import axios from 'axios';

interface SentimentResult {
  label: string;
  score: number;
}

export default function Home() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [loading, setLoading] = useState(false);


  const analyzeSentiment = async () => {
    try {
      setLoading(true);
      setResult(null);
  
      const response = await axios.post('http://localhost:5000/', 
        new URLSearchParams({ text }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
  
      if (response.data) {
        setResult({
          label: response.data.label,
          score: response.data.score,
        });
      }
    } catch (error) {
      console.error("Error analyzing sentiment:", error);
    } finally {
      setLoading(false);
    }
  };
  

  const getSentimentColor = (label: string) => {
    return label === 'POSITIVE' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200';
  };

  const getSentimentIcon = (label: string) => {
    return label === 'POSITIVE' ? <ThumbsUp className="w-4 h-4" /> : <ThumbsDown className="w-4 h-4" />;
  };

  const exampleReviews = [
    "This product is absolutely amazing! I love it so much.",
    "Terrible quality, completely disappointed with my purchase.",
    "The service was okay, nothing special but not bad either.",
    "Outstanding customer support and fast delivery. Highly recommended!",
    "Waste of money. The product broke after just one day."
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Sentiment Analyzer
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Analyze the sentiment of reviews and text using AI-powered machine learning
          </p>
        </div>

        <Card className="mb-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Text Analysis
            </CardTitle>
            <CardDescription>
              Enter a review or any text to analyze its sentiment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter your review or text here..."
              value={text}
              onChange={(e:any) => setText(e.target.value)}
              className="min-h-[120px] resize-none border-gray-200 focus:border-purple-400 focus:ring-purple-400"
            />
            
            <div className="flex gap-3">
              <Button 
                onClick={analyzeSentiment}
                disabled={!text.trim() || loading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6"
              >
               {loading ? (
  <>
    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
    Analyzing...
  </>
) : (
  'Analyze Sentiment'
)}

              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => {setText(''); setResult(null);}}
                className="border-gray-300 hover:border-gray-400"
              >
                Clear
              </Button>
            </div>

            {result && (
              <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 border">
                <h3 className="font-semibold mb-3 text-gray-800">Analysis Result:</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge className={`${getSentimentColor(result.label)} px-3 py-1 font-medium`}>
                      <span className="flex items-center gap-1">
                        {getSentimentIcon(result.label)}
                        {result.label}
                      </span>
                    </Badge>
                    <span className="text-gray-600">
                      Confidence: {(result.score * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        result.label === 'POSITIVE' ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${result.score * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Try These Examples</CardTitle>
            <CardDescription>
              Click on any example below to test the sentiment analyzer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {exampleReviews.map((review, index) => (
                <button
                  key={index}
                  onClick={() => setText(review)}
                  className="text-left p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 text-gray-700 hover:text-gray-900"
                >
                  "{review}"
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {loading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="p-6 m-4">
              <div className="flex items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                <div>
                  <h3 className="font-semibold">Loading AI Model</h3>
                  <p className="text-sm text-gray-600">Please wait while we initialize the sentiment analysis model...</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
