import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, X, Image, Mic, Loader2, Square } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface FileUploadProps {
  onFilesSelected: (files: Array<{ name: string; type: string; url: string; size: number }>) => void;
}

export default function FileUpload({ onFilesSelected }: FileUploadProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 100);

      // Create object URL for local file
      const fileUrl = URL.createObjectURL(file);

      clearInterval(interval);
      setUploadProgress(100);

      const fileType = file.type.startsWith("image/") ? "image" : 
                       file.type.startsWith("audio/") ? "audio" :
                       file.type === "application/pdf" ? "pdf" : "file";

      onFilesSelected([{
        name: file.name,
        type: fileType,
        url: fileUrl,
        size: file.size,
      }]);

      setTimeout(() => {
        setUploadProgress(0);
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }, 1000);
    } catch (error) {
      console.error("Error uploading file:", error);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const startRecording = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        alert("المتصفح لا يدعم تسجيل الصوت");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(audioBlob);
        const timestamp = new Date().toLocaleTimeString("ar-SA");

        onFilesSelected([{
          name: `تسجيل_صوتي_${timestamp}.webm`,
          type: "audio",
          url: audioUrl,
          size: audioBlob.size,
        }]);

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("خطأ في الوصول إلى الميكروفون");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* File Upload Progress */}
      {isUploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-[#FF3333]">
            <span>جاري الرفع...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-1 bg-[#1a1f3a]" />
        </div>
      )}

      {/* Buttons Row */}
      <div className="flex gap-2">
        {/* Image Upload Button */}
        <Button
          onClick={() => {
            const input = fileInputRef.current;
            if (input) {
              input.accept = "image/*";
              input.click();
            }
          }}
          disabled={isUploading || isRecording}
          className="flex-1 bg-[#1a1f3a] hover:bg-[#FF0000] hover:bg-opacity-20 border border-[#FF0000] border-opacity-30 text-[#FF3333] text-sm"
        >
          <Image size={16} className="mr-2" />
          صورة
        </Button>

        {/* Audio Recording Button */}
        <Button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isUploading}
          className={`flex-1 text-sm ${
            isRecording
              ? "bg-[#FF0000] hover:bg-[#CC0000] text-white"
              : "bg-[#1a1f3a] hover:bg-[#FF0000] hover:bg-opacity-20 border border-[#FF0000] border-opacity-30 text-[#FF3333]"
          }`}
        >
          {isRecording ? (
            <>
              <Square size={16} className="mr-2" />
              إيقاف
            </>
          ) : (
            <>
              <Mic size={16} className="mr-2" />
              تسجيل
            </>
          )}
        </Button>

        {/* File Upload Button */}
        <Button
          onClick={() => {
            const input = fileInputRef.current;
            if (input) {
              input.accept = "*";
              input.click();
            }
          }}
          disabled={isUploading || isRecording}
          className="flex-1 bg-[#1a1f3a] hover:bg-[#FF0000] hover:bg-opacity-20 border border-[#FF0000] border-opacity-30 text-[#FF3333] text-sm"
        >
          <Upload size={16} className="mr-2" />
          ملف
        </Button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading || isRecording}
      />
    </div>
  );
}
