'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, Video, VideoOff, Mic, MicOff, Square, Pause, Play,
  RotateCcw, Check, X, Settings, Monitor, Smartphone, Camera,
  Loader2, FileVideo, AlertCircle, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface VideoUploadProps {
  onUpload?: (file: File, metadata: VideoMetadata) => Promise<void>;
  onCancel?: () => void;
}

interface VideoMetadata {
  title: string;
  description: string;
  subject: string;
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'lesson' | 'solution' | 'short';
  tags: string[];
}

const subjects = ['Math', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Literature', 'Computer Science'];
const difficulties = ['beginner', 'intermediate', 'advanced'];
const videoTypes = ['lesson', 'solution', 'short'];

export function VideoUpload({ onUpload, onCancel }: VideoUploadProps) {
  const [mode, setMode] = useState<'upload' | 'record'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [metadata, setMetadata] = useState<VideoMetadata>({
    title: '',
    description: '',
    subject: '',
    topic: '',
    difficulty: 'intermediate',
    type: 'lesson',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('video/')) {
        alert('Please select a video file');
        return;
      }
      if (selectedFile.size > 500 * 1024 * 1024) {
        alert('File size must be less than 500MB');
        return;
      }
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type.startsWith('video/')) {
      setFile(droppedFile);
      setPreviewUrl(URL.createObjectURL(droppedFile));
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !metadata.tags.includes(tagInput.trim())) {
      setMetadata({ ...metadata, tags: [...metadata.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setMetadata({ ...metadata, tags: metadata.tags.filter(t => t !== tag) });
  };

  const handleUpload = async () => {
    if (!file || !metadata.title || !metadata.subject) {
      alert('Please fill in required fields');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + Math.random() * 10;
      });
    }, 200);

    try {
      await onUpload?.(file, metadata);
      setUploadProgress(100);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      clearInterval(interval);
      setIsUploading(false);
    }
  };

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <FileVideo className="w-5 h-5 text-purple-400" />
          Upload Video
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mode Toggle */}
        <div className="flex gap-2">
          <Button
            variant={mode === 'upload' ? 'default' : 'outline'}
            onClick={() => setMode('upload')}
            className={mode === 'upload' ? 'bg-purple-500' : 'border-white/20'}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload File
          </Button>
          <Button
            variant={mode === 'record' ? 'default' : 'outline'}
            onClick={() => setMode('record')}
            className={mode === 'record' ? 'bg-purple-500' : 'border-white/20'}
          >
            <Video className="w-4 h-4 mr-2" />
            Record Video
          </Button>
        </div>

        {mode === 'upload' && (
          <>
            {/* Drop Zone */}
            {!file ? (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-white/20 rounded-xl p-12 text-center hover:border-purple-500/50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium text-white mb-2">
                  Drop your video here or click to browse
                </p>
                <p className="text-sm text-gray-400">
                  MP4, WebM, MOV up to 500MB
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-4">
                {/* Preview */}
                {previewUrl && (
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                    <video
                      src={previewUrl}
                      controls
                      className="w-full h-full object-contain"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setFile(null);
                        setPreviewUrl(null);
                      }}
                      className="absolute top-2 right-2"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                )}

                {/* File Info */}
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <FileVideo className="w-8 h-8 text-purple-400" />
                  <div className="flex-1">
                    <p className="font-medium text-white">{file.name}</p>
                    <p className="text-sm text-gray-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Metadata Form */}
            {file && (
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="title" className="text-white">
                    Title <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={metadata.title}
                    onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
                    placeholder="Enter video title"
                    className="bg-white/5 border-white/10 text-white mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-white">
                    Description
                  </Label>
                  <textarea
                    id="description"
                    value={metadata.description}
                    onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
                    placeholder="Describe your video"
                    className="w-full h-24 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="subject" className="text-white">
                      Subject <span className="text-red-400">*</span>
                    </Label>
                    <Select
                      value={metadata.subject}
                      onValueChange={(v) => setMetadata({ ...metadata, subject: v })}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map(s => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="topic" className="text-white">Topic</Label>
                    <Input
                      id="topic"
                      value={metadata.topic}
                      onChange={(e) => setMetadata({ ...metadata, topic: e.target.value })}
                      placeholder="e.g., Algebra, Mechanics"
                      className="bg-white/5 border-white/10 text-white mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Type</Label>
                    <Select
                      value={metadata.type}
                      onValueChange={(v: any) => setMetadata({ ...metadata, type: v })}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {videoTypes.map(t => (
                          <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white">Difficulty</Label>
                    <Select
                      value={metadata.difficulty}
                      onValueChange={(v: any) => setMetadata({ ...metadata, difficulty: v })}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1">
                        <SelectValue className="capitalize" />
                      </SelectTrigger>
                      <SelectContent>
                        {difficulties.map(d => (
                          <SelectItem key={d} value={d} className="capitalize">{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <Label className="text-white">Tags</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      placeholder="Add tags"
                      className="bg-white/5 border-white/10 text-white"
                    />
                    <Button onClick={addTag} variant="outline" className="border-white/20">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {metadata.tags.map(tag => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="border-purple-500/30 text-purple-400"
                      >
                        #{tag}
                        <button onClick={() => removeTag(tag)} className="ml-1">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Upload Progress */}
                {isUploading && (
                  <div className="space-y-2">
                    <Progress value={uploadProgress} className="h-2" />
                    <p className="text-sm text-gray-400 text-center">
                      Uploading... {Math.round(uploadProgress)}%
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={onCancel}
                    className="flex-1 border-white/20"
                    disabled={isUploading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpload}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-cyan-500"
                    disabled={isUploading || !metadata.title || !metadata.subject}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Video
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {mode === 'record' && (
          <VideoRecorder
            onRecorded={(blob) => {
              const recordedFile = new File([blob], 'recording.webm', { type: 'video/webm' });
              setFile(recordedFile);
              setPreviewUrl(URL.createObjectURL(blob));
              setMode('upload');
            }}
            onCancel={onCancel}
          />
        )}
      </CardContent>
    </Card>
  );
}

// Video Recorder Component
function VideoRecorder({ 
  onRecorded, 
  onCancel 
}: { 
  onRecorded: (blob: Blob) => void; 
  onCancel?: () => void;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraType, setCameraType] = useState<'user' | 'environment'>('user');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: cameraType },
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasPermission(true);
    } catch (error) {
      console.error('Camera access denied:', error);
      setHasPermission(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const startRecording = () => {
    if (!streamRef.current) return;

    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(streamRef.current, {
      mimeType: 'video/webm',
    });

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      onRecorded(blob);
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start(1000);
    setIsRecording(true);
    setDuration(0);

    timerRef.current = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const togglePause = () => {
    if (mediaRecorderRef.current) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        timerRef.current = setInterval(() => {
          setDuration(prev => prev + 1);
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      }
      setIsPaused(!isPaused);
    }
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Start camera on mount
  useState(() => {
    startCamera();
    return () => {
      stopCamera();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  });

  return (
    <div className="space-y-4">
      {/* Video Preview */}
      <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        
        {hasPermission === false && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
              <p className="text-white font-medium">Camera access denied</p>
              <p className="text-sm text-gray-400 mt-1">
                Please allow camera access to record
              </p>
            </div>
          </div>
        )}

        {/* Recording indicator */}
        {isRecording && (
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-white font-mono">{formatDuration(duration)}</span>
            {isPaused && <Badge className="bg-yellow-500">Paused</Badge>}
          </div>
        )}

        {/* Camera Toggle */}
        <Button
          variant="secondary"
          size="icon"
          onClick={() => {
            setCameraType(cameraType === 'user' ? 'environment' : 'user');
            stopCamera();
            startCamera();
          }}
          className="absolute top-4 right-4"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        {!isRecording ? (
          <>
            <Button variant="outline" onClick={onCancel} className="border-white/20">
              Cancel
            </Button>
            <Button
              onClick={startRecording}
              className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600"
              disabled={hasPermission === false}
            >
              <div className="w-6 h-6 bg-white rounded" />
            </Button>
            <Button variant="outline" onClick={stopCamera} className="border-white/20">
              <VideoOff className="w-4 h-4 mr-2" />
              Stop Camera
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              onClick={togglePause}
              className="border-white/20"
            >
              {isPaused ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
            <Button
              onClick={stopRecording}
              className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600"
            >
              <Square className="w-6 h-6" />
            </Button>
            <div className="w-[100px]" /> {/* Spacer */}
          </>
        )}
      </div>

      {/* Recording Tips */}
      <div className="p-4 bg-white/5 rounded-lg">
        <p className="text-sm text-gray-400">
          <strong className="text-white">Tips:</strong> Make sure you have good lighting and minimal background noise. 
          Keep your video under 10 minutes for best results.
        </p>
      </div>
    </div>
  );
}
