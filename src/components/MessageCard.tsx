'use client'

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { X, Clipboard } from 'lucide-react';
import { Message } from '@/model/User';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ApiResponse } from '@/types/ApiResponse';

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

export function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const { toast } = useToast();
  const [codeType, setCodeType] = useState<'html' | 'react'>('html');

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );
      toast({
        title: response.data.message,
      });
      onMessageDelete(message._id);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to delete message',
        variant: 'destructive',
      });
    }
  };

  const getTemplateCode = () => {
    if (codeType === 'html') {
      return `
<div class="message-card" style="border: 1px solid #ccc; border-radius: 8px; padding: 16px; background-color: #f9f9f9;">
        <div class="card-header">
            ${message.senderName ? `<p class="text-sm font-semibold">${message.senderName}</p>` : ''}
            ${message.stars ? `<div class="stars" style="color: goldenrod ; font-size: 1.25rem;">${'★'.repeat(message.stars)}</div>` :''}
          <h3 style="margin: 0; font-size: 1.25rem; color: #333;">${message.content}</h3>
          <p style="margin: 8px 0 0 0; font-size: 0.875rem; color: #666;">${dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}</p>
        </div>
    </div>
      `;
    } else {
      return `
 <div className="message-card" style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', backgroundColor: '#f9f9f9' }}>
      <div className="card-header">
        {message.senderName && (
          <p className="text-sm font-semibold">{message.senderName}</p>
        )}
        {message.stars && (
          <div className="stars" style={{ color: 'gold', fontSize: '1.25rem' }}>
            {'★'.repeat(message.stars)}
          </div>
        )}
        <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#333' }}>
          {message.content}
        </h3>
        <p style={{ margin: '8px 0 0 0', fontSize: '0.875rem', color: '#666' }}>
          {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
        </p>
      </div>
    </div>
      `;
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getTemplateCode());
    toast({
      title: 'Code Copied',
      description: `The ${codeType.toUpperCase()} template code has been copied to your clipboard.`,
    });
  };

  return (
    <Card className="card-bordered">
      <CardHeader>
        <div className="flex justify-between items-center">
          <Dialog>
            <DialogTrigger asChild>
              <div className="cursor-pointer">
                {message.senderName && (
                  <div className="flex items-center">
                    <p className="text-sm font-semibold">{message.senderName}</p>
                    {message.stars && (
                      <div className="flex ml-2">
                        {Array.from({ length: message.stars }, (_, i) => (
                          <svg
                            key={i}
                            className="w-4 h-4 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.357 4.182a1 1 0 00.95.69h4.392c.969 0 1.371 1.24.588 1.81l-3.557 2.586a1 1 0 00-.364 1.118l1.357 4.182c.3.921-.755 1.688-1.54 1.118l-3.557-2.586a1 1 0 00-1.175 0l-3.557 2.586c-.785.57-1.84-.197-1.54-1.118l1.357-4.182a1 1 0 00-.364-1.118L2.707 9.61c-.783-.57-.38-1.81.588-1.81h4.392a1 1 0 00.95-.69l1.357-4.182z" />
                          </svg>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                <CardTitle className="mt-1">{message.content}</CardTitle>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Copy Message Card Template</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center mb-2">
                  <Button
                    variant={codeType === 'html' ? 'default' : 'outline'}
                    onClick={() => setCodeType('html')}
                    className="mr-2"
                  >
                    HTML
                  </Button>
                  <Button
                    variant={codeType === 'react' ? 'default' : 'outline'}
                    onClick={() => setCodeType('react')}
                  >
                    React
                  </Button>
                </div>
                <textarea
                  value={getTemplateCode()}
                  readOnly
                  rows={6}
                  className="w-full p-2 border rounded"
                />
                <Button onClick={handleCopyCode} variant="outline">
                  <Clipboard className="w-4 h-4 mr-2" />
                  Copy to Clipboard
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <X className="w-5 h-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this message.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="text-sm">
          {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
        </div>
      </CardHeader>
      <CardContent>
        {/* Additional content can go here */}
      </CardContent>
    </Card>
  );
}
